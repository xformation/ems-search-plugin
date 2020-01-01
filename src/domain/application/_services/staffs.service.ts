import { config } from '../config';
import { commonFunctions } from '../_utilites/common.functions';

export const staffServices = {
    searchStaff,
    searchGetAllStaff
}

function searchStaff(data: any) {
    const requestOptions = commonFunctions.getRequestOptions("GET", {});
    return fetch(config.STAFF_SEARCH_URL + "?staffName=" + data.name, requestOptions)
        .then(response => response.json());
}
function searchGetAllStaff() {
    const requestOptions = commonFunctions.getRequestOptions("GET", {});
    return fetch(config.GET_ALL_STAFF_URL, requestOptions)
        .then(response => response.json());
}