import { config } from '../config';
import { commonFunctions } from '../_utilites/common.functions';

export const teacherServices = {
    searchTeacher,
}

function searchTeacher(data: any) {
    const requestOptions = commonFunctions.getRequestOptions("GET", {});
    return fetch(config.TEACHER_SEARCH_URL + "?cls=com.synectiks.cms.entities.Teacher&" + data, requestOptions)
        .then(response => response.json());
}
