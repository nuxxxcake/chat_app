import React from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { toggleLogged } from 'actions/authForm';
import socket from 'helpers/api';
import VisibleAuthForm from 'containers/VisibleAuthForm'; 
import Chat from 'containers/Chat';

const App = ({ isLogged }) => {
  if (isLogged)
    return <Chat />;
  return <Authenfication />;
}

const mapState = state => ({ 
  isLogged: state.authForm.isLogged
});

App.propTypes = {
  isLogged: PropTypes.bool.isRequired
}

export default connect(mapState)(App);