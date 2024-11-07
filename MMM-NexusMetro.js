Module.register("MMM-NexusMetro", {
  defaults: {
    station: "MSN",
    platform: 1,
  },
  start: function() {
    Log.info("Starting module: " + this.name);
    this.url = "https://metro-rti.nexus.org.uk/api/times/" + this.config.station + "/" + this.config.platform;
    this.nexusmetro = [];
  },
  getDom: function() {
    var element = document.createElement("div");
    element.className = "myContent";
    element.innerHTML = "Hello, World! " + this.nexusmetro;
    return element;
  },

  getNexusMetro: function() { 
    this.sendSocketNotification('GET_NEXUSMETRO', this.url);
    },
 
  socketNotificationReceived: function(notification, payload) { 
    if (notification === "NEXUSMETRO_RESULT") {
      this.processNexusMetro(payload);
    }
    this.updateDom();
  },

  processNexusMetro: function(data) {
    this.nexusmetro = data;
    this.loaded = true;
  },

})
