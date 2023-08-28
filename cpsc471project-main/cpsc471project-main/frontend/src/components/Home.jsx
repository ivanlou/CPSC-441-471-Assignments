import React, { useEffect, useState } from 'react';
import './styles/Home.css';

import {
  fetchFromAPI,
} from "../utils/fetchFromApi";

function Home() { 
  const [brands, setBrands] = useState([]);
  const [departments, setDepartments] = useState([]);

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
    window.location.href = "./login";
    sessionStorage.clear();
  }

  return (
    //HTML for the Home page
    <div class="home">
      <head>
      <link rel="stylesheet" href="./styles/Home.css"></link>
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
      </body>
    </div>
  );
}

export default Home;
