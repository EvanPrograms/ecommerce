import React, { useState, useContext, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { useMutation } from '@apollo/client';
import { CREATE_USER } from "../../../graphql/mutations";
import { LOGIN_USER } from "../../../graphql/mutations";
import { AuthContext } from '../../context/auth-context'


const SignUp = () => {
  const navigate = useNavigate()
  const { login: authLogin } = useContext(AuthContext)

  const [createUser, { error }] = useMutation(CREATE_USER)
  
  const [ login, { data: loginData, error: loginError } ] = useMutation(LOGIN_USER)


  
  const signUpValidationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    name: Yup.string().required('Name is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSignUp = async (values) => {
    try {
      const { data: createUserData } = await createUser({ variables: values })
      console.log('Sign up successful', createUserData)
      const { data: loginData } = await login({ variables: values });
      if (loginData && loginData.login) {
        console.log("Mutation response:", loginData);
        const token = loginData.login.token;
        const user = loginData.login.user; // Assuming user data is available
        authLogin(user, token); // Pass user data and token to context
        localStorage.setItem('user-token', token); // Store token
        navigate('/shop'); // Redirect after login
      }
      navigate('/shop')
    } catch (err) {
      console.error('Sign up error:', err)
    }
  }

  // const handleSignUp = async (values) => {
  //   try {
  //     // console.log('API URL:', process.env.VITE_API_URL)
  //     const response = await axios.post(`http://localhost:5000/api/users`, values)
  //     console.log('sign up successful', response.data)
  //     navigate('/shop')
  //   } catch (error) {
  //     console.log('Sign up error', error)
  //   }
  // }

  return (
    <Formik
      initialValues={{ username: '', name: '', password: '' }}
      validationSchema={signUpValidationSchema}
      onSubmit={handleSignUp}
    >
      <Form>
        <div>
          <label htmlFor="username">Username</label>
          <Field name="username" type="text" />
          <ErrorMessage name="username" component="div" />
        </div>
        <div>
          <label htmlFor="name">Name</label>
          <Field name="name" type="text" />
          <ErrorMessage name="name" component="div" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <Field name="password" type="password" />
          <ErrorMessage name="password" component="div" />
        </div>
        <button type="submit">
          Create user
        </button>
      </Form>
    </Formik>
  );
};

export default SignUp