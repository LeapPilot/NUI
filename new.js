var arDrone = require('ar-drone');
var client  = arDrone.createClient();
client.createRepl();

console.log(client);