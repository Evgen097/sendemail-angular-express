// var gmail_text = require('./emailtext/gmailtext');
// var ukrnet_text = require('./emailtext/ukrnettext');
var path = require('path');
var appRoot = require('app-root-path');

const gmail_text = require(path.resolve( appRoot.path, 'bing', 'emailtext', 'gmailtext.js'));
const ukrnet_text = require(path.resolve( appRoot.path, 'bing', 'emailtext', 'ukrnettext.js'));


var config = {
    bingKey: "a86d0e2f17ba40d18c6062ec29daeb5f",
    gmail:[
        {user: 'dronaerialsurvey@gmail.com', password: '630ev630'}
    ],
    emaildata:{
        subject: 'Аэрофотосьемка для проектных работ, строительства, землеустройства',
        html: {
            gmail_text: gmail_text,
            ukrnet_text: ukrnet_text
        }
    },
    letterslimit: 100
};

module.exports = config;

















