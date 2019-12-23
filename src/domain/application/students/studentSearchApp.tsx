import * as React from 'react';
import * as ReactDOM from 'react-dom';
import "../../../css/searchApp.css";
import { StudentSearchPage } from './studentSearchPage';

export default function init() {
  setTimeout(function () {
    ReactDOM.render(
      <StudentSearchPage />,
      document.getElementById('searchContainer')
    );
  }, 100);
}
