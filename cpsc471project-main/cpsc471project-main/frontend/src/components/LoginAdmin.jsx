import React from 'react';
import './styles/LoginAdmin.css';

import {
  AdminLogin
} from "../utils/fetchFromApi";

function LoginAdmin() {

  // Function that executes when the submit button is pressed
  const handleSubmit = async (event) => {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let email = document.getElementById('email').value;
    event.preventDefault();
    try {
      const data = await AdminLogin(username,password,email);
      window.location.href = "./adminPanel";
      sessionStorage.setItem("loggedInUser", username);
      sessionStorage.setItem("loggedInEmail", email);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    //HTML for the login page
    <div class="login-box">
      <head>
      <link rel="stylesheet" href="./styles/login.css"></link>
        <title>Login Page</title>
      </head>
      <body>
        <div class="login-header2">
        <h1>Admin Login</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div class="username-field">
          <label for="username">Username:</label>
            <input type="text" id="username" name="username" required></input><br></br>
          </div>
        <div class="password-field">
          <label for="password">Password:</label>
          <input type="password" id="password" name="password" required></input><br></br>
        </div>
        <div class="email-field">
          <label for="email">Email:</label>
          <input type="text" id="email" name="email" required></input><br></br>
        </div>
        <input type="submit" id="login-button" value="Login"></input>
        </form>
      </body>
    </div>
  );
}

export default LoginAdmin;
