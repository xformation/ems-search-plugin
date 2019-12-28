import { config } from '../config';
import { commonFunctions } from '../_utilites/common.functions';

export const teacherServices = {
    searchTeacher,
    searchGetAllTeacher
}

function searchTeacher(data: any) {
    const requestOptions = commonFunctions.getRequestOptions("GET", {});
    return fetch(config.TEACHER_SEARCH_URL + "/" + data.name, requestOptions)
        .then(response => response.json());
}
function searchGetAllTeacher() {
    const requestOptions = commonFunctions.getRequestOptions("GET", {});
    return fetch(config.GET_ALL_TEACHER_URL, requestOptions)
        .then(response => response.json());
}