/* Magic Mirror
 * Module: MMM-NexusMetro
 *
 * By grange85
 *
 */
Module.register("MMM-NexusMetro", {
  defaults: {
    station: "MSN",
    platform: 1,
    updateInterval: 60000,
    initialLoadDelay: 4250,
  },
  getStyles: function() {
    return ["MMM-NexusMetro.css"];
  },
  start: function() {
    Log.info("Starting module: " + this.name);
    this.url = "https://metro-rti.nexus.org.uk/api/times/" + this.config.station + "/" + this.config.platform;
    this.nexusmetro = [];
    //this.getNexusMetro();
    this.scheduleUpdate();       // <-- When the module updates (see below)
  },
  getDom: function() {
    var element = document.createElement("div");
    element.className = "myContent";
    if (this.nexusmetro) {
	nexusmetrotable = "<table class=\"nexusmetro-table\"><th>Due in</th><th>Destination</th><th>Last location</th>";
	    for (const [key, value] of Object.entries(this.nexusmetro)) {
		    console.log(`Key: ${key}, Value: ${value}`);
		    console.log(value.lastEvent);
		    nexusmetrotable += "<tr>"
		    nexusmetrotable += "<td>" + value.dueIn + "</td>";
		    nexusmetrotable += "<td>" + value.destination + "</td>";
		    nexusmetrotable += "<td>" + value.lastEvent + " " + value.lastEventLocation + "</td>";
		    nexusmetrotable += "<tr>"
	    }
	nexusmetrotable += "</table>";
	element.innerHTML = nexusmetrotable;
    }
    console.log("getDom");
    console.log(JSON.stringify(this.nexusmetro, null, 2));
    return element;
  },
    scheduleUpdate: function() { 
      setInterval(() => {
	  this.getNexusMetro();
	}, this.config.updateInterval);
	this.getNexusMetro(this.config.initialLoadDelay);
	var self = this;
  },
  processNexusMetro: function(data) {
    this.nexusmetro = data;
    this.loaded = true;
  },

  getNexusMetro: function() { 
    console.log(this.url);
    this.sendSocketNotification('GET_NEXUSMETRO', this.url);
    },
 
  socketNotificationReceived: function(notification, payload) { 
    if (notification === "NEXUSMETRO_RESULT") {

      this.processNexusMetro(payload);
    }
    this.updateDom(this.config.initialLoadDelay);
  },

})
