/**
 * GzipClient Class
 * 
 * The GzipClient class is responsible for connecting to the server and
 * sending files to the server to be compressed into a gzip (.gz) file
 * 
 * CPSC 441 - Assignment 1
 * 
 * @author: Ivan Lou Tompong
 *
 */



import java.util.logging.*;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.*;


public class GzipClient {

	private static final Logger logger = Logger.getLogger("GzipClient"); // global logger

	//Buffers
	public byte[] readBuffer; //Used when the program is reading the input file and sending it to the server
	public byte[] writeBuffer; //Used when the program is receiving the compressed version of the input file

	public int numBytes = 0; //Number of bytes read from or written to the socket


	//Variables to store the instances of the socket input and output stream
	public BufferedInputStream inputStream; 
	public BufferedOutputStream outputStream;

	//Buffered file reader and writer
	public BufferedInputStream input; //Reads the input file 
	public BufferedOutputStream output; //Writes to the output file

	//Socket for connection
	private Socket socket = new Socket();




	/**
	 * Constructor to initialize the class.
	 * 
	 * To Do: you should implement this method.
	 * 
	 * @param serverName	remote server name
	 * @param serverPort	remote server port number
	 * @param bufferSize	buffer size used for read/write
	 * 
	 * @exception IOException - if an I/O error occurs when creating the input stream, the socket is closed, the socket is not connected, 
	 * 							or the socket input has been shutdown using shutdownInput()
	 */
	public GzipClient(String serverName, int serverPort, int bufferSize){

		try {
			//Retrieve server address
			InetAddress inetAddress = InetAddress.getByName(serverName); //get server IP address by name
			InetSocketAddress serverAddress = new InetSocketAddress(inetAddress, serverPort);  //Get server socket address

			//Connect the client to the server
			socket.connect(serverAddress);

			//Get instance of the input and output stream
			inputStream = new BufferedInputStream(socket.getInputStream());
			outputStream = new BufferedOutputStream(socket.getOutputStream());

			//Set Buffer Sizes
			readBuffer = new byte[bufferSize];
			writeBuffer = new byte[bufferSize];

		} catch (Exception e) {

			//Catches exceptions thrown; If an exception is caught, print stack on to standard output and close program

			e.printStackTrace();
			System.exit(1);
		}
	}

	
	/**
	 * Compress the specified file using the remote server.
	 * 
	 * To Do: you should implement this method.
	 * 
	 * @param inName		name of the input file to be compressed
	 * @param outName		name of the output compressed file
	 */
	public void gzip(String inName, String outName){
		try {

			//Initialize buffered file reader and writer
			input = new BufferedInputStream(new FileInputStream(inName));
			output = new BufferedOutputStream(new FileOutputStream(outName));

		} catch (Exception e) {

			//Catches exceptions thrown; If an exception is caught, print stack on to standard output and close program

			e.printStackTrace();
			System.exit(1);
		}

		//Create thread that will handle the response of the server
		ReaderThread reader = new ReaderThread();
		Thread receiver = new Thread(reader);

		//Create thread that will send message to the server
		WriterThread writer = new WriterThread();
		Thread sender = new Thread(writer); 
		
		sender.start();
		receiver.start();		

		try {
			sender.join();
			receiver.join();
			
			input.close();
			output.close();
			inputStream.close();
			outputStream.close();
			socket.close();

		} catch (Exception e) {

			//Catches exceptions thrown; If an exception is caught, print stack on to standard output and close program

			e.printStackTrace();
			System.exit(1);
		}
		
		
	}


	//The classes below implement the parallel design for reading/writing to the socket
	class WriterThread implements Runnable{
		//Thread responsible for writing to the server
		public void run(){
			try {

				//While the EOF is not yet reached, read the contents of the file and write to the output stream
				while((numBytes = input.read(readBuffer, 0, readBuffer.length)) != -1){

					outputStream.write(readBuffer, 0, numBytes); //Write to server
					outputStream.flush(); //flush the buffer; ensures message is sent

					System.out.println("W "+numBytes); //Print how many bytes were written to the socket
				}

				//Close output stream once the writer thread has finished sending all of the contents of the uncompressed file
				try {
					socket.shutdownOutput();
				} catch (Exception e) {

					//Catches exceptions thrown; If an exception is caught, print stack on to standard output and close program

					e.printStackTrace();
					System.exit(1);
				}

			} catch (Exception e) {

				//Catches exceptions thrown; If an exception is caught, print stack on to standard output and close program

				e.printStackTrace();
				System.exit(1);
			}


		}
	}
	

	/**
	 *   
	 */
	class ReaderThread implements Runnable{
		//Thread responsible for reading from the server
		public void run(){
			
			try {

				while((numBytes = inputStream.read(writeBuffer, 0, writeBuffer.length)) != -1){ //Check if input stream has reached end of file
						
					try {
						 
						output.write(writeBuffer, 0, numBytes); //Write the bytes into the desired output file
						output.flush(); //Flush buffer
						System.out.println("R "+ numBytes);
					
						
					} catch (Exception e) {

						//Catches exceptions thrown; If an exception is caught, print stack on to standard output and close program

						e.printStackTrace();
						System.exit(1);
					}
				}

				try {
					socket.shutdownInput();
				} catch (Exception e) {

					//Catches exceptions thrown; If an exception is caught, print stack on to standard output and close program

					e.printStackTrace();
					System.exit(1);
				}
			} catch (Exception e) {

				//Catches exceptions thrown; If an exception is caught, print stack on to standard output and close program

				e.printStackTrace();
				System.exit(1);
			}
			
		}
	}

	
}


