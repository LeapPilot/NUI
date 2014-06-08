  var express, path, ardrone, drone, server, app, faye, client, leap;

  express = require("express");
  path = require("path");
  
  //enables easy client server communication
  faye = require('faye');
  
  // enables communication with drone in javascript
  drone = require("ar-drone").createClient();
  
  //handles gesture to command translation
  leap = require('leapjs');
  
  // for video rendering
  require("dronestream").listen(3001); 
  
  app = express();
  app.configure(function () {
    app.set('port', process.env.PORT || 3000); // process.env.PORT adjusts PORT to accept environmental parameter (ie deploying to Heroku)
    app.use(app.router);  // optimizes performance when put before static, but isn't necessary as express will implicity add.  Putting before static prevents accidentally-named static files from overwriting routes
    app.use(express.static(__dirname + '/public'));  // serves static files from disk
    return app.use("/node_modules", express.static(path.join(__dirname, 'node_modules'))); // adds in jQuery
  });

  server = require('http').createServer(app);
  
  var bayeux = new faye.NodeAdapter({  // central messaging server for clients to communicate with one another; Can also add 'engine' property, which controls backend of the server (ie faye-redis) and 'ping' property, which is how often, in seconds, to send keep-alive ping messages over WebSocket and EventSource connections. Used if Faye server will be accessed through a proxy that kills idle connections.
    mount: '/faye', // path on the host at which the Faye service is available (ie http://localhost:3001/faye).
    timeout: 50  // maximum time to hold connection open before returning response. Given in seconds and must be smaller than timeout on frontend webserver. 
  }); 

  bayeux.attach(server); // attached to server; will handle all requests to paths matching the mount path and delegate all other requests to handlers.

  client = new faye.Client("http://localhost:" + (app.get("port")) + "/faye", {}); // sets up new client at environmental port that accesses the server at the /faye mount 
  
  /*
   *	Subscribe to navigational commands published by the client
   */
  client.subscribe("/drone/move", function (d) { // move includes any directional actions
    console.log(d);
    return drone[d.action](d.speed);
  });

  client.subscribe("/drone/drone", function (d) { // drone commands include takeoff and landing
    console.log(d);
      return drone[d.action]();
  });
  
  /*
   *	Subscribe to configuration settings published by the client to set on the drone
   */
  client.subscribe("/drone/config", function (d) {
    console.log(d);
	  return drone.config(d.key, d.value);
  });

  server.listen(app.get('port'), function () {
    return console.log("Express server listening on port" + app.get("port"));
  })
  
  /*
   *	Publish the battery and altitude information in interval of 5sec, so the client can subscribe and update
   */
  setInterval(function(){
    	client.publish("/drone/info", { battery: drone.battery() , alt: drone._lastAltitude });
    }, 5000);
	