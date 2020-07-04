/* ******************************
 * Blueprint: Nodejs - v0.1
 *
  * ******************************
*/

const promClient = require('prom-client');
const promBundle = require("express-prom-bundle");
const express = require('express');
const logger = require('morgan');
const axios = require('axios');


// *** Prometheus 
// include HTTP method and URL path into the labels
const metricsMiddleware = promBundle({includeMethod: true, includePath: true});

// Initialize
var app = express();


app.use(logger('dev'));
app.use(metricsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const counterUserAgent = new promClient.Counter({name: 'http_request_blueprint_nodejs_user_agent_total', help: 'Blueprint Nodejs: User Agents', labelNames: ['ua']});


// ############# Application configuration
app.set('port', (process.env.PORT || 5000))
app.set('ip', (process.env.IP || '0.0.0.0'))



// ############# Utilities
const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

// ############# Entry points
app.get('/', (req, res) => {
  
    var userAgent = req.get('User-Agent');
    var ret = "Hello you! " + userAgent;    
    console.log('user-agent: ' + userAgent);
  
    // Prometheus Metric: inc and set the user agent
    counterUserAgent.labels(userAgent).inc();
  
    res.send(ret);    
});


app.listen(app.get('port'), app.get('ip'), function() {
    
    console.log("Node app is running at localhost:" + app.get('port'))
  })

module.exports = app;
