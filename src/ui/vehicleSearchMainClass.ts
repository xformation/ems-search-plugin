import init from '../domain/application/vehicles/vehicleSearchApp';

export class VehicleSearchMainClass {
    static templateUrl = '/partials/search.html';
    constructor() {
        init();
    }
}