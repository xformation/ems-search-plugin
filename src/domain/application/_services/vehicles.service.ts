import { config } from '../config';
import { commonFunctions } from '../_utilites/common.functions';

export const vehicleServices = {
    searchVehicle,
    searchGetAllVehicle
}

function searchVehicle(data: any) {
    const requestOptions = commonFunctions.getRequestOptions("GET", {});
    return fetch(config.VEHICLE_SEARCH_URL + "?vehicleName=" + data.name, requestOptions)
        .then(response => response.json());
}
function searchGetAllVehicle() {
    const requestOptions = commonFunctions.getRequestOptions("GET", {});
    return fetch(config.GET_ALL_VEHICLE_URL, requestOptions)
        .then(response => response.json());
}