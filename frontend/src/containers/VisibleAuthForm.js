import { connect } from 'react-redux';
import {
  updateField,
  submitAuth,
  handleAuthAction,
  setError
} from 'actions/authForm';
import AuthService from 'services/AuthService';
import AuthForm from 'components/AuthForm';
import mainLogo from 'images/mainLogo.svg';
import authSocket from 'helpers/constants/authSocket';

const mapStateToProps = state => {
  const { name, email, pass } = state.authForm;
  return {
    socket: authSocket,
    logo: mainLogo,
    name,
    email,
    pass
  }
};

const mapDispatchToProps = dispatch => ({
  updateField: (fieldType, value) => dispatch(updateField(fieldType, value)),
  submitAuth: (formType) => dispatch(submitAuth(formType)),
  handleAuthAction: (authType) => dispatch(handleAuthAction(authType)),
  setError: (message) => dispatch(setError(message))
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthForm);