import { config } from '../config';
import { commonFunctions } from '../_utilites/common.functions';

export const studentServices = {
    searchStuent,
    searchGetAllStuent
}

function searchStuent(data: any) {
    const requestOptions = commonFunctions.getRequestOptions("GET", {});
    return fetch(config.STUDENT_SEARCH_URL + "?cls=com.synectiks.cms.entities.Student&" + data, requestOptions)
        .then(response => response.json());
}
function searchGetAllStuent() {
    const requestOptions = commonFunctions.getRequestOptions("GET", {});
    return fetch(config.GET_ALL_STUDENTS_URL, requestOptions)
        .then(response => response.json());
}


