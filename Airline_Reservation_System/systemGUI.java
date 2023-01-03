import javax.security.auth.login.LoginContext;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JMenu;
import javax.swing.JMenuBar;
import javax.swing.JMenuItem;
import javax.swing.JOptionPane;
import javax.swing.JTextField;

import java.awt.event.ActionListener;
import java.awt.event.ActionEvent;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.Font;

/*
 * This class will be responsible for displaying an interactable user interface for the system
 */

public class systemGUI implements ActionListener{
    JTextField username = new JTextField();
    JTextField password = new JTextField();
    JTextField fullName = new JTextField();
    JButton logInButton = new JButton("Log-In"); //Log-in the user
    JButton registerScreen = new JButton("Register"); //Brings up registeration screen
    JButton registerButton = new JButton("Register"); //Register user to the system
    JButton booking = new JButton(); //Books the user's ticket
    JButton cancel = new JButton(); //User cancels a reservation
    JFrame logIn = new JFrame(); //Log-in screen
    JFrame register = new JFrame(); //User registration screen
    JFrame user = new JFrame(); //User homepage screen
    JMenuBar mainMenuBar = new JMenuBar();
    JMenuBar userMenuBar = new JMenuBar();
    JMenu back = new JMenu("Back");
    JMenu loggingOut = new JMenu("Log-Out");
    JMenu viewBookings = new JMenu("View/Cancel Bookings"); //NOTE: Can cancel bookings from the frame that pops up from clicking this
    JMenuItem goBack = new JMenuItem("Back to Log-In"); 
    JMenuItem logOut = new JMenuItem("Log-Out and return to main menu");
    JMenuItem viewItem = new JMenuItem();

    systemJDBC system = new systemJDBC(0);


    /**
     * Displays the screen for the system that asks if the user wants to register or log-in.
     * 
     * If user clicks registerScreen button, registration screen pops up 
     */
    public void logIn_register_Screen(){
        //------Add buttons and have them listen to being clicked
        logInButton.addActionListener(this);
        logInButton.setFocusable(false);
        registerScreen.addActionListener(this);
        registerScreen.setFocusable(false);

        
        //-------Set the text fields
        username.setPreferredSize(new Dimension(250,40));
        password.setPreferredSize(new Dimension(250,40));
        username.setFont(new Font("Times New Roman", Font.PLAIN, 25));
        password.setFont(new Font("Times New Roman", Font.PLAIN, 25));
        username.setText("Username");
        password.setText("Password");
        

        //----------Add the components above to the screen
        logIn.setTitle("User Log-In");
        logIn.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        logIn.setLayout(new FlowLayout());
        logIn.add(username);
        logIn.add(password);
        logIn.add(logInButton);
        logIn.add(registerScreen);
        logIn.pack();

        logIn.setVisible(true);
    }


    /**
     * Displays the registration screen to the user
     */
    public void register_screen(){
        //--------Set-up the buttons, menu and text-fields
        
        goBack.addActionListener(this);
        back.add(goBack);
        mainMenuBar.add(back);
        register.setJMenuBar(mainMenuBar);

        registerButton.addActionListener(this);
        registerButton.setFocusable(false);

        username.setPreferredSize(new Dimension(250,40));
        password.setPreferredSize(new Dimension(250,40));
        fullName.setPreferredSize(new Dimension(250,40));
        username.setFont(new Font("Times New Roman", Font.PLAIN, 25));
        password.setFont(new Font("Times New Roman", Font.PLAIN, 25));
        fullName.setFont(new Font("Times New Roman", Font.PLAIN, 25));
        username.setText("Username");
        password.setText("Password");
        fullName.setText("Full Name");
        
        //-------Add components to frame
        register.setTitle("User Log-In");
        register.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        register.setLayout(new FlowLayout());
        register.add(fullName);
        register.add(username);
        register.add(password);
        register.add(registerButton);
        register.pack();

        register.setVisible(true);
    }


    /**
     * 
     * @param fullName - full name of the user
     */
    public void userHome(){

        logOut.addActionListener(this);
        loggingOut.add(logOut);
        userMenuBar.add(loggingOut);
        register.setJMenuBar(userMenuBar);

        user.setTitle("User Homepage");
        user.setSize(500, 500);
        user.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        
        viewItem.addActionListener(this);
        viewBookings.add(viewItem);
        userMenuBar.add(viewBookings);

        user.setJMenuBar(userMenuBar);
        user.setVisible(true);
        
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if(e.getSource() == logInButton){
            /*
             * Perform the following actions when logInButton is pressed
             */
            String temp = username.getText();
            String temp2 = password.getText();

            boolean userExists = system.logInCheck(temp, temp2);

            if(userExists){
                logIn.dispose();
                userHome();
            } else {
                JOptionPane.showMessageDialog(null, "Incorrect Username and Password; Retry Again", 
                                                "Log-In Failed", JOptionPane.PLAIN_MESSAGE);
            }

            //System.out.println(temp + " " + temp2);
        }

        if(e.getSource() == registerScreen){
            //Open registration screen
            
            logIn.dispose();
            register_screen();
        }


        if(e.getSource() == registerButton){
            String temp = username.getText();
            String temp2 = password.getText();
            String temp3 = fullName.getText();

            boolean registered = system.register(temp3, temp, temp2);

            if(!registered){
                JOptionPane.showMessageDialog(null, "Username already taken, please choose a different username", 
                                                "Registration Failed", JOptionPane.PLAIN_MESSAGE);
            } else{
                JOptionPane.showMessageDialog(null, "Welcome "+temp+"!", 
                                                "Welcome New User", JOptionPane.PLAIN_MESSAGE);
                userHome();
            }
        }
        
        if(e.getSource() == goBack){
            logIn_register_Screen();
            register.dispose();
            
        }

        if(e.getSource() == logOut){
            logIn_register_Screen();
            user.dispose();
        }
    }
}
