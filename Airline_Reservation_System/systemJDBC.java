import java.sql.*;

/*
 * This class will act as an API for the system driver to 
 * access and modify the system database
 * 
 * NOTE**:
 * -For the code below to work properly, you need to add the appropriate MySQL Connector jar file to your
 *  Java Projects referenced libraries
 */

public class systemJDBC {

    Statement sql; //Runs MySQL
    String output = new String(); 
    ResultSet result ; //Holds the output from SQL
    String query; //Stores the query to be executed

    
    public static void main(String[] args) throws SQLException {
        systemJDBC system = new systemJDBC();
        boolean test = system.logIn("Paulo", "Password3");
        if(test){
            System.out.println("User exists");
        } else{
            System.out.println("User does not exists");
        }
    }
    

    /**
     * Creates and auto-fills the tables used for the Java project
     * @throws SQLException
     */
    public systemJDBC() throws SQLException{
        //Constructor will create and auto-fill the following tables: users, tickets, seats, flights

       

        try{
            Class.forName("com.mysql.cj.jdbc.Driver"); //Ensures that the mysql connector is working
            String dbURL = "jdbc:mysql://localhost:3306/airline_ticket_reservation";
            Connection dbConnect = DriverManager.getConnection(dbURL, "root", "SpartanKiller747!"); //bridge between MySQL and Java
            sql = dbConnect.createStatement(); //Allows SQL statement to be executed
            

            //-----Create and populate the table called `users`
            query = "CREATE TABLE users (" +
                    "`FullName` varchar(50) NOT NULL,"+
                    "`Username` varchar(45) NOT NULL,"+
                    "`Password` varchar(45) NOT NULL,"+
                    "PRIMARY KEY (`FullName`, `Username`, `Password`)"+
                    ");";

            sql.executeUpdate(query); //Create table `users`
            
            query = "INSERT into users (FullName, Username, Password) values "+
                    "('Ivan Lou Tompong', 'Ivan', 'Password1'),"+
                    "('Paulo', 'Paulo', 'Password2'),"+
                    "('Jeremiah', 'Jeremiah', 'Password3'),"+
                    "('Jordan', 'Jordan', 'Password4');";

            sql.executeUpdate(query); //Populate the `users` table


            //------Create table called `tickets`
            query = "CREATE TABLE tickets (" +
                    "`TicketHolder` varchar(45) NOT NULL,"+
                    "`TicketNumber` int NOT NULL,"+
                    "`FlightNumber` varchar(45) NOT NULL,"+
                    "`DepartureTime` varchar(45) NOT NULL,"+
                    "`GateNumber` varchar(45) NOT NULL,"+
                    "`SeatNumber` varchar(45) NOT NULL,"+
                    "PRIMARY KEY (`TicketHolder`)"+
                    ");";

            sql.executeUpdate(query); //Create table `tickets`


            //-------Create table called `flights`
            query = "CREATE TABLE flights (" +
                    "`FlightNumber` int NOT NULL,"+
                    "`DepartureTime` varchar(45) NOT NULL,"+
                    "`GateNumber` varchar(45) DEFAULT NULL,"+
                    "PRIMARY KEY (`FlightNumber`)"+
                    ");";

            sql.executeUpdate(query); //Create table `flights`

            //------Populate table 'flights'
            query = "INSERT into flights (FlightNumber, DepartureTime, GateNumber) values "+
                    "(1, '12:00pm', 'G1'), "+
                    "(2, '1:00pm', 'G2'), "+
                    "(3, '2:00pm', 'G3'), " +
                    "(4, '3:00pm', 'G4'), "+
                    "(5, '4:00pm', 'G5');";

                    sql.executeUpdate(query);
            
            sql.close();

        } catch (ClassNotFoundException e){
            //Fires if JAR does not work right
            System.out.println("JAR file not right");
            e.printStackTrace();
        }  catch (SQLException ex){
            System.out.println("Something wrong with MySQL");
            ex.printStackTrace();
        }
        
    }

    public void createTicket(int ticketNum, String departureTime, String gateNumber, String seatNumber, String ticketHolder, int flightNum){

    }

    public void register(String fullName, String username, String password){

    }

    public void bookFlight(int flightNum, String departureTime){

    }


    /**
     * Verifies the log-in information
     * @param username
     * @param password
     * @return
     */
    public boolean logIn(String username, String password){
        boolean userExists = false;
        
        try{
            Class.forName("com.mysql.cj.jdbc.Driver"); //Ensures that the mysql connector is working
            String dbURL = "jdbc:mysql://localhost:3306/airline_ticket_reservation";
            Connection dbConnect = DriverManager.getConnection(dbURL, "root", "SpartanKiller747!"); //bridge between MySQL and Java
            sql = dbConnect.createStatement(); //Allows SQL statement to be executed
            
            //----Confirm if the user is already registered in the system
            query = "select exists (select * from users where Username = '"+username+"' and Password = '"+password+"');";
            result = sql.executeQuery(query);

            result.next();
            userExists = result.getBoolean(1);
            
            if(userExists){
                userExists = true;
            }

            sql.close();

        } catch (ClassNotFoundException e){
            //Fires if JAR does not work right
            System.out.println("JAR file not right");
            e.printStackTrace();
        }  catch (SQLException ex){
            System.out.println("Something wrong with MySQL");
            ex.printStackTrace();
        }

        return userExists;
    }

    //Add functions for displaying information in GUI as needed
}
