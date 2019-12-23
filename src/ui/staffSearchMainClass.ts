import init from '../domain/application/staffs/staffSearchApp';

export class StaffSearchMainClass {
    static templateUrl = '/partials/search.html';
    constructor() {
        init();
    }
}
