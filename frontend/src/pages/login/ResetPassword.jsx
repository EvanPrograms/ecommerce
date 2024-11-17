import React, { useState, useContext, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from "react-router-dom";
import { useMutation } from '@apollo/client';
import { FORGOT_PASSWORD } from "../../../graphql/mutations";
import { AuthContext } from '../../context/auth-context'


const ResetPassword = () => {
  const [forgotPassword, { data, loading, error}] = useMutation(FORGOT_PASSWORD)
  const navigate = useNavigate()

  const signUpValidationSchema = Yup.object({
    email: Yup.string().required('Email is required')
  });

  const handleForgotPassword = async (values) => {
    try {
      await forgotPassword({ variables: { email: values.email } })
      // navigate('/resetpasswordform')
      console.log('password reset link sent')
    } catch (error) {
      console.log('Error requesting password change', error.message)
    }

  }

  return (
    <Formik
      initialValues={{ email: '' }}
      validationSchema={signUpValidationSchema}
      onSubmit={(values) => handleForgotPassword(values)}
    >
      <Form>
        <div>
          <label htmlFor="email">Email</label>
          <Field name="email" type="text" />
          <ErrorMessage name="email" component="div" />
        </div>
        <button type="submit">
          Send Email
        </button>
      </Form>
    </Formik>
  );
};

export default ResetPassword