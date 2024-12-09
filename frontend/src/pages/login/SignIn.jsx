import React, { useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { LOGIN_USER } from "../../../graphql/mutations";
import { AuthContext } from "../../context/auth-context";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import "./sign-in.css"; // Link the CSS file here

const SignIn = () => {
  const { login: authLogin } = useContext(AuthContext);
  const [loginMutation, { loading, error }] = useMutation(LOGIN_USER);
  const navigate = useNavigate();

  const handleSignIn = async (values) => {
    const { email, password } = values;
    try {
      const { data } = await loginMutation({ variables: { email, password } });
      if (data && data.login) {
        const token = data.login.token;
        const user = data.login.user;
        localStorage.setItem("user-token", token);
        authLogin(user, token); // Pass both user data and token
        navigate("/shop");
      }
    } catch (error) {
      console.error("Login attempt failed:", error);
    }
  };

  const handleForgotPassword = () => {
    navigate("/resetpassword");
  };

  const signInValidationSchema = Yup.object({
    email: Yup.string().required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  return (
    <div className="form">
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={signInValidationSchema}
        onSubmit={handleSignIn}
      >
        <Form>
          <div>
            <label htmlFor="email">Email</label>
            <Field name="email" type="text" autoComplete="email" />
            <ErrorMessage name="email" component="div" className="error" />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <Field name="password" type="password" autoComplete="current-password" />
            <ErrorMessage name="password" component="div" className="error" />
          </div>
          <button type="submit">Sign In</button>
          <button type="button" onClick={handleForgotPassword} className="forgot-password">
            Forgot Password?
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default SignIn;
