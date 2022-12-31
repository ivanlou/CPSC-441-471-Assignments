import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Timer;
import java.util.TimerTask;
import java.util.logging.*;



public class StopWaitFtp {
	
	private static final Logger logger = Logger.getLogger("StopWaitFtp"); // global logger	

	private int timeoutInterval;
	private Timer timeout; //Timeout timer
	private Retrasmitter resender; //Timer task
	private DatagramSocket client;
	private DatagramPacket packet;
	private DatagramPacket ACK_NAK; //ACK/NAK from server
	private FtpSegment segment;
	private FtpSegment ACK_NAK_SEGMENT;
	private FileInputStream file;
	private DataInputStream inputStream; //Holds instance of TCP input stream
	private DataOutputStream outputStream;//Holds instance of TCP output stream
	private Socket TCPSocket;

	/**
	 * Constructor to initialize the program 
	 * 
	 * @param timeout		The time-out interval for the retransmission timer, in milli-seconds
	 */
	public StopWaitFtp(int timeout){
		timeoutInterval = timeout;
	}


	/**
	 * Send the specified file to the remote server
	 * 
	 * @param serverName	Name of the remote server
	 * @param serverPort	Port number of the remote server
	 * @param fileName		Name of the file to be trasferred to the rmeote server
	 */
	public void send(String serverName, int serverPort, String fileName){
		timeout = new Timer();
		

		try {

			/*
			* Handshake Sequence
			*/
			//System.out.println("TEST OUTPUT"); //For testing

			//Open TCP Connection
			TCPSocket = new Socket();
			InetAddress inetAddress = InetAddress.getByName(serverName); //Retrieve server IPAddress
			InetSocketAddress serverAddress = new InetSocketAddress(inetAddress, serverPort);  //Get server socket address
			TCPSocket.connect(serverAddress); //Connect to server

			//System.out.println(inetAddress.toString()); //for testing
			//System.out.println(serverAddress.toString()); //for testing

			//Retrieve TCP stream instances
			inputStream = new DataInputStream(TCPSocket.getInputStream()); //Holds instance of TCP input stream
			outputStream = new DataOutputStream(TCPSocket.getOutputStream()); //Holds instance of TCP output stream

			//Open UDP Connection
			client = new DatagramSocket();

			int portUDP = client.getLocalPort(); //Retrieve UDP Port
			
			Path filepath = Paths.get(fileName);
			long fileSize = Files.size(filepath); //Retrieve File Size (in bytes)
			
			//Send UDP port number, filename (UTF-8 encoded), and file length (in bytes)
			outputStream.writeInt(portUDP);
			outputStream.flush();
			outputStream.writeUTF(fileName);
			outputStream.flush();
			outputStream.writeLong(fileSize);
			outputStream.flush();

			//Receive the server UDP port number and initial sequence number used by the server
			int serverUDPPort = inputStream.readInt(); //UDP port of the server
			int initSeqNum = inputStream.readInt(); //Initial Sequence number of UDP server
			int seqNum = initSeqNum; //Sequence Number

			/*
			 * For testing
			 */
			//System.out.println("Server UDP Port: "+portUDP);
			//System.out.println("Server Initial Sequence Numebr: " + initSeqNum);


			byte[] sendData = new byte[1000]; //Data to be sent; in bytes
			byte[] rcvData = new byte[1000]; //Data that is received; in bytes
			file = new FileInputStream(fileName); //Input stream to read file
			int numBytes; //Number of bytes read from the stream
			ACK_NAK = new DatagramPacket(rcvData, rcvData.length);


			/*
			 * Stop and Wait Implementation
			 */
			while((numBytes = file.read(sendData, 0, sendData.length)) != -1){
				resender = new Retrasmitter();

				//While EOF not reached, read the file and create segments
				segment = new FtpSegment(seqNum, sendData, numBytes); //Create segment from raw data				

				packet = FtpSegment.makePacket(segment, inetAddress, serverUDPPort); //Encapsulate segment

				resender.setPacket(packet); //Give the timer task a copy of the current packet being transmitted
				resender.setSeqNum(seqNum); //Sequence Number of the packet currently in transmission
				
				System.out.println("send " + seqNum);
				sendPacket(packet); //Send the packet

				seqNum++; //increment the current sequence number to the next expected sequence number of the server

					
				timeout.scheduleAtFixedRate(resender, timeoutInterval, timeoutInterval); //Start the timer for the current packet
			


				while(true){
					client.receive(ACK_NAK); //Wait for a ACK with the correct sequence number

					ACK_NAK_SEGMENT = new FtpSegment(ACK_NAK); //de-encapsulate segment	

					if(ACK_NAK_SEGMENT.getSeqNum() == seqNum){ //Check if ACK contains correct sequence number (i.e, seqNum + 1)
						System.out.println("ack " + ACK_NAK_SEGMENT.getSeqNum());
						break; //Break the loop if the correct sequence number is received
					}
				}

				resender.cancel();				
 
				//System.out.println("TEST OUTPUT"); //For testing
				//System.out.println("Segment sent"); //For testing
			}

			//System.out.println("File sent"); //For testing


			/*
			 * Close I/O Streams
			 */
			timeout.cancel();
			timeout.purge();
			file.close();
			outputStream.close();
			inputStream.close();
			TCPSocket.close();
			client.close();

		} catch (UnknownHostException e) {
			e.printStackTrace();
			timeout.cancel();
			timeout.purge();
			try {
				file.close();
				file.close();
				outputStream.close();
				inputStream.close();
				TCPSocket.close();
			} catch (IOException e1) {
				e1.printStackTrace();
				System.exit(1);
			}
			client.close();
			System.exit(1);
		} catch (IOException e) {
			e.printStackTrace();
			timeout.cancel();
			timeout.purge();
			try {
				file.close();
				file.close();
				outputStream.close();
				inputStream.close();
				TCPSocket.close();
			} catch (IOException e1) {
				e1.printStackTrace();
				System.exit(1);
			}
			client.close();
			System.exit(1);
		} 


		
	}

	
	/**
	 * Responsible for sending/retransmitting datagrams and turning on the timer
	 * 
	 * Can only be accessed by one thread at a time
	 * 
	 * @param data - Data to be sent/retransmitted to the server
	 */
	synchronized public void sendPacket(DatagramPacket data){
		try {
			//System.out.println("Sending data"); //For testing
			client.send(data);

		} catch (IOException e) {
			e.printStackTrace();
			timeout.cancel();
			timeout.purge();
			try {
				file.close();
				file.close();
				outputStream.close();
				inputStream.close();
				TCPSocket.close();
			} catch (IOException e1) {
				e1.printStackTrace();
				System.exit(1);
			}
			client.close();
			System.exit(1);
		}
	}



	class Retrasmitter extends TimerTask{
		/*
		 * Class for retransmission
		 */

		DatagramPacket toBeRetransmitted; //Copy of the packet that was just sent
		int seqNum;
		
		//Use default constructor; contructor won't really be doing anything

		@Override
		public void run() {
			//System.out.println("Retransmitting Packet"); //For testing
			System.out.println("timeout");
			System.out.println("retx " + seqNum);
			sendPacket(toBeRetransmitted); //Retransmit the packet
		}

		public void setPacket(DatagramPacket data){
			toBeRetransmitted = data;
		}

		public void setSeqNum(int num){
			seqNum = num;
		}
		
	}



} // end of class