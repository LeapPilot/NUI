var arDrone = require('ar-drone'),
    client = arDrone.createClient();

require('nodecopter-monitor').init(client);