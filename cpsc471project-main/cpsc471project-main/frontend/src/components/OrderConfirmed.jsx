import React, { useEffect, useState } from 'react';
import './styles/Checkout.css';

import {
  fetchFromAPI,
  OrderAPI,
  AddToOrder
} from "../utils/fetchFromApi";

function Checkout() { 
  const [brands, setBrands] = useState([]);
  const [departments, setDepartments] = useState([]);
  var productsInOrder = [];
  var itemSubtotal = 0;
  var shipCost = 0;
  var tax = 0;
  var grandTotal = 0;
  parseCart(); 

  useEffect(() => {
    brandData();
    departmentData();
  }, []);

  const brandData = async () => {
    fetchFromAPI('user/getBrands').then((data) => {
      setBrands(data);
    }) 
  };

  const departmentData = async () => {
    fetchFromAPI('user/getDepartments').then((data) => {
      setDepartments(data);
    }) 
  };

  const clear = () => {
    window.location.href = "http://localhost:3000/login";
    sessionStorage.clear();
  }

  function parseCart(){
    if(sessionStorage.getItem("cart") == null) { return; }
    var wholeStringAsArray = sessionStorage.getItem("cart").split('\n');
    for(var i = 0; i < wholeStringAsArray.length; i++){
      var productAsArray = wholeStringAsArray[i].split(',');
      var json = { id: productAsArray[0], description: productAsArray[1], price: productAsArray[2],
      brandname: productAsArray[3], filename:productAsArray[4], sku_num:productAsArray[5]};
      productsInOrder.push(json);
      itemSubtotal += parseFloat(productAsArray[2]);
      shipCost += 3.15;
    }
    tax = itemSubtotal * 0.1;
    grandTotal = tax + itemSubtotal + shipCost;
    console.log(productsInOrder);
  }

   // Function that executes when the submit button is pressed
   const placeOrder = async (event) => {
    let email = sessionStorage.getItem("loggedInEmail");
    let orderDate = new Date();
    let shipDate = new Date(orderDate);
    shipDate.setDate(shipDate.getDate() + 2);
    let estDelivery = new Date(shipDate);
    estDelivery.setDate(estDelivery.getDate() + 2);
    let isCancelled = false;
    let street = document.getElementById('street').value;
    let city = document.getElementById('city').value;
    let province = document.getElementById('province').value;
    let postal = document.getElementById('postal').value;
    event.preventDefault();
    try {
      const data = await OrderAPI(email, orderDate, shipDate, itemSubtotal, shipCost, tax, estDelivery, street, city, province, postal, isCancelled);
      for(var i = 0; i < productsInOrder.length; i++){
        const data2 = await AddToOrder(data.insertId, productsInOrder[i].id, productsInOrder[i].sku_num);
      }
      window.location.href = "http://localhost:3000/myOrder/checkout/orderConfirmed";
    } catch (error) {
      console.error(error);
    }
  };

  return (
    //HTML for the Brand feed
    <div class="checkout">
      <head>
      <link rel="stylesheet" href="./styles/Checkout.css"></link>
        <title>Order page</title>
      </head>
      <body>
      <div class="navbar">
  <a href="http://localhost:3000/home">Home</a>
  <div class="subnav">
    <button class="subnavbtn">Departments ▼</button>
    <div class="subnav-content">
        {departments.map((department) => (
        <a href={`http://localhost:3000/department/${department.DName}`}>{department.DName}</a>
      ))}
    </div>
  </div> 
  <div class="subnav">
    <button class="subnavbtn">Brands ▼</button>
    <div class="subnav-content">
        {brands.map((brand) => (
        <a href={`http://localhost:3000/brand/${brand.BrandName}`}>{brand.BrandName}</a>
      ))}
    </div>
  </div> 
  <a href="http://localhost:3000/myOrder">My Order</a>
  <div id="log-in-out">
  { sessionStorage.getItem('loggedInUser') != null?
  <div class="subnav">
  <button class="subnavbtn" onClick={clear}>Log out</button>
  </div>: 
  <div class="subnav">
  <a href="http://localhost:3000/login">Log in</a>
  </div> }
  </div>
</div>
{ sessionStorage.getItem('loggedInUser') != null?
<p id="welcome-text">
    {`Welcome, ${sessionStorage.getItem('loggedInUser')}`}
  </p>:
  <p id="welcome-text">
  Not logged in
</p>
}
<div class="myorder-text">
<h1>
  {`Confirm Order`}
  <div class="payment-form">
    <h1>Enter payment details</h1>

    <form class="payment-content" onSubmit={placeOrder}>
          <div class="city-field">
          <label class="payment-label" for="city">City:</label>
            <input type="text" id="city" name="city" required></input><br></br>
          </div>
          <div class="province-field">
          <label class="payment-label" for="province">Province:</label>
            <input type="text" id="province" name="province" required></input><br></br>
          </div>
          <div class="street-field">
          <label class="payment-label" for="street">Street:</label>
            <input type="text" id="street" name="street" required></input><br></br>
          </div>
          <div class="postal-field">
          <label class="payment-label" for="postal">Postal Code:</label>
            <input type="text" id="postal" name="postal" required></input><br></br>
          </div>

          <div class="item-subtotal">
            Item Subtotal: {`$${itemSubtotal.toFixed(2)}`}
          </div>
          <div class="ship-cost">
            Shipping Cost: {`$${shipCost.toFixed(2)}`}
          </div>
          <div class="tax">
            Tax: {`$${tax.toFixed(2)}`}
          </div>
          <div class="grand-total">
            Grand Total: {`$${grandTotal.toFixed(2)}`}
          </div>
          <div class="card-field">
          <label class="payment-label" for="card">Card Number:</label>
            <input type="text" id="card" name="card" required></input><br></br>
          </div>
        <input type="submit" id="order-button" value="Place Order"></input>
        </form>

  </div>
</h1>
</div>
<div id="catalogue2">
  {productsInOrder.map((product) => (
    <div class="card2">
    <img class="img2-confirm" src={require(`./img/${product.filename}`)} alt=""></img> 
    <p class="description2">{product.description}</p>
    <p class="price2">{`Brand: ${product.brandname}, Price: $${product.price}, SKU#: ${product.sku_num}`}</p>
  </div>
  ))}
</div>
      </body>
    </div>
  );
}

export default Checkout;
