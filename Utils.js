/**
 * Utility functions
 */
var sprintf = require("sprintf-js").sprintf;
import config from './config';

class Utils {
    static simpleDateTime(date) {
        return  sprintf('%02d/%02d/%04d %02d:%02d', date.getMonth()+1, date.getDate(), date.getFullYear(),
            date.getHours(), date.getMinutes());
    }

    static async fetchJson(api, token, params) {
        const url = config.serverAddress;
        if (token) {
            params.token = token;
        }
        let json = null;
        try {
            const response = await fetch(url + api, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });
            json = await response.json();
            return json;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}

module.exports = Utils;
