import java.sql.SQLException;

/*
 * Driver of the system; Responsible for running the GUI and JDBC API
 */

public class systemDriver {
    public static void main(String[] args) throws SQLException {
        systemGUI GUIdriver = new systemGUI();
        systemJDBC jdbcDriver = new systemJDBC();

        GUIdriver.logIn_register_Screen();
    }
}
