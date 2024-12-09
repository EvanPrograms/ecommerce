import React from "react";
import SignIn from "./SignIn";
import { useNavigate } from "react-router-dom";
import './auth-page.css'

const AuthPage = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
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