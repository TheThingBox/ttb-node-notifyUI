module.exports = function(RED) {
  "use strict";

  function main(config) {
    RED.nodes.createNode(this,config);
    this.notification = config.notification;
    this.notificationType = config.notificationType;
    this.fix = config.fix;
    this.defaultTout = config.defaultTout;
    this.timeout = config.timeout;
    this.timeoutUnits = config.timeoutUnits;
    this.multipicator = (this.timeoutUnits=="s")?Number(1000):(this.timeoutUnits=="m")?Number(1000*60):(this.timeoutUnits=="h")?Number(1000*60*60):Number(1);
    var node = this;
    this.on("input",function(msg) {
      var text = msg.notification ||node.notification;
      var type = msg.notificationType || node.notificationType;
      var fix = msg.fix ||node.fix;
      var tout = msg.timeout || node.timeout;
      var defaultTout = msg.defaultTimeout || node.defaultTout;
      if(!fix && !msg.timeout){
        tout *= node.multipicator;
      }

      var data = {
        text:text,
        type:type,
        fixed:fix,
        tout:(defaultTout)?undefined:tout
      }
      RED.comms.publish("notifyUI",data);
      this.send(msg);
    });
  }
  RED.nodes.registerType("notifyUI",main);

  RED.httpAdmin.post("/notifyUI", function(req,res) {
    var data;
    try {
      data = JSON.parse(req.body);
    } catch(e) {
      data = req.body;
    }
    if(data) {
      RED.comms.publish("notifyUI",data);
      res.sendStatus(200);
    } else {
      res.sendStatus(201);
    }
  });
}
