import React, { useState, useEffect, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { LOGIN_USER } from '../../../graphql/mutations'
import { AuthContext } from '../../context/auth-context'
import { useMutation } from "@apollo/client";


const SignIn = () => {
  const { login: authLogin } = useContext(AuthContext)
  // const [ login, { data, error, loading } ] = useMutation(LOGIN_USER)
  const [loginMutation, { loading, error }] = useMutation(LOGIN_USER);

  // useEffect(() => {
  //   if (data && data.login) {
  //     console.log('Mutation successful:', data)
  //     const token = data.login.value
  //     localStorage.setItem('user-token', token)
  //     authLogin(token)
  //   }
  //   if (error) {
  //     console.error("Login Failed:", error.message)
  //   }
  // }, [data, error, authLogin])

  const handleSignIn = async (values) => {
    const { username, password } = values;
    try {
      const { data } = await loginMutation({ variables: { username, password } });
      if (data && data.login) {
        console.log("Mutation response:", data);
        const token = data.login.value;
        localStorage.setItem('user-token', token)
        const user = data.login.user
        authLogin(token); // Pass both user data and token
      }
    } catch (error) {
      console.error("Login attempt failed:", error);
    }
  };

  const signInValidationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required')
  })

  // const handleSignIn = async (values) => {
  //   try {
  //     const response = await axios.post('/api/login', values)
  //     console.log('Login successful', response.data)
  //   } catch (error) {
  //     console.error('Login failed', error.response.data)
  //   }
  // }
  return (
    <div className="form">
      <Formik
      initialValues={{ username: '', password: '' }}
      validationSchema={signInValidationSchema}
      onSubmit={handleSignIn}
      >
        <Form>
          <div>
            <label htmlFor="username">Username</label>
            <Field name="username" type="text" autoComplete="username"/>
            <ErrorMessage name="username" component="div" />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <Field name="password" type="password" autoComplete="current-password"/>
            <ErrorMessage name="password" component="div" />
          </div>
          <button type="submit">Sign In</button>
        </Form>
      </Formik>
    </div>
  )
}

export default SignIn