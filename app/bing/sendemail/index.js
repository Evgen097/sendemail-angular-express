// let lowdb = require('../db/lowdb');
let nodemailer = require ('nodemailer');
var path = require('path');
var appRoot = require('app-root-path');

const lib =  require(path.resolve( appRoot.path, 'bing', 'lib.js'));

const lowdb = require(path.resolve( appRoot.path, 'bing', 'db', 'lowdb.js'));
var gmails =  require(path.resolve( appRoot.path, 'bing', 'config.js')).gmail;

var emaildata = require(path.resolve( appRoot.path, 'bing', 'config.js')).emaildata;

var send_by_gmail = require(path.resolve( appRoot.path, 'bing', 'sendemail', 'send_by_gmail.js'));

const REQUEST_PERIOD = 1000;
var msgRestriction = 90;


async function sendEmails(id) {

    try {
        var emails = lowdb.getQuerieEmails(id);
        var sentmessages = lowdb.getQuerieSentMessages(id);
        var getAllSentEmails = lowdb.getAllSentEmails();
        var count = 0;

        var getCurrentGmail = lib.getCurrentGmail();
        if(getCurrentGmail.error) {console.error(getCurrentGmail.error); return};

        var gmailIndex = getCurrentGmail.index;
        var gmail = gmails[gmailIndex];

        if(!emails || !emails.length){console.log("Имейлов для рассылки нету, id: ", id); return};
        if(sentmessages >= emails.length){console.log("На все имейлы сообщения уже отправлены, id: ", id); return};
        lowdb.updateQuerieDate(id);

        for(var i=sentmessages; i<emails.length; i++){
            var email = emails[i];
            count++;
            if(count > msgRestriction){
                count = 0;
                gmailIndex++;
            }
            if(!gmails[gmailIndex]){console.log(`Достигнуты лимиты отправки, с каждого gmail уже отправлено по ${msgRestriction} сообщений `); break; }

            let checkLimit =  lib.checkLettersLimit();
            if(checkLimit.error){console.log(checkLimit.message); break; }


            if(getAllSentEmails.includes(email)){
                lowdb.updateQuerieSentMessages(id);
                console.log(`На email: ${email} письмо уже было отправлено по другому поисковому запросу`);
            }else {
                var data = {};
                data.email = email;
                // to: emaildata.email, // list of receivers
                //     subject: emaildata.subject, // Subject line
                //     html: emaildata.html// plain text body
                data.subject = emaildata.subject;
                data.html = emaildata.html.gmail_text;


                // var operator = email.split('@');
                // console.log(operator);
                // if(operator && operator.length && (operator.length > 0)){
                //     switch (operator[1]) {
                //         case 'ukr.net':
                //             data.html = emaildata.html.ukrnet_text;
                //             break;
                //         default:
                //             data.html = emaildata.html.gmail_text;
                //     }
                // }

                send_by_gmail(gmail, data, id)
                await sleep(REQUEST_PERIOD);
            }

        }

    }
    catch (e) {
        console.error("Error in sendEmails");
        console.error(e);
    }




    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

}


var id = "1aof6q4jol9w87e";
// sendEmails(id)
module.exports = sendEmails;