var uniqid = require('uniqid');
var add_suffixes = require('./needle_add_suffixes');
var emailsSearch = require('./email_search');

var moment = require('moment-timezone');
moment().format();

const lowdb = require('./db/lowdb');

var KEY = require('./config').bingKey;
var Querie = require('./dataclass/querieclass');
var queryString = "введите пожалуйста запрос";
var queryQuantity = 5;
var queryOffset = 0;
const LIMIT = 10;
const REQUEST_PERIOD = 500;
var allQueriesResults = [];

var Bing = require('node-bing-api')({ accKey: KEY });
var util = require('util'),
    Bing = require('node-bing-api')({ accKey: KEY }),
    searchBing = util.promisify(Bing.web.bind(Bing));


async function bingQuery(queryString, id, offset) {
    try {
        let data = await searchBing(  queryString, {count: queryQuantity, offset: offset});
        let webPages = JSON.parse(data.body).webPages;

        if (!webPages) return resultsHandling(null, queryString, id);

        webPages.value.forEach(item => allQueriesResults.push(item));
        if( webPages.value.length > 50 && offset < LIMIT ){
            await sleep(REQUEST_PERIOD);
            offset += webPages.value.length;
            bingQuery(queryString, id, offset);
        }else {
            return resultsHandling(null, queryString, id);
        }

    }
    catch (err) {
        var error = 'Ошибка при обращении в BING:' + err;
        resultsHandling(error, queryString, id)
    }
}


function sleep(ms) {
   return new Promise(resolve => setTimeout(resolve, ms));
}


function resultsHandling(err, queryString, id) {
    var query = new Querie();
    query._id = id;
    query.query = queryString;
    query.date = moment().locale('ru').format('LLLL');
    query.webpages = allQueriesResults;

    if(err){
        query.error = err;
    }
    else if(allQueriesResults.length){
        query.message = `Обработка завершена, получено: ${allQueriesResults.length} соответствий`;
    }else {
        query.message = `Нет результатов по запросу: "${queryString}"`;
    }
    console.log("Bing Search Finished",)
    lowdb.updateQueries(query);
}

function bingSearch(queryString) {
    console.log("Start Bing Search ...")
    let id = uniqid();
    bingQuery(queryString, id, queryOffset);

    let obj = {
        error: null,
        message: "Start Bing Search ...",
        id: id,
        query: queryString
    };
    return obj;
}

// bingSearch("харьков землеустроительные работы")
module.exports = bingSearch;