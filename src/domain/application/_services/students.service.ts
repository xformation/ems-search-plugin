import { config } from '../config';
import { commonFunctions } from '../_utilites/common.functions';

export const studentServices = {
    saveStudent,

}

function saveStudent(data: any) {
    const requestOptions = commonFunctions.getRequestOptions("POST", {"Content-Type":"application/json;charset=UTF-8"}, JSON.stringify(data));
    return fetch(config.STUDENT_SEARCH_URL, requestOptions)
        .then(response => response.json());
}
