import init from '../domain/application/teachers/teacherSearchApp';

export class TeacherSearchMainClass {
    static templateUrl = '/partials/search.html';
    constructor() {
        init();
    }
}
