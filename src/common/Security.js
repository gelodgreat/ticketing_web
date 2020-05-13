const token = localStorage.getItem("data_access");

class Security {
    constructor() {
        this.payload = this.payload;
    }

    getToken() {
        return JSON.parse(token);
    }

    removeToken() {
        return localStorage.clear()
    }

    verifySessionToken() {
        var parsedToken = JSON.parse(token);
        if (parsedToken) {
            var parsedValue = Object.keys(parsedToken);
            //will add verify token
            if (parsedToken) {
                if (parsedValue.includes('accessToken') && parsedValue.includes('refreshToken')) {
                    return true;
                }
            }
        }
    }

}

export default Security;