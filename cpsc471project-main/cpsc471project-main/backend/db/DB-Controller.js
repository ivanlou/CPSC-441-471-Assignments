/*
    The functions in this file will act as a middle-man between database and the webpage.
    Any modifications made to the database will be done through these functions.
*/

//The block of code below establishes a connection by default
const mysql = require ('mysql');
var Promise = require('promise');

var con = mysql.createConnection( {
    host: "localhost",
    user: "root",
    password: "Justin.K66", //Switch out with your actual password for MySQL  my own password
    database: 'department_store'
} );

con.connect( function(err){
    if(err) throw err;
    console.log("Connection to MySQL Database Successful");
} );




/**
 * @username - The username of a registered user
 * @password - Password associated with the account
 * 
 * Customer Log-in
 */
const logIn = (username, password, email) => {
    let SQLquery = 'select * from account where username = "'+username+'" and password = "' +password+'" and email = "' +email+'"';
    return new Promise((resolve, reject) => {
        con.query(SQLquery, (err, result) => {
            if(err){
                return reject(err);
            }
            if(result.length){
                return resolve(JSON.parse(JSON.stringify(result)));
            }
            return resolve(false);
        })
    });
}

/**
 * @username - The username of a registered user
 * @password - Password associated with the account
 * 
 * Customer Log-in
 */
const loginAdmin = (username, password, email) => {
    let SQLquery = 'select * from adminaccount where username = "'+username+'" and password = "' +password+'" and email = "' +email+'"';
    return new Promise((resolve, reject) => {
        con.query(SQLquery, (err, result) => {
            if(err){
                return reject(err);
            }
            if(result.length){
                return resolve(true);
            }
            return resolve(false);
        })
    });
}

/**
 * @username - The username of a registered user
 * @password - Password associated with the account
 * 
 * Admin Log-in
 */
function logInAdmin(username, password, email){
    
    let SQLquery = "SELECT EXISTS(SELECT * FROM Account WHERE Username = '"+ username + "' AND Password = '"+ password + "') AND EXISTS(SELECT * FROM Admin WHERE Email = '"+ email + "')";

        con.query(SQLquery, function(err, result){
            if(err) throw err;
            if(result){
                //window.location.href = "./webpage_name.html"; //After log-in, direct to the desired webpage
                console.log('Admin login successful');
            }
        });

}

/**
 * @username - The desired username of a customer who is registering a new account
 * @password - Password associated with the account
 * 
 * Registers a customer account to the database.
 */
function registerCustomerAccount(username, password, email, first_name, last_name, age, gender, phone_num){

    let CustomerInfo = "INSERT INTO Customer (Email, Fname, Lname, Age, Gender, Phone) VALUES ('" + email + "', '" + first_name + "', '" + last_name + "', '" + age + "', '" + gender + "', '" + phone_num + "')";

    let accountInfo = "INSERT INTO Account (Username, Email, Password, IsBanned) VALUES ('" + username + "', '" + email + "', '" + password + "', false)";

        con.query(CustomerInfo, function(err, result){
            if(err){
                return;
            };

            con.query(accountInfo, function(err, result){
                if(err) {
                    return;
                };
                
                //window.location.href = "./webpage_name.html"; //After successful registration, direct to the desired webpage
                console.log('Customer Registration successful');
            });  
        });
    
}


/**
 * @username - The desired username of a customer who is registering a new account
 * @password - Password associated with the account
 * 
 * Registers an admin to the database
 */
function registerAdminAccount(username, password, email, first_name, last_name, age, gender, phone_num, position){
    let CustomerInfo = "INSERT INTO Admin (Email, Fname, Lname, Age, Gender, Phone, Position) VALUES ('" + email + "', '" + first_name + "', '" + last_name + "', '" + age + "', '" + gender + "', '" + phone_num + "', '" + position + "')";

    let accountInfo = "INSERT INTO AdminAccount (Username, Email, Password) VALUES ('" + username + "', '" + email + "', '" + password + "')";
        
        con.query(CustomerInfo, function(err, result){
            if(err){
                //If err, it means that email is already registered to another customer, cannot make account
            };

            con.query(accountInfo, function(err, result){
                if(err) throw err; //If err, it means that username is already used, cannot make account
                
                //window.location.href = "./webpage_name.html"; //After successful registration, direct to the desired webpage
                console.log('Admin Registration successful');
            });
            
        });
}

/**
 * 
 * Fetch brands
 */
const getBrands = () => {
    let SQLquery = 'select * from Brand';
    return new Promise((resolve, reject) => {
        con.query(SQLquery, (err, result) => {
            if(err){
                return reject(err);
            }
            return resolve(JSON.parse(JSON.stringify(result)));
        })
    });
}

/**
 * 
 * Fetch departments
 */
const getDepartments = () => {
    let SQLquery = 'select * from Department';
    return new Promise((resolve, reject) => {
        con.query(SQLquery, (err, result) => {
            if(err){
                return reject(err);
            }
            return resolve(JSON.parse(JSON.stringify(result)));
        })
    });
}

/**
 * 
 * Fetch products that belong to a department
 */
const getProductsFromDepartment = (dname) => {
    let SQLquery = 'select * from (Product_SKU join Product on Product_SKU.ItemID = Product.ItemID) where DepartmentName = "' + dname + '"';
    return new Promise((resolve, reject) => {
        con.query(SQLquery, (err, result) => {
            if(err){
                return reject(err);
            }
            return resolve(JSON.parse(JSON.stringify(result)));
        })
    });
}

/**
 * 
 * Fetch products that belong to a brand
 */
const getProductsFromBrand = (brandName) => {
    let SQLquery = 'select * from (Product_SKU join Product on Product_SKU.ItemID = Product.ItemID) where BrandName = "' + brandName + '"';
    return new Promise((resolve, reject) => {
        con.query(SQLquery, (err, result) => {
            if(err){
                return reject(err);
            }
            return resolve(JSON.parse(JSON.stringify(result)));
        })
    });
}

/**
 * 
 * Fetch categories that belong to a department
 */
const getCategoriesFromDepartment = (dname) => {
    let SQLquery = 'select * from dept_categories where Dname = "' + dname + '"';
    return new Promise((resolve, reject) => {
        con.query(SQLquery, (err, result) => {
            if(err){
                return reject(err);
            }
            return resolve(JSON.parse(JSON.stringify(result)));
        })
    });
}

/**
 * 
 * Fetch products that belong to a category in a department
 */
const getProductsFromCategory = (dname, cname) => {
    let SQLquery = 'select * from (Product_SKU join Product on Product_SKU.ItemID = Product.ItemID) where DepartmentName = "' + dname + '" and Category = "' + cname + '"';
    return new Promise((resolve, reject) => {
        con.query(SQLquery, (err, result) => {
            if(err){
                return reject(err);
            }
            return resolve(JSON.parse(JSON.stringify(result)));
        })
    });
}

/**
 * 
 * Create a new order
 */
const createOrder = (Email, OrderDate, ShipDate, ItemSubtotal, ShipCost, Tax, EstDelivery, Street, City, Province, Postal, IsCancelled) => {
    let SQLquery = 'insert into `Order`(OrderID, Customer_Email, OrderDate, ShipDate, ItemsCost, ShipCost, Tax, EstDeliveryDate, Street, City, Province, Postal, IsCancelled) values (default, "' +Email + '", "' + OrderDate +'", "' +ShipDate+'", ' +ItemSubtotal+', ' +ShipCost+', ' +Tax+', "' +EstDelivery + '", "' +Street + '","' + City+'","' + Province+'","' + Postal+'",' + IsCancelled+')';
    console.log(SQLquery);
    return new Promise((resolve, reject) => {
        con.query(SQLquery, (err, result) => {
            if(err){
                console.log(err);
                return reject(err);
            }
            return resolve(JSON.parse(JSON.stringify(result)));
        })
    });
}

/**
 * 
 * Add to order
 */
const addToOrder = (orderID, itemID, itemSKU) => {
    let SQLquery = 'insert into order_contains(OrderID, ItemID, ItemSKU) values ('+orderID+','+itemID+','+itemSKU+' )';
    console.log(SQLquery);
    return new Promise((resolve, reject) => {
        con.query(SQLquery, (err, result) => {
            if(err){
                console.log(err);
                return reject(err);
            }
            return resolve(JSON.parse(JSON.stringify(result)));
        })
    });
}

/**
 * 
 * Create a new order
 */
const getOrderID = () => {
    let SQLquery = 'select last_insert_id()';
    return new Promise((resolve, reject) => {
        con.query(SQLquery, (err, result) => {
            if(err){
                return reject(err);
            }
            return resolve(JSON.parse(JSON.stringify(result)));
        })
    });
}

/**
 * 
 * Fetch all users in the db
 */
const getUsers= () => {
    let SQLquery = 'select * from account';
    return new Promise((resolve, reject) => {
        con.query(SQLquery, (err, result) => {
            if(err){
                return reject(err);
            }
            return resolve(JSON.parse(JSON.stringify(result)));
        })
    });
}

/**
 * 
 * @param {*} adminEmail - Admin administering ban
 * @param {*} customerUsername - Username of customer account receiving ban
 * @param {*} action - disciplinary action taken; for now ban is the only action
 * @param {*} reason - reason for administering ban
 * @param {*} date - date ban was applied
 */
function moderateAccount(adminEmail, customerUsername, action, reason, date){

}

module.exports = {
    logIn,
    loginAdmin,
    registerCustomerAccount,
    registerAdminAccount,
    getBrands,
    getDepartments,
    getProductsFromDepartment,
    getProductsFromBrand,
    getCategoriesFromDepartment,
    getProductsFromCategory,
    createOrder,
    addToOrder,
    getOrderID,
    getUsers,
};