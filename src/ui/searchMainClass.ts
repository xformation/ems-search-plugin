import init from '../domain/application/studentSearchApp';


export class SearchMainClass {
    static templateUrl = '/partials/search.html';
    constructor() {
        init();
    }
}
