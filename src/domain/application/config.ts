// const securityServiceUrl = 'http://localhost:8094';
const backendServiceUrl = 'http://100.81.5.26:8080';
const preferenceServiceUrl = 'http://100.81.5.26:9091';

const loggedInUserUrl = 'http://100.81.5.26:3000';
const webSockWithCmsBackendUrl = 'ws://100.81.5.26:4000/websocket/tracker/websocket';
const elasticSearchUrl = 'http://100.81.5.26:8092/search';

export const config = {
  LOGGED_IN_USER_URL: loggedInUserUrl + '/api/user',
  WEB_SOCKET_URL_WITH_CMS_BACKEND: webSockWithCmsBackendUrl,
  ELASTIC_SEARCH_LIST: elasticSearchUrl + '/list',

  STUDENT_SEARCH_URL: backendServiceUrl + '/api/cmsstudents',
  GET_ALL_STUDENTS_URL: backendServiceUrl + '/api/cmsstudents',
  VEHICLE_SEARCH_URL: backendServiceUrl + '/api/cmsvehicles',
  GET_ALL_VEHICLE_URL: backendServiceUrl + '/api/cmsvehicles',

  TEACHER_SEARCH_URL: preferenceServiceUrl + '/api/cmsteachers',
  GET_ALL_TEACHER_URL: preferenceServiceUrl + '/api/cmsteachers',
  STAFF_SEARCH_URL: preferenceServiceUrl + '/api/cmsstaffs',
  GET_ALL_STAFF_URL: preferenceServiceUrl + '/api/cmsstaffs',
  GET_DEPARTMENT_URL: preferenceServiceUrl + '/api/department-by-filters',
  GET_BATCH_URL: preferenceServiceUrl + '/api/batch-by-filters',
  GET_SECTION_URL: preferenceServiceUrl + '/api/section-by-filters',
};
