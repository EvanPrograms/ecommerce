import React, { useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from "react-router-dom";
import { useMutation } from '@apollo/client';
import { CREATE_USER } from "../../../graphql/mutations";
import { LOGIN_USER } from "../../../graphql/mutations";
import { AuthContext } from '../../context/auth-context';
import './signup.css';

const SignUp = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useContext(AuthContext);

  const [createUser, { error }] = useMutation(CREATE_USER);
  const [login, { data: loginData, error: loginError }] = useMutation(LOGIN_USER);

  const signUpValidationSchema = Yup.object({
    email: Yup.string().required('Email is required'),
    name: Yup.string().required('Name is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSignUp = async (values) => {
    try {
      const { data: createUserData } = await createUser({ variables: values });
      console.log('Sign up successful', createUserData);
      const { data: loginData } = await login({ variables: values });
      if (loginData && loginData.login) {
        console.log("Mutation response:", loginData);
        const token = loginData.login.token;
        const user = loginData.login.user; 
        authLogin(user, token); 
        localStorage.setItem('user-token', token); 
        navigate('/shop'); 
      }
      navigate('/shop');
    } catch (err) {
      console.error('Sign up error:', err);
    }
  };

  return (
    <div className="signup-container">
      <Formik
        initialValues={{ email: '', name: '', password: '' }}
        validationSchema={signUpValidationSchema}
        onSubmit={handleSignUp}
      >
        <Form className="form">
          <div className="input-container">
            <label htmlFor="email">Email</label>
            <Field name="email" type="text" />
            <ErrorMessage name="email" component="div" className="error" />
          </div>
          <div className="input-container">
            <label htmlFor="name">Name</label>
            <Field name="name" type="text" />
            <ErrorMessage name="name" component="div" className="error" />
          </div>
          <div className="input-container">
            <label htmlFor="password">Password</label>
            <Field name="password" type="password" />
            <ErrorMessage name="password" component="div" className="error" />
          </div>
          <button type="submit">Create user</button>
        </Form>
      </Formik>
    </div>
  );
};

export default SignUp;
