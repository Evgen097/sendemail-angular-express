var gmail_text = require('./emailtext/gmailtext');
var ukrnet_text = require('./emailtext/ukrnettext');

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
    }
};

module.exports = config;

















