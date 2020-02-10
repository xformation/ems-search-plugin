import {config} from './domain/application/config';

const cfg = {
    URL: config.WEB_SOCKET_URL_WITH_CMS_BACKEND
}

const wsCmsBackendServiceClient = (function () {
    let instance: any;

    function createInstance() {
        const socket = new WebSocket(cfg.URL);
        return socket
    }

    return {
        getInstance: function () {
            // if (!instance) {
                instance = createInstance();
            // }
            return instance; 
        }
    };
})();

export default wsCmsBackendServiceClient;