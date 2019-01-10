var async = require('async');
var needle = require('needle');
var emailsRegex = require('emails-regex');
const db = require('./db/index');
let lowdb = require('./db/lowdb');

var parallelWorkers = 10;

function emailsSearch(id) {

    try {
        var result = [];
        var emailStatistic = {};
        var pagesUrls = [];

        var webpages = db.get('queries').find({ _id: id }).value().webpages;

        if(webpages && webpages.length){
            webpages.forEach( page => {
                if (page.urls && page.urls.length) {pagesUrls.push( page.urls );
                }else {pagesUrls.push( [] )}})
        }

        var q = async.queue(function (url, callback) {
            needle.get(url, function(err, res){
                if (err) {
                    callback();
                    return console.log('error in needle url: ' + url);
                };

                try {

                    var emails = res.body.match(emailsRegex());
                    if (emails && emails.length) {emails.forEach( email => {
                        if (!result.includes(email)) result.push(email);
                    })}

                    emailStatistic[url] = [];
                    if (emails && emails.length) {emails.forEach( email => {
                        emailStatistic[url].push(email);
                    })}
                }catch (e) {console.log('error in url: ' + url);}

                callback();
            });
        }, parallelWorkers);

        q.drain = function () {
            console.log('The queue has finished processing!');
            lowdb.updateQuerieEmails(id, result);
            lowdb.updateQuerieEmailStatistic(id, emailStatistic);
        };

        function startQueue(){
            pagesUrls.forEach( urls=>{
                urls.forEach( url =>{
                    q.push(url, function (err) {
                        if (err) { return console.log('error in adding tasks to queue'); }
                    });
                } )
            } );
        }

        startQueue()

    }catch (e) {
        console.log("Error in emailsSearch", e)
    }


}

// var id = '1aof7msjqfjwgk5';
// emailsSearch(id);

module.exports = emailsSearch;




















































