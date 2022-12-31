import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.logging.*;

import javax.sound.midi.Receiver;
import javax.sql.rowset.spi.TransactionalWriter;

public class GoBackFtp {
	// global logger	
	private static final Logger logger = Logger.getLogger("GoBackFtp");

	int N; //Window Size; i.e. the size of the queue for the packets
	int timeout; //Timeout length specified for retransmission 
	Timer timer = new Timer(); //Create a timer
	Resender task; //Timer task
	ConcurrentLinkedQueue<FtpSegment> trasnmissionQueue; //Transmission window


	private Socket TCPSocket; //TCP Socket for handshake
	private DataInputStream tcpInput; //Instance of TCP input stream
	private DataOutputStream tcpOutput; //Instance of TCp output stream
	private InetAddress inetAddress;

	private DatagramSocket UDPSocket; //UDP socket for client
	private DatagramPacket packet;
	private DatagramPacket serverACK; //Encapsulated ACK
	private int portUDP; //Client UDP Port

	private int serverUDPPort; 
	private int initSeqNum; //Initial sequence number to be used
	private int seqNum;
	private int firstPacket; //Sequence number of first packet in the window

	
	private FileInputStream fileInput; //Stream to read the file from
	private String file; //Filename
	private Path filepath;
	private long filesize;
	private FtpSegment segment;
	private FtpSegment ACK; //De-encapsulated ACK

	private boolean senderFinished = false; //Indicates if the sender is finished sending the file
	

	/**
	 * Constructor to initialize the program 
	 * 
	 * @param windowSize	Size of the window for Go-Back_N in units of segments
	 * @param rtoTimer		The time-out interval for the retransmission timer
	 */
	public GoBackFtp(int windowSize, int rtoTimer){
		N = windowSize;
		timeout = rtoTimer;
	}


	/**
	 * Send the specified file to the specified remote server
	 * 
	 * @param serverName	Name of the remote server
	 * @param serverPort	Port number of the remote server
	 * @param fileName		Name of the file to be trasferred to the rmeote server
	 */
	public void send(String serverName, int serverPort, String fileName){
		trasnmissionQueue = new ConcurrentLinkedQueue<FtpSegment>();
		try{

			/*
			* Handhsake Sequence
			*/

			//Open TCP Connection
			TCPSocket = new Socket(); 
			inetAddress = InetAddress.getByName(serverName); //Retrieve server IPAddress
			InetSocketAddress serverAddress = new InetSocketAddress(inetAddress, serverPort);  //Get server socket address
			TCPSocket.connect(serverAddress); //Connect to server

			//Retrieve TCP stream instances
			tcpInput = new DataInputStream(TCPSocket.getInputStream());
			tcpOutput = new DataOutputStream(TCPSocket.getOutputStream());

			//Open UDP port
			UDPSocket = new DatagramSocket();
			portUDP = UDPSocket.getLocalPort(); //Retrieve client port

			filepath = Paths.get(fileName);
			filesize = Files.size(filepath);
			file = fileName; //Store a copy of the filename

			//Send client UDP port number, filename, and filesize
			tcpOutput.writeInt(portUDP);
			tcpOutput.flush();
			tcpOutput.writeUTF(fileName);
			tcpOutput.flush();
			tcpOutput.writeLong(filesize);

			//Receive server UDP port number and initial sequence number
			serverUDPPort = tcpInput.readInt();
			initSeqNum = tcpInput.readInt();
			seqNum = initSeqNum; //Sequence number used by the client
			firstPacket = initSeqNum; 

			timer = new Timer(); //Create retransmission timer

			//Start the threads
			SenderThread sender = new SenderThread();
			Thread sending = new Thread(sender);

			ReceiverThread receiver = new ReceiverThread();
			Thread receive = new Thread(receiver);
			
			sending.start();
			receive.start();
			sending.join();
			receive.join();

			//System.out.println("File transfer finished finished; Time for clean-up"); //For testing

			//Clean-Up
			task.cancel();
			timer.cancel();
			timer.purge();
			fileInput.close();
			tcpInput.close();
			tcpOutput.close();
			TCPSocket.close();
			UDPSocket.close();
			
		} catch(ConnectException e){
			e.printStackTrace();//Clean-Up
			
			try {
				task.cancel();
				timer.cancel();
				timer.purge();
				fileInput.close();
				tcpInput.close();
				tcpOutput.close();
				TCPSocket.close();
				UDPSocket.close();
				System.exit(1);
			} catch (IOException e1) {
				e1.printStackTrace();
				System.exit(1);
			}
		}catch (UnknownHostException e) {
			e.printStackTrace();//Clean-Up
			
			try {
				task.cancel();
				timer.cancel();
				timer.purge();
				fileInput.close();
				tcpInput.close();
				tcpOutput.close();
				TCPSocket.close();
				UDPSocket.close();
				System.exit(1);
			} catch (IOException e1) {
				e1.printStackTrace();
				System.exit(1);
			}
		} catch (IOException e) {
			e.printStackTrace();

			try {
				task.cancel();
				timer.cancel();
				timer.purge();
				fileInput.close();
				tcpInput.close();
				tcpOutput.close();
				TCPSocket.close();
				UDPSocket.close();
				System.exit(1);
			} catch (IOException e1) {
				e1.printStackTrace();
				System.exit(1);
			}

		} catch (InterruptedException e) {
			e.printStackTrace();

			try {
				task.cancel();
				timer.cancel();
				timer.purge();
				fileInput.close();
				tcpInput.close();
				tcpOutput.close();
				TCPSocket.close();
				UDPSocket.close();
				System.exit(1);
			} catch (IOException e1) {
				e1.printStackTrace();
				System.exit(1);
			}

		}
		

	}

	
	/**
	 * Method to create and schedule a timer task; Can be used to start/restart the timer
	 * task when needed
	 */
	synchronized public void startTimer(){
		task = new Resender();
		timer.scheduleAtFixedRate(task, timeout, timeout);
	}

	/**
	 * Method to cancel the current timer task
	 */
	synchronized public void stopTimer(){
		task.cancel();
	}


	/**
	 * Responsible for retransmitting all datagrams that need to be retransmitted
	 * 
	 * Can only be accessed by one thread at a time
	 * 
	 * @param toBeSent - Data to be sent/retransmitted to the server
	 */
	synchronized public void sendPackets(DatagramPacket toBeSent){

		try {

			UDPSocket.send(toBeSent);

		} catch (IOException e) {
			e.printStackTrace();

			try {
				task.cancel();
				timer.cancel();
				timer.purge();
				fileInput.close();
				tcpInput.close();
				tcpOutput.close();
				TCPSocket.close();
				UDPSocket.close();
				System.exit(1);
			} catch (IOException e1) {
				e1.printStackTrace();
				System.exit(1);
			}

		}
	}



	/*
	 * The thread responsible for sending data to the server
	 */
	class SenderThread implements Runnable{

		@Override
		public void run() {

			byte[] sendData = new byte[1000]; //Data to be transmitted
			int numBytes = 0;

			try {
				
				fileInput = new FileInputStream(file); //Initialize file input stream

				while((numBytes = fileInput.read(sendData, 0, sendData.length)) != -1){
					/*
					 * While EOF not reached, keep reading the file and screating and storing segments
					 * in the queue until it is full
					 */


					if(trasnmissionQueue.size() == 0){
						/*0
						* Start timer if first packet in window is transmitted
						* 
						* Receiver thread is responsible for stopping the timer or restarting timer when 
						* queue is not empty 
						*
						*
						* The only time the sender is sending the first packet in the transmission
						* is when the queue is empty
						*/
						//System.out.println("First packet in window sent!!"); //For testing
						startTimer();
					}

					segment = new FtpSegment(seqNum, sendData, numBytes); //Create segment
					packet = FtpSegment.makePacket(segment, inetAddress, serverUDPPort); //Create packet

					while(trasnmissionQueue.size() == N && N > 1){
						/*
						 * If the window is full, wait until window can be moved
						 * 
						 * If the first segment in the window is not ACKed and the transmission queue is full,
						 * the sender will wait in this loop
						 */		
						//System.out.println("Queue full"); //For testing				
					}

					sendPackets(packet); //Send the segment

					System.out.println("send " + seqNum);
					

					trasnmissionQueue.add(segment); //Add packet to the queue a.k.a, window
					//System.out.println(segment.getSeqNum() + " Added to the queue"); //For testing

					seqNum++; //increment current sequence number
					
					//System.out.println(firstPacket); //For testing
				}
				
				senderFinished = true; //Sender is finished sending the file
				//stopTimer();
				//System.out.println("Sender finished"); //For testing

			} catch (FileNotFoundException e) {
				e.printStackTrace();

				try {
					task.cancel();
					timer.cancel();
					timer.purge();
					fileInput.close();
					tcpInput.close();
					tcpOutput.close();
					TCPSocket.close();
					UDPSocket.close();
					System.exit(1);
				} catch (IOException e1) {
					e1.printStackTrace();
					System.exit(1);
				}

			} catch (IOException e) {
				e.printStackTrace();

				try {
					task.cancel();
					timer.cancel();
					timer.purge();
					fileInput.close();
					tcpInput.close();
					tcpOutput.close();
					TCPSocket.close();
					UDPSocket.close();
					System.exit(1);
				} catch (IOException e1) {
					e1.printStackTrace();
					System.exit(1);
				}

			}
			
			//System.out.println("sender killed!"); //For testing
		}
		
	}

	/*
	 * The thread responsible for receiving data
	 */
	class ReceiverThread implements Runnable{

		byte[] rcvData = new byte[1000];
		

		@Override
		public void run() {
			serverACK = new DatagramPacket(rcvData, rcvData.length);

			try{

				UDPSocket.setSoTimeout(timeout); //Allows receiver to check if loop conditions are still met

				while((!senderFinished) || (trasnmissionQueue.size() > 0)){
					/*
					* Keep waiting for ACK if sender is not finished sending or the queue is not empty
					*/
					
					//System.out.println(serverACK); //For testing
					//System.out.println(copy); //For testing
					try{
						UDPSocket.receive(serverACK);
					} catch(SocketTimeoutException e){
						/*
						 * If a timeout occurs for the socket to check the loop conditions,
						 * end current iteration of the loop to check if conditions
						 * are still met
						 */
						continue;
					} 
					
					//System.out.println("TEST"); //For testing

					ACK = new FtpSegment(serverACK);

					int nextPacket = ACK.getSeqNum(); //Next expected packet sequence number


					if((nextPacket <= (firstPacket+N)) && (nextPacket >= firstPacket) ){
						/*
						 * The sequence number in the ACK is valid if the number is greater
						 * than the sequence number of the first packet in the window and is less
						 * than or equal to the sequence number of the packet just after the last packet in the window 
						 */

						 /*
						  * Since GBN ACKs are cumulative, the sequence number of the next expected packet
						  * will become the first packet in the window
						  */

						/*
						 * Stop timer when sequence number is valid
						 */
						stopTimer();
						//System.out.println(nextPacket); //For testing
						
						int packetsACKed = nextPacket -firstPacket; //The number of packets ACKed

						if(packetsACKed >= 1){
							/*
							 * If the ACK acknowledges one or more packets,
							 * remove these packets from queue
							 */
							for(int i = 1; i <= packetsACKed;i++){
								/*
								 * Remove all ACKed packets if multiple are ACKed
								*/
								System.out.println("ack " + nextPacket);
								trasnmissionQueue.poll();
							}
						}

						firstPacket = nextPacket; //Set next expected packet as first packet in the window

						//System.out.println(nextPacket); //For testing


						/*
						* Start the retransmission timer if queue is not empty
						*/
						if(trasnmissionQueue.size() > 0){

							//Restart timer
							startTimer();
						}
						
					}
					
					//System.out.println("Receiver running"); //For testing
					//System.out.println("Finished sneding the file!!"); //For testing
				}
				
				//System.out.println("receiver killed!"); //For testing
				
			} catch (IOException e){
				e.printStackTrace();

				try {
					task.cancel();
					timer.cancel();
					timer.purge();
					fileInput.close();
					tcpInput.close();
					tcpOutput.close();
					TCPSocket.close();
					UDPSocket.close();
					System.exit(1);
				} catch (IOException e1) {
					e1.printStackTrace();
					System.exit(1);
				}

			}
			//System.out.println("receiver killed!"); //For testing
		}
		
	}


	/*
	 * Responsible for retransmitting packets from the window
	 */
	class Resender extends TimerTask{

		@Override
		public void run() {
			
			System.out.println("timeout");
			//System.out.println(trasnmissionQueue.size()); //For testing
			

			FtpSegment[] retransmit = trasnmissionQueue.toArray(new FtpSegment[trasnmissionQueue.size()]); //Convert ConcurrentLinkedQueue into array

			for(int i = 0;i < retransmit.length; i++){ 
				/*
				 * Iterate through the array to retrieve and retransmit the packets in the queue
				 */

				
				DatagramPacket temp = FtpSegment.makePacket(retransmit[i], inetAddress, serverUDPPort); //Create packet
				int tempNum = retransmit[i].getSeqNum();
				sendPackets(temp);


				System.out.println("retx " + tempNum);
			}
			
		}
		
	}

	
} // end of class