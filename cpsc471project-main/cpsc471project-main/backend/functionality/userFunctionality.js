const db = require('../db/DB-Controller');

/*
  All functionality for commands related to users
  This is where the data from the http requests are processed
*/

//Registers a new user, has to have unique username
const registerUser = async (req, res) => {
    try {
      const { username, password, email, fname, lname, age, gender, phone } = req.body;
      db.registerCustomerAccount(username, password, email, fname,
        lname, age, gender, phone);
      res.status(201).json({ validReg: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
  };

//Registers a new admin, has to have unique username
const registerAdmin = async (req, res) => {
  try {
    const { username, password, email, fname, lname, age, gender, phone, position } = req.body;
    db.registerAdminAccount(username, password, email, fname,
      lname, age, gender, phone, position);
    res.status(201).json({ validReg: true });
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
  }
};

  //Logins an exisitng user, according to request body.
const loginUser = async (req, res) => {
  try{
    const { username, password, email } = req.body;
    const valid = await db.logIn(username, password, email);
    if(!valid)
    {
      return res.status(401).json({ message: "The username or password is incorrect" });
    }
    res.status(200).json(valid);
  }
  catch(error){
    res.status(500).json({ message: error.message });
  }
};

  //Logins an admin
  const loginAdmin = async (req, res) => {
    try{
      const { username, password, email } = req.body;
      const valid = await db.loginAdmin(username, password, email);
      if(!valid)
      {
        return res.status(401).json({ message: "The username or password is incorrect" });
      }
      res.status(200).json({ message: "Login successful" });
    }
    catch(error){
      res.status(500).json({ message: error.message });
    }
  };

//Gets all brand names in the db
const getBrands = async (req, res) => {
  try{
    const brands = await db.getBrands();
    console.log(brands);
    if(!brands)
    {
      return res.status(404).json({ message: "No brands in the database" });
    }
    res.status(200).json(brands);
  }
  catch(error){
    res.status(500).json({ message: error.message });
  }
};

//Gets all departments in the db
const getDepartments = async (req, res) => {
  try{
    const departments = await db.getDepartments();
    console.log(departments);
    if(!departments)
    {
      return res.status(404).json({ message: "No departents in the database" });
    }
    res.status(200).json(departments);
  }
  catch(error){
    res.status(500).json({ message: error.message });
  }
};

//Gets all products from a certain department in the db
const getDepartmentProducts = async (req, res) => {
  const dname = req.params.dname;
  try{
    const products = await db.getProductsFromDepartment(dname);
    console.log(products);
    if(!products)
    {
      return res.status(404).json({ message: "No products belong to this department" });
    }
    res.status(200).json(products);
  }
  catch(error){
    res.status(500).json({ message: error.message });
  } 
};

//Gets all products from a certain brand in the db
const getBrandProducts = async (req, res) => {
  const brandName = req.params.brandName;
  console.log(brandName);
  try{
    const products = await db.getProductsFromBrand(brandName);
    console.log(products);
    if(!products)
    {
      return res.status(404).json({ message: "No products belong to this brand" });
    }
    res.status(200).json(products);
  }
  catch(error){
    res.status(500).json({ message: error.message });
  } 
};

//Gets all products from a certain department in the db
const getDepartmentCategories = async (req, res) => {
  const dname = req.params.dname;
  try{
    const categories = await db.getCategoriesFromDepartment(dname);
    console.log(categories);
    if(!categories)
    {
      return res.status(404).json({ message: "This department has no categories" });
    }
    res.status(200).json(categories);
  }
  catch(error){
    res.status(500).json({ message: error.message });
  } 
};

//Gets all products from a certain department and category in the db
const getCategoryProducts = async (req, res) => {
  const dname = req.params.dname;
  const cname = req.params.cname;
  try{
    const products = await db.getProductsFromCategory(dname, cname);
    console.log(products);
    if(!products)
    {
      return res.status(404).json({ message: "No products belong to this category in this department" });
    }
    res.status(200).json(products);
  }
  catch(error){
    res.status(500).json({ message: error.message });
  } 
};

  //Create an order
  const createOrder = async (req, res) => {
    try{
      const { email, orderDate, shipDate, itemsCost, shipCost, tax, estDeliveryDate, street, city, province, postal, isCancelled } = req.body;
      const order = await db.createOrder(email, orderDate, shipDate, itemsCost, shipCost, tax, estDeliveryDate, street, city, province, postal, isCancelled);
      const id = await db.getOrderID();
      if(!order)
      {
        return res.status(401).json({ message: "The order could not be created" });
      }
      res.status(200).json(order);
    }
    catch(error){
      res.status(500).json({ message: error.message });
    }
  };

   //Add an item to an order
   const addToOrder = async (req, res) => {
    try{
      const { orderID, itemID, itemSKU } = req.body;
      const order = await db.addToOrder(orderID, itemID, itemSKU);
      if(!order)
      {
        return res.status(401).json({ message: "The item could not be added" });
      }
      res.status(200).json(order);
    }
    catch(error){
      res.status(500).json({ message: error.message });
    }
  };

  //Gets all users in the db
const getUsers = async (req, res) => {
  try{
    const users = await db.getUsers();
    console.log(users);
    if(!users)
    {
      return res.status(404).json({ message: "No users are in the db" });
    }
    res.status(200).json(users);
  }
  catch(error){
    res.status(500).json({ message: error.message });
  } 
};

module.exports = {
    registerUser,
    registerAdmin,
    loginUser,
    loginAdmin,
    getBrands,
    getDepartments,
    getDepartmentProducts,
    getBrandProducts,
    getDepartmentCategories,
    getCategoryProducts,
    createOrder,
    addToOrder,
    getUsers,
  };