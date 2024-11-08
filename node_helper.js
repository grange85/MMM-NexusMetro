/* Magic Mirror
 * Module: MMM-NexusMetro
 *
 * By grange85
 *
 */
const NodeHelper = require('node_helper');
const request = require('request');

module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting node_helper for: " + this.name);
    },

    getNexusMetro: function(url) {
        request({
            url: url,
            method: 'GET'
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                var result = JSON.parse(body); // sightings is from JSON data
		console.log(url + result);
                this.sendSocketNotification('NEXUSMETRO_RESULT', result);
		
            }
        });
    },

    socketNotificationReceived: function(notification, payload) {
	console.log("here");
        if (notification === 'GET_NEXUSMETRO') {
            this.getNexusMetro(payload);
        }
    }
});
