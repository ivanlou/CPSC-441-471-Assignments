import React, { useEffect, useState } from 'react';
import './styles/AdminPanel.css';

import {
  fetchFromAPI,
} from "../utils/fetchFromApi";

function Home() { 
  const [brands, setBrands] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    brandData();
    departmentData();
    userData();
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

  const userData = async () => {
    fetchFromAPI('user/getUsers').then((data) => {
      setUsers(data);
    }) 
  };

  const clear = () => {
    window.location.href = "./login";
    sessionStorage.clear();
  }

  return (
    //HTML for the admin panel
    <div class="adminPanel">
      <head>
      <link rel="stylesheet" href="./styles/AdminPanel.css"></link>
        <title>Admin Panel</title>
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
<div class="admin-text">
    <h1>
      Administration Panel
    </h1>
  </div>
  <div id="catalogue2">
  {users.map((user) => (
    <div class="card2">
    <p class="user-text">Username: {user.Username}</p>
    <p class="email-text">Email: {user.Email}</p>
    <button class="ban">Ban</button>
  </div>
  ))}
</div>
      </body>
    </div>
  );
}

export default Home;
