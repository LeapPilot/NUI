var arDrone = require('ar-drone');
var faye = require('faye');
var client  = arDrone.createClient();
var control = arDrone.createUdpControl();
client.createRepl();

client.config("control:altitude_max", "30000");
control.flush();