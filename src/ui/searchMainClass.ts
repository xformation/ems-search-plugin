import init from '../domain/application/searchApp';


export class SearchMainClass {
    static templateUrl = '/partials/search.html';
    constructor() {
        init();
    }
}
