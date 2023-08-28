import axios from "axios";

const BASE_URL = "http://localhost:8000";

//General function to make get requests to api
export const fetchFromAPI = async (url) => {
  const { data } = await axios.get(`${BASE_URL}/${url}`);
  return data;
};

// Endpoint to login
export const LoginAPI = async (Username, Password, Email) => {
  const response = await axios
    .post(`${BASE_URL}/user/login`, {
      username: Username,
      password: Password,
      email: Email,
    })
    .catch((error) => {
      if (error.response) {
        console.error(error);
        alert("Login failed. Please try again.");
      }
    });
    console.log('response data: ' + response.data);
  return response.data;
};

// Endpoint to login as an admin
export const AdminLogin = async (Username, Password, Email) => {
  const response = await axios
    .post(`${BASE_URL}/user/loginAdmin`, {
      username: Username,
      password: Password,
      email: Email,
    })
    .catch((error) => {
      if (error.response) {
        console.error(error);
        alert("Login failed. Please try again.");
      }
    });
    console.log('response data: ' + response.data);
  return response.data;
};

// Endpoint to register
export const RegisterAPI = async (Username, Password, Email, Fname, Lname, Age, Gender, Phone) => {
  const response = await axios
    .post(`${BASE_URL}/user/register`, {
      username: Username,
      password: Password,
      email: Email,
      fname: Fname,
      lname: Lname,
      age: Age, 
      gender: Gender,
      phone: Phone
    })
    .catch((error) => {
      if (error.response) {
        console.error(error);
        alert("Registration failed. Please try again.");
      }
    });
  return response.data;
};

// Endpoint to register admin
export const RegisterAdminAPI = async (Username, Password, Email, Fname, Lname, Age, Gender, Phone, Position) => {
  const response = await axios
    .post(`${BASE_URL}/user/registerAdmin`, {
      username: Username,
      password: Password,
      email: Email,
      fname: Fname,
      lname: Lname,
      age: Age, 
      gender: Gender,
      phone: Phone,
      position: Position
    })
    .catch((error) => {
      if (error.response) {
        console.error(error);
        alert("Admin Registration failed. Please try again.");
      }
    });
  return response.data;
};

// Endpoint to create order entry
export const OrderAPI = async (Email, OrderDate, ShipDate, ItemSubtotal, ShipCost, Tax, EstDelivery, Street, City, Province, Postal, IsCancelled) => {
  const response = await axios
    .post(`${BASE_URL}/user/createOrder`, {
      email: Email,
      orderDate: OrderDate,
      shipDate: ShipDate,
      itemsCost: ItemSubtotal,
      shipCost: ShipCost,
      tax: Tax,
      estDeliveryDate: EstDelivery,
      street: Street,
      city: City,
      province: Province,
      postal: Postal,
      isCancelled: IsCancelled
    })
    .catch((error) => {
      if (error.response) {
        console.error(error);
        alert("Order creation failed. Please try again.");
      }
    });
    console.log('response data: ' + response.data);
  return response.data;
};

// Endpoint to add to order_contains 
export const AddToOrder = async (OrderID, ItemID, ItemSKU) => {
  const response = await axios
    .post(`${BASE_URL}/user/addToOrder`, {
      orderID: OrderID,
      itemID: ItemID,
      itemSKU: ItemSKU
    })
    .catch((error) => {
      if (error.response) {
        console.error(error);
        alert("Could not add to order. Please try again.");
      }
    });
    console.log('response data: ' + response.data);
  return response.data;
};
