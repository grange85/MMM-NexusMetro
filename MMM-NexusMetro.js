/* Magic Mirror
 * Module: MMM-NexusMetro
 *
 * By grange85
 *
 */
Module.register("MMM-NexusMetro", {
  defaults: {
    station: "MSN",
    stationname: "Monkseaton",
    platform: 1,
    updateInterval: 30000,
    initialLoadDelay: 250,
  },
  getStyles: function() {
    return ["MMM-NexusMetro.css"];
  },
  start: function() {
    Log.info("Starting module: " + this.name);
    this.url = "https://metro-rti.nexus.org.uk/api/times/" + this.config.station + "/" + this.config.platform;
    this.nexusmetro = [];
    this.header = "Real time information for " + this.config.stationname + " platform " + this.config.platform ;
    //this.getNexusMetro();
    this.scheduleUpdate();       // <-- When the module updates (see below)
  },
  getDom: function() {
    var element = document.createElement("div");
    element.className = "myContent";
    nexusmetrotable = "<h2>" + this.header + "</h2>";
    if (this.nexusmetro) {
	nexusmetrotable += "<ul class=\"nexusmetro\">";
	    for (const [key, value] of Object.entries(this.nexusmetro)) {
		    if (value.dueIn < 0) {console.log("train left"); continue;}
		    switch(value.lastEvent) {
			    case "DEPARTED":
				    metrostatus = "has just left";
				    break;
			    case "APPROACHING":
				    metrostatus = "is just approaching";
				    break;
			    case "ARRIVED":
				    metrostatus = "is at";
				    break;
			    default:
				    metrostatus = "current status: " + value.lastEvent.toLowerCase();
		    }

						
		    nexusmetrotable += "<li>";
		    nexusmetrotable += "Due in " + value.dueIn + " minutes, ";
		    nexusmetrotable += "a metro to " + value.destination + " ";
		    nexusmetrotable += "" + metrostatus + " " + value.lastEventLocation.replace(/Platform/g, "platform") + "";
		    nexusmetrotable += "</li>";
	    }
	nexusmetrotable += "</ul>";
	element.innerHTML = nexusmetrotable;
    }
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
