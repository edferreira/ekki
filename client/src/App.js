import React from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom'
import ScrollToTop from './components/scrollToTop'
import Home from './components/home'
import Register from './components/register'

export default props => (
      <BrowserRouter>
          <Switch>
            <Route exact path='/' component={ Home } />
            <Route exact path='/register' component={ Register } />
          </Switch>
      </BrowserRouter>
  )
