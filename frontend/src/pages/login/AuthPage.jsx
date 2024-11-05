import React from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const navigate = useNavigate()
  return (
    <div>
      <h1>Sign In</h1>
      <SignIn />
      <h1>Create New User</h1>
      <button onClick={() => navigate('/signup')}>
        Create New User
      </button> 
    </div>
  );
};

export default AuthPage;