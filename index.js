
'use strict';

require('dotenv').load({silent: true});
var _ = require('lodash');
var async = require('async');
var whereversim = require('whereversim-nodejs');

var whereverSIM = new whereversim({
  application_token: process.env.WHEREVERSIMAPPLICATIONTOKEN,
  refresh_token: process.env.WHEREVERSIMREFRESHTOKEN,
  username: process.env.WHEREVERSIMUSERNAME,
  password: process.env.WHEREVERSIMPASSWORD,
  auth_token: process.env.WHEREVERSIMAUTHTOKEN,
});

var Cloudant = require('cloudant');
var cloudant = Cloudant({
  account: process.env.CLOUDANTACCOUNT,
  username: process.env.CLOUDANTUSERNAME,
  password: process.env.CLOUDANTPASSWORD,
});
var mapdb = cloudant.use(process.env.CLOUDANTDB);

var loadSMStoMap = function() {
  whereverSIM.messages.listSMS({
    endpoint: process.env.WHEREVERSIMENDPOINT
  }, function (error, response, body) {
    async.eachSeries(
      body,
      function(value, callback) {
        if (value.payload.substr(0, 1) == '[') {
          var id = value.id.toString();
          var latlong = JSON.parse(value.payload).reverse();
          mapdb.get(id, function (err, resp) {
            var coord = {
              _id: value.id.toString(),
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: latlong
              },
            };
            if(resp && resp._rev) {
              coord._rev = resp._rev;
            }
            mapdb.insert(coord, function (err, resp) {
              if(!err) {
                console.log('Co-ordinates Set:', id);
              }
              callback();
            });
          });
        } else {
          callback();
        }
      },
      function(error) {
        if (error) {
          console.error('ERROR:', error);
        }
        loadSMStoMap();
      }
    )
    _.forEach(body, function(value) {
    });
  });
}

loadSMStoMap();
