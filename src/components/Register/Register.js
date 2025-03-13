import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { auth, db } from '../../firebase'; // Import Firebase auth and Firestore
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Firebase auth function
import { doc, setDoc } from "firebase/firestore"; // Firestore functions

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUserTypeChange = (e) => {
    setFormData({ ...formData, userType: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email.includes("@")) newErrors.email = "Enter a valid email";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";

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
        setError("Failed to create account, please try again.");
        console.error(err);
      }
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="firstName">First Name:</label>
        <input
          id="firstName"
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="First Name"
        />
        <span>{errors.firstName}</span>

        <label htmlFor="lastName">Last Name:</label>
        <input
          id="lastName"
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Last Name"
        />
        <span>{errors.lastName}</span>

        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <span>{errors.email}</span>

        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
        />
        <span>{errors.password}</span>

        <label htmlFor="userType">User Type:</label>
        <select
          id="userType"
          name="userType"
          value={formData.userType}
          onChange={handleUserTypeChange}
        >
          <option value="freelancer">Freelancer</option>
          <option value="business">Business</option>
        </select>

        {/* Conditionally render business-specific fields */}
        {formData.userType === "business" && (
          <>
            <label htmlFor="businessName">Business Name:</label>
            <input
              id="businessName"
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              placeholder="Business Name"
            />
            <span>{errors.businessName}</span>

            <label htmlFor="businessAddress">Business Address:</label>
            <input
              id="businessAddress"
              type="text"
              name="businessAddress"
              value={formData.businessAddress}
              onChange={handleChange}
              placeholder="Business Address"
            />
            <span>{errors.businessAddress}</span>

            <label htmlFor="businessDescription">Business Description:</label>
            <textarea
              id="businessDescription"
              name="businessDescription"
              value={formData.businessDescription}
              onChange={handleChange}
              placeholder="Business Description"
            />
          </>
        )}

        <button type="submit">Register</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
      <p>
        Already have an account? <span onClick={() => navigate("/login")}>Sign In</span>
      </p>
    </div>
  );
}

export default Register;
