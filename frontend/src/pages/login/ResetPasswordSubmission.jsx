import { useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { RESET_PASSWORD } from "../../../graphql/mutations";
import { useMutation } from '@apollo/client';
import { useSearchParams } from "react-router-dom";

const ResetPasswordSubmission = () => {
  const [searchParams] = useSearchParams()
  const userId = searchParams.get("userId")
  const token = searchParams.get("token")
  console.log("UserId: ", userId, "Token: ", token)
  const [resetPassword, { data, loading, error}] = useMutation(RESET_PASSWORD)


  const signUpValidationSchema = Yup.object({
    newPassword: Yup.string().required('Password is required')
  });

  const handleResetPassword = async (values) => {
    try {
      await resetPassword({ 
        variables: { 
          userId: userId,
          token: token,
          newPassword: values.newPassword
          } 
      })
      console.log('Sending mutation with:', {
        userId,
        token,
        newPassword: values.newPassword
      });
      console.log('password should be reset')
    } catch (error) {
      console.log('Error requesting password change', error.message)
    }

  }

  return (
    <Formik
      initialValues={{ newPassword: '' }}
      validationSchema={signUpValidationSchema}
      onSubmit={(values) => handleResetPassword(values)}
    >
      <Form>
        <div>
          <label htmlFor="newPassword">New Password</label>
          <Field name="newPassword" type="password" />
          <ErrorMessage name="newPassword" component="div" />
        </div>
        <button type="submit">Reset Password</button>
      </Form>
    </Formik>
  );
};

export default ResetPasswordSubmission