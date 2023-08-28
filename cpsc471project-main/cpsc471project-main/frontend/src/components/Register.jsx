import React from 'react';
import './styles/Register.css';

import {
  RegisterAPI,
} from "../utils/fetchFromApi";

function Register() {

  // Function that executes when the submit button is pressed
  const handleSubmit = async (event) => {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let email = document.getElementById('email').value;
    let fname = document.getElementById('fname').value;
    let lname = document.getElementById('lname').value;
    let age = document.getElementById('age').value;
    let gender = document.getElementById('gender').value;
    let phone = document.getElementById('phone').value;
    event.preventDefault();
    try {
      const data = await RegisterAPI(username,password,email, fname, lname,
        age, gender, phone);
      window.location.href = "/";
    } catch (error) {
      console.error(error);
    }
  };

  return (
    //HTML for the registration page
    <div class="register-box">
      <head>
      <link rel="stylesheet" href="./styles/register.css"></link>
        <title>Registration Page</title>
      </head>
      <body>
        <h1>Register</h1>
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
        <div class="fname-field">
          <label for="fname">First Name:</label>
          <input type="text" id="fname" name="fname" required></input><br></br>
        </div>
        <div class="lname-field">
          <label for="lname">Last Name:</label>
          <input type="text" id="lname" name="lname" required></input><br></br>
        </div>
        <div class="age-field">
          <label for="age">Age:</label>
          <input type="text" id="age" name="age" required></input><br></br>
        </div>
        <label id="gender-label">
        Gender:
          <select id="gender">
              <option value="M">Male</option>
              <option value="F">Female</option>
          </select>
        </label>
        <div class="phone-field">
          <label for="phone">Phone Number:</label>
          <input type="text" id="phone" name="phone" required></input><br></br>
        </div>
        <input type="submit" id="submit-button" value="Register"></input>
        </form>
      </body>
    </div>
  );
}

export default Register;
