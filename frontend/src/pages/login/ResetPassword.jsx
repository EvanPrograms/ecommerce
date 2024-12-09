import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation } from '@apollo/client';
import { FORGOT_PASSWORD } from "../../../graphql/mutations";
import './resetpassword.css';

const ResetPassword = () => {
  const [forgotPassword, { data, loading, error }] = useMutation(FORGOT_PASSWORD);

  const signUpValidationSchema = Yup.object({
    email: Yup.string().email('invalid email').required('Email is required'),
  });

  const handleForgotPassword = async (values) => {
    try {
      await forgotPassword({ variables: { email: values.email } });
      console.log('password reset link sent');
    } catch (error) {
      console.log('Error requesting password change', error.message);
    }
  };

  return (
    <div className="reset-password-container">
      <Formik
        initialValues={{ email: '' }}
        validationSchema={signUpValidationSchema}
        onSubmit={(values) => handleForgotPassword(values)}
      >
        <Form autoComplete="off" className="form">
          <div className="email-container">
            <label htmlFor="email">Email</label>
            <Field name="email" type="text" />
            <ErrorMessage name="email" component="div" className="error" />
          </div>
          <button type="submit">Send Email</button>
        </Form>
      </Formik>
    </div>
  );
};

export default ResetPassword;
