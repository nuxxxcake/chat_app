import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { toggleLogged } from 'actions/authForm';
// import socket from 'helpers/api';
import Chat from 'containers/Chat';
import VisibleAuthForm from 'containers/VisibleAuthForm';
import VisibleResetPass from 'containers/VisibleResetPass';
import {
  Switch,
  Route,
  useHistory
} from "react-router-dom";
import { useCookies } from 'react-cookie';

const App = ({ isLogged }) => {
  // Hooks
  const history = useHistory();
  const [cookies] = useCookies(['user_id']);
  const [isSend, setSend] = useState(false);

  useEffect(() => {
    if (isLogged) history.push('/');
    else history.push('/auth');
  }, [isLogged]);

  useEffect(() => {
    socket.emit('sendCookies', () => cookies.get('user_id'));

  }, [isSend]);
   
  useEffect(() => {
    socket.on('getCookies', (res) => {
      console.log(res);
    });
  }, []);

  return (
    <Switch>
      <Route path="/auth/forgot/:token" component={VisibleResetPass} />
      <Route path="/auth" component={VisibleAuthForm} />
      <Route path="/" component={Chat}/>
    </Switch>
  );
}

const mapStateToProps = state => ({ 
  isLogged: state.authForm.isLogged
});

App.propTypes = {
  isLogged: PropTypes.bool.isRequired
}

export default connect(mapStateToProps)(App);