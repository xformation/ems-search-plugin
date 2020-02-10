import {config} from '../config';
import {commonFunctions} from '../_utilites/common.functions';

export const teacherServices = {
  searchTeacher,
  searchGetAllTeacher,
  searchLoggedInUser,
  searchDepartment,
  searchBatch,
  searchSection,
};

function searchTeacher(data: any) {
  const requestOptions = commonFunctions.getRequestOptions('GET', {});
  return fetch(
    config.TEACHER_SEARCH_URL + '?teacherName=' + data.name,
    requestOptions
  ).then(response => response.json());
}
function searchGetAllTeacher() {
  const requestOptions = commonFunctions.getRequestOptions('GET', {});
  // return fetch(config.GET_ALL_TEACHER_URL, requestOptions)
  //     .then(response => response.json());
  const URL = config.ELASTIC_SEARCH_LIST + '?cls=com.synectiks.cms.entities.Teacher';
  return fetch(URL, requestOptions).then(response => response.json());
}

function searchLoggedInUser() {
  const requestOptions = commonFunctions.getRequestOptions('GET', {});
  return fetch(config.LOGGED_IN_USER_URL, requestOptions).then(response =>
    response.json()
  );
}

function searchDepartment() {
  const requestOptions = commonFunctions.getRequestOptions('GET', {});
  return fetch(config.GET_DEPARTMENT_URL, requestOptions).then(response =>
    response.json()
  );
}

function searchBatch() {
  const requestOptions = commonFunctions.getRequestOptions('GET', {});
  return fetch(config.GET_BATCH_URL, requestOptions).then(response => response.json());
}

function searchSection() {
  const requestOptions = commonFunctions.getRequestOptions('GET', {});
  return fetch(config.GET_SECTION_URL, requestOptions).then(response => response.json());
}
