import React, { useEffect, useState } from 'react';
import './styles/MyOrder.css';

import {
  fetchFromAPI,
} from "../utils/fetchFromApi";

function MyOrder() { 
  const [brands, setBrands] = useState([]);
  const [departments, setDepartments] = useState([]);
  var productsInOrder = [];
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

  const proceed = () => {
    window.location.href = "http://localhost:3000/myOrder/checkout";
  }

  function parseCart(){
    if(sessionStorage.getItem("cart") == null) { return; }
    var wholeStringAsArray = sessionStorage.getItem("cart").split('\n');
    for(var i = 0; i < wholeStringAsArray.length; i++){
      var productAsArray = wholeStringAsArray[i].split(',');
      var json = { id: productAsArray[0], description: productAsArray[1], price: productAsArray[2],
      brandname: productAsArray[3], filename:productAsArray[4]};
      productsInOrder.push(json);
    }
    console.log(productsInOrder);
  }

  return (
    //HTML for the Brand feed
    <div class="myOrder">
      <head>
      <link rel="stylesheet" href="./styles/MyOrder.css"></link>
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
  {`My Order:`}
  <button class="checkout-button" onClick={proceed}>Proceed To Checkout ▶</button>
</h1>
</div>
<div id="catalogue">
  {productsInOrder.map((product) => (
    <div class="card">
    <img class="img2" src={require(`./img/${product.filename}`)} alt=""></img> 
    <p class="description">{product.description}</p>
    <p class="price">${product.price}</p>
    <p><button>Add to Order</button></p>
  </div>
  ))}
</div>
      </body>
    </div>
  );
}

export default MyOrder;
