import React from 'react';
import './styles/Login.css';

import {
  LoginAPI,
} from "../utils/fetchFromApi";

function Login() {

  // Function that executes when the submit button is pressed
  const handleSubmit = async (event) => {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let email = document.getElementById('email').value;
    event.preventDefault();
    try {
      const data = await LoginAPI(username,password,email);
      if(data[0].IsBanned){
        return alert('This account has been banned and cannot login');
      }
      window.location.href = "./home";
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
        <div class="login-header">
        <h1>Login</h1>
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
        <p class="help-text">
        Don't have an account?<br></br>
        <a href="./register" class="create-link">
          Create one now
        </a>
      </p>
        </form>
      </body>
    </div>
  );
}

export default Login;
