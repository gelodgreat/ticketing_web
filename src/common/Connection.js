import axios from "axios";
import Security from "./Security";

class Connection extends Security {

    getConfig = async () => {
        var connValue = "";
        connValue = `https://ticketing-api-ceu.herokuapp.com/`
        // connValue = `http://localhost:80/`
        return connValue;
    }

    validateLoginAuth = (url, config) => {
        if (!url.match("login")) {
            return {
                headers: {
                    Authorization: `Bearer ${this.getToken()['token']}`,
                    "Content-Type": "application/json"
                }
            }
        }
        return config;
    }

    async get(url) {
        return axios.get(await this.getConfig() + url, {
            headers: {
                Authorization: `Bearer ${this.getToken()['token']}`,
                "Content-Type": "application/json"
            }
        }).then(response => {
            return response;
        })
    }

    post = async (url, data, config) => {
        console.log(this.validateLoginAuth(url, config), url, data, config)
        return axios.post(await this.getConfig() + url, data, this.validateLoginAuth(url, config)).then(response => {
            return response;
        });
    }

    put = async (url, data, whatToken) => {
        var config = {
            headers: {
                Authorization: `Bearer ${whatToken || this.getToken()['token']}`,
                "Content-Type": "application/json"
            }
        }
        return axios.put(await this.getConfig() + url, data, config).then(response => {
            return response;
        })
    }

    delete = async (url) => {
        return axios.delete(await this.getConfig() + url, {
            headers: {
                Authorization: `Bearer ${this.getToken()['token']}`,
                "Content-Type": "application/json"
            }
        }).then(response => {
            return response;
        })
    }


}


export default Connection