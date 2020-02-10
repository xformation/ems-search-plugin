import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import "../../../css/searchApp.css";
import { TeacherSearchPage } from './teacherSearchPage';

export default function init() {
  setTimeout(function () {
    ReactDOM.render(
        <TeacherSearchPage />,
      document.getElementById('searchContainer')
    );
  }, 100);
}
