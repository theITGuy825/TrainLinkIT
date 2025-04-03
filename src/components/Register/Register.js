import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { auth, db } from '../../firebase'; // Import Firebase auth and Firestore
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Firebase auth function
import { doc, setDoc } from "firebase/firestore"; // Firestore functions

import './register.css'

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    userType: "freelancer", // Default user type
    businessName: "", // Business-specific fields
    businessAddress: "",
    businessDescription: "",
  });

  const [errors, setErrors] = useState({});
  const [error, setError] = useState(''); // For general errors like sign up failure
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUserTypeChange = (e) => {
    setFormData({ ...formData, userType: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};
    // Email validation for all user types
    if (!formData.email || !formData.email.includes("@")) {
      newErrors.email = "Enter a valid email";
    }
    // Password validation for all user types
    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    // Freelancer-specific validation
    if (formData.userType === "freelancer") {
      if (!formData.firstName) newErrors.firstName = "First name is required";
      if (!formData.lastName) newErrors.lastName = "Last name is required";
    }
    // Business-specific validation
    if (formData.userType === "business") {
      if (!formData.businessName) newErrors.businessName = "Business name is required";
      if (!formData.businessAddress) newErrors.businessAddress = "Business address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        // Prepare user data for Firestore
        const userData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          userType: formData.userType,
          uid: user.uid, // Store the UID as userId
          profilePic: "",
        };

        // Add business-specific fields if userType is "business"
        if (formData.userType === "business") {
          userData.businessName = formData.businessName;
          userData.businessAddress = formData.businessAddress;
          userData.businessDescription = formData.businessDescription;
        }

        // Add user data to Firestore
        await setDoc(doc(db, "users", user.uid), userData);

        alert("Registration successful!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          userType: "freelancer",
          businessName: "",
          businessAddress: "",
          businessDescription: "",
        }); // Reset form
        navigate("/login"); // Redirect to login page after successful registration
      } catch (err) {
        let errorMessage = "Failed to create account, please try again.";
        if (err.code === "auth/email-already-in-use") {
          errorMessage = "This email is already in use.";
        } else if (err.code === "auth/weak-password") {
          errorMessage = "Password should be at least 6 characters.";
        } else if (err.code === "auth/invalid-email") {
          errorMessage = "Invalid email address.";
        }
        setError(errorMessage);
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    
    <div id='register-container' className='register-container-register'>
    <img src='/image073263.png' alt="description" className='logo-register'/>
    <div className='register-form-register'>
      <h2 className='register-header-register'>REGISTER</h2>
      <form className='form-register' onSubmit={handleSubmit}>
        {/* Always render email field */}
        <label className='label-register' htmlFor="email">Email:</label>
        <input
          className='input-register'
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <span className='error-register'>{errors.email}</span>
        <br/>

        {/* Always render password field */}
        <label className='label-register' htmlFor="password">Password:</label>
        <input
          className='input-register'
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <span className='error-register'>{errors.password}</span>
        <br/>

        {/* User type selection */}
        <label className='label-register' htmlFor="userType">User Type:</label>
        <select
          className='select-register'
          id="userType"
          name="userType"
          value={formData.userType}
          onChange={handleUserTypeChange}
        >
          <option value="freelancer">Freelancer</option>
          <option value="business">Business</option>
        </select>
        <br/><br/>

        {/* Conditionally render freelancer-specific fields */}
        {formData.userType === "freelancer" && (
          <div className='freelancer-fields-register'>
            <label className='label-register' htmlFor="firstName">First Name:</label>
            <input
              className='input-register'
              id="firstName"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              required
            />
            <span className='error-register'>{errors.firstName}</span>

            <label className='label-register' htmlFor="lastName">Last Name:</label>
            <input
              className='input-register'
              id="lastName"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              required
            />
            <span className='error-register'>{errors.lastName}</span>
          </div>
        )}

        {/* Conditionally render business-specific fields */}
        {formData.userType === "business" && (
          <div className='business-fields-register'>
            <label className='label-register' htmlFor="businessName">Business Name:</label>
            <input
              className='input-register'
              id="businessName"
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              placeholder="Business Name"
              required
            />
            <span className='error-register'>{errors.businessName}</span>

            <label className='label-register' htmlFor="businessAddress">Business Address:</label>
            <input
              className='input-register'
              id="businessAddress"
              type="text"
              name="businessAddress"
              value={formData.businessAddress}
              onChange={handleChange}
              placeholder="Business Address"
              required
            />
            <span className='error-register'>{errors.businessAddress}</span>

            <label className='label-register' htmlFor="businessDescription">Business Description:</label>
            <textarea
              className='textarea-register'
              id="businessDescription"
              name="businessDescription"
              value={formData.businessDescription}
              onChange={handleChange}
              placeholder="Business Description"
            />
          </div>
        )}

        <button 
          className='submit-button-register'
          type="submit" 
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
        {error && <p className='error-message-register' style={{ color: "red" }}>{error}</p>}
      </form>
      <p className='login-redirect-register'>
        Already have an account? <span className='login-link-register' onClick={() => navigate("/login")}>Sign In</span>
      </p>
    </div>
</div>
  );
}

export default Register;