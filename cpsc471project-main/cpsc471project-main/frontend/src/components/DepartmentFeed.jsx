import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import './styles/DepartmentFeed.css';

import {
  fetchFromAPI,
} from "../utils/fetchFromApi";

function DepartmentFeed() { 
  const { dname } = useParams();
  const [brands, setBrands] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  var cart = [];

  useEffect(() => {
    brandData();
    departmentData();
    productData();
    categoryData();
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

  const productData = async () => {
    fetchFromAPI('user/department/'+dname+'/getProducts').then((data) => {
      setProducts(data);
    }) 
  };

  const categoryData = async () => {
    fetchFromAPI('user/department/'+dname+'/getCategories').then((data) => {
      setCategories(data);
    }) 
  };

  const clear = () => {
    window.location.href = "http://localhost:3000/login";
    sessionStorage.clear();
  }

  const addToCart = (id, description, price, brandname, filename, sku_num) => {
    const cart = [id, description, price, brandname, filename, sku_num];
    if(sessionStorage.getItem("cart") == null){
      sessionStorage.setItem("cart", cart);
    }
    else{
      sessionStorage.setItem("cart", sessionStorage.getItem("cart") + '\n' + cart);
    }
  }

  return (
    //HTML for the Department feed
    <div class="departmentFeed">
      <head>
      <link rel="stylesheet" href="./styles/DepartmentFeed.css"></link>
        <title>Home Page</title>
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
<div class="department-text">
<h1>
  {`Department: ${dname}`}
  <div class="dropdown">
  <button class="dropbtn">Select Category ▼</button>
  <div class="dropdown-content">
    { categories.map((category) => (
      <a href={`http://localhost:3000/department/${dname}/${category.DCategories}`}>
        {category.DCategories}</a>
    ))}
    <a href={`http://localhost:3000/department/${dname}`}>All</a>
  </div>
</div>
</h1>
</div>
<div id="catalogue">
  {products.map((product) => (
    <div class="card">
    <img class="img2" src={require(`./img/${product.FileName}`)} alt=""></img> 
    <p class="description">{product.ItemDescription}</p>
    <p class="price">${product.Price}</p>
    <p><button onClick={() => {addToCart(product.ItemID, product.ItemDescription, product.Price, product.BrandName, product.FileName, product.SKU_Num);} }>Add to Order</button></p>
  </div>
  ))}
</div>
      </body>
    </div>
  );
}

export default DepartmentFeed;
