import * as React from 'react';
import * as ReactDOM from 'react-dom';
import "../../../css/searchApp.css";
import { StaffSearchPage } from './staffSearchPage';

export default function init() {
  setTimeout(function () {
    ReactDOM.render(
      <StaffSearchPage />,
      document.getElementById('searchContainer')
    );
  }, 100);
}
