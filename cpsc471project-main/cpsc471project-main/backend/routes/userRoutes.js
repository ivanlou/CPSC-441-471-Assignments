const express = require("express");
const router = express.Router();

const {
    registerUser,
    registerAdmin,
    loginUser,
    getBrands,
    getDepartments,
    getDepartmentProducts,
    getBrandProducts,
    getDepartmentCategories,
    getCategoryProducts,
    createOrder,
    addToOrder,
    loginAdmin,
    getUsers
  } = require("../functionality/userFunctionality.js");

/* User routes */

//Register a new user
router.post("/register", registerUser);

//Register a new admin
router.post("/registerAdmin", registerAdmin);

//Login a user
router.post("/login", loginUser);

//Login an admin
router.post("/loginAdmin", loginAdmin);

//Create a new order
router.post("/createOrder", createOrder);

//Add to an existing order
router.post("/addToOrder", addToOrder);

//Gets all brands from the database
router.get("/getBrands", getBrands);

//Gets all departments from the database
router.get("/getDepartments", getDepartments);

//Gets all products from a certain department
router.get("/department/:dname/getProducts", getDepartmentProducts);

//Gets all products from a certain department and category
router.get("/department/:dname/:cname/getProducts", getCategoryProducts);

//Gets all categories in a certain department
router.get("/department/:dname/getCategories", getDepartmentCategories);

//Gets all products from a certain brand
router.get("/brand/:brandName/getProducts", getBrandProducts);

//Gets all users in the db
router.get("/getUsers", getUsers);

module.exports = router;