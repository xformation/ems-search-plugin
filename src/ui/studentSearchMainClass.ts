import init from '../domain/application/students/studentSearchApp';

export class StudentSearchMainClass {
    static templateUrl = '/partials/search.html';
    constructor() {
        init();
    }
}
