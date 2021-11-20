import React, { Component, useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Layout } from './components/Layout';
import Chat from './components/ChatV2/Chatv2';
import Login from './components/Login/Login';

import './custom.css'

function App() {
  const [user, setUser] = useState();

  if (!user) {
    return <Login setUser={setUser} />
  }

  return (
    <Layout>
      <BrowserRouter>
        <Switch>
          <Route path="/">
            <Chat user={user} />
          </Route>
        </Switch>
      </BrowserRouter>
    </Layout>
  );
}

export default App;