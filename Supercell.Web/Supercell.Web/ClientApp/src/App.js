import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import Chat from './components/ChatV2/Chatv2';

import './custom.css'

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
        <Route exact path='/' component={Chat} />
        <Route path='/chat' component={Chat} />
      </Layout>
    );
  }
}
