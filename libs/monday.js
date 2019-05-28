const { api_key, api_base_url } = require('../config');
const rp = require('request-promise');

module.exports = {
    get_boards() {
        var options = {
            method: 'GET',
            uri: `${ api_base_url }/boards.json?api_key=${ api_key }`,
            json: true
        }
        
        return rp(options)
    },

    get_board(board_id) {
        var options = {
            method: 'GET',
            uri: `${ api_base_url }/boards/${ board_id }.json?api_key=${ api_key }`,
            json: true
        }

        return rp(options);
    },

    get_pulses() {
        var options = {
            method: 'GET',
            uri: `${ api_base_url }/pulses.json?api_key=${ api_key }`,
            json: true
        }

        return rp(options);        
    },

    get_pulses_from_board(board_id) {
        var options = {
            method: 'GET',
            uri: `${ api_base_url }/boards/${ board_id }/pulses.json?api_key=${ api_key }`,
            json: true
        }

        return rp(options);        
    },

    get_pulse(pulse_id) {
        var options = {
            method: 'GET',
            uri: `${ api_base_url }/pulses/${ pulse_id }.json?api_key=${ api_key }`,
            json: true
        }

        return rp(options);
    },
    
    get_users() {
        var options = {
            method: 'GET',
            uri: `${ api_base_url }/users.json?api_key=${ api_key }`,
            json: true
        }

        return rp(options);        
    }
}