import React, {useEffect, useState} from 'react';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import GlobalStyle from './styles/global';
import {session} from './services/api';
import Login from './pages/Login';
import Main from './pages/Main';

function App() {
  // Session changes (login, logout, failed token refresh) swap the screen
  const [loggedIn, setLoggedIn] = useState(!!session.get());
  useEffect(() => session.subscribe((s) => setLoggedIn(!!s)), []);

  return (
    <>
      <GlobalStyle/>
      {loggedIn ? <Main/> : <Login/>}
      <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar theme="dark"/>
    </>
  );
}

export default App;
