var http = require('http')
  , async = require('async')
  , Table = require('cli-table')
  , options = require('./options');

options.forEach(function(option) {
  async.map(option.servers, function(server, callback) {
    http.get({
      host: server,
      port: 80,
      path: '/',
      headers: {
        Host: option.host,
      }
    }, function(response) {
      var data = '';

      response.setEncoding('utf-8');

      response.on('data', function(chunk) {
        data += chunk;
      });

      response.on('end', function() {
        // console.log(data);
        callback(null, [response.statusCode, server, 'HTTP'])
      });
    })
  }, function(err, results) {
    var table = new Table({
      head: ['Status', 'Server', 'Protocol']
    });

    Array.prototype.push.apply(table, results);

    console.log(option.host);
    console.log(table.toString());
    console.log("");
  });
});

