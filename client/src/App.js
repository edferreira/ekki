import React from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom'
import ScrollToTop from './components/scrollToTop'
import Login from './components/login'
import Register from './components/register'
import Home from './components/home'

export default props => (
      <BrowserRouter>
          <Switch>
            <ScrollToTop>
              <Route exact path='/' component={ Login } />
              <Route exact path='/register' component={ Register } />
              <Route exact path='/home' component={ Home } />
            </ScrollToTop>
          </Switch>
      </BrowserRouter>
  )
