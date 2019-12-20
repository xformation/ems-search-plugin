import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { SearchPage } from './searchPage';
import "../../css/searchApp.css";



export default function init() {
  setTimeout(function () {
    ReactDOM.render(
      <BrowserRouter>
        <Switch>
          <Route
            path="/plugins/ems-search-plugin/page/home"
            component={SearchPage}
          />
        </Switch>
      </BrowserRouter>,
      document.getElementById('searchContainer')
    );
  }, 100);
}
