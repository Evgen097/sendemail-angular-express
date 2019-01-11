var express = require('express');
var router = express.Router();
var path = require('path');
var appRoot = require('app-root-path');

var moment = require('moment-timezone');
moment().format();

const config =  require(path.resolve( appRoot.path, 'bing', 'config.js'));
const lib =  require(path.resolve( appRoot.path, 'bing', 'lib.js'));

const lowdb = require(path.resolve( appRoot.path, 'bing', 'db', 'lowdb.js'));
var bingsearch = require(path.resolve( appRoot.path, 'bing', 'bingsearch.js'));

var emailsSearch = require(path.resolve( appRoot.path, 'bing', 'email_search'));
var add_suffixes = require(path.resolve( appRoot.path, 'bing', 'needle_add_suffixes'));
var send_emails = require(path.resolve( appRoot.path, 'bing', 'sendemail', 'index.js'));



router.get('/', function (req, res) {
    console.log(req.query);
    console.log(getRootDir);

    res.status(200);
    res.json({msg: 'api.v1 root directory!'});
});

router.get('/queries', function (req, res) {
    var queries

    try {
        queries = lowdb.getQueries();
    }catch (e) {
        queries = {error: 'Ошибка при обращении к базе данных!'};
    }
    res.status(200);
    res.json(queries);
});

router.get('/query/:id', function (req, res) {
    var query;
    var id;

    try {
        id = req.params.id;
        if(!id || !id.length || (id.length < 3) || (id.length > 50)  ){
            res.status(400);
            return res.json({error: 'ID некоректен!'});
        }
        query = lowdb.getQuery(id);
        if(!query) query = {error: 'Ошибка ID не существует!'};
    }catch (e) {
        query = {error: 'Ошибка при обращении к базе данных!'};
    }

    res.status(200);
    res.json(query);
});

router.get('/query/:id/statistic', function (req, res) {
    var message;
    var id;

    try {
        console.log('Statistic ')
        console.log(req.params.id)
        id = req.params.id;
        if(!id || (id.length < 3) || (id.length > 50)  ){
            res.status(400);
            return res.json({error: 'ID некоректен!'});
        }

        let query = lowdb.getQuery(id);
        if( !query  ){
            res.status(400);
            return res.json({error: 'ID несуществует!'});
        }

        let sentemails  = lowdb.getQuerieSentMessages (id);

        message = {message: 'Запрос выполнен успешно!',
                   sentemails: sentemails
        };

    }catch (e) {
        message = {error: 'Ошибка при обращении к базе данных!'};
    }

    res.status(200);
    res.json(message);
});

router.delete('/queries/:id', function (req, res) {
    var query;
    var id;

    try {
        id = req.params.id;
        if(!id || !id.length || (id.length < 3) || (id.length > 50)  ){
            res.status(400);
            return res.json({error: 'ID некоректен!'});
        }
        lowdb.deleteQuery(id);
    }catch (e) {
        query = {error: 'Ошибка при обращении к базе данных!'};
    }

    res.status(200);
    res.json(query);
});

router.post('/queries', function (req, res) {
    // setTimeout( ()=>{
    //     res.json({error: 'Ошибка при обращении к Bing сервису!'});
    // }, 2000 )
    var searchData;

    try {
        var data = req.body;
        if(!data || !data.querytext || (data.querytext.length < 3) || (data.querytext.length > 50)  ){
            res.status(400);
            return res.json({error: 'Поисковый запрос некоректен, допустимая длинна от 3 до 50 символов!'});
        }
        searchData = bingsearch(data.querytext);
    }catch (e) {
        searchData = {error: 'Ошибка при обращении к Bing сервису!'};
    }

    res.status(200);
    res.json(searchData);

});

router.put('/query/findemails', function (req, res) {
    var message;
    var id;
    var data;

    try {
        data = req.body;
        if(!data || !data.id || (data.id.length < 3) || (data.id.length > 50)  ){
            res.status(400);
            return res.json({error: 'ID некоректен!'});
        }

        id = data.id;

        let query = lowdb.getQuery(id);

        if( !query  ){
            res.status(400);
            return res.json({error: 'ID несуществует!'});
        }
        if( query.fetchemails  ){
            res.status(200);
            return res.json({message: 'Поиск электронных адресов уже был выполнен: ' + query.datesendingemails});
        }

        console.log("Add suffixes ...");
        add_suffixes(id);
        console.log("Start emails Search ...");
        emailsSearch(id);
        message = {message: 'Поиск электронных адресов... !'};

    }catch (e) {
        message = {error: 'Ошибка при обращении к базе данных!'};
    }

    res.status(200);
    res.json(message);
});

router.put('/query/:id/startemailing', function (req, res) {
    var message = {message: 'Идет отправка писем... !'};;
    var id;
    var data;

    try {
        data = req.body;
        if(!data || !data.id || (data.id.length < 3) || (data.id.length > 50)  ){
            res.status(400);
            return res.json({error: 'ID некоректен!'});
        }
        id = data.id;
        let query = lowdb.getQuery(id);
        if( !query  ){
            res.status(400);
            return res.json({error: 'ID несуществует!'});
        }

        if( !query.emails.length  ){
            res.status(200);
            return res.json({message: 'Имейлы по данному запросу несуществуют!'});
        }

        if( query.sentmessages >= query.emails.length  ){
            res.status(200);
            return res.json({message: 'Имейлы уже отправлены!'});
        }
        // console.log('Идет отправка писем... ! ID: ', id);


        let checkLimit =  lib.checkLettersLimit();

        message = {message: checkLimit.message};
        if(!checkLimit.error) send_emails(id);

    }catch (e) {
        message = {error: 'Ошибка при обращении к базе данных!'};
        console.error(e);
    }

    res.status(200);
    res.json(message);
});



router.all('/*', function (req, res) {
    res.status(404);
    res.json({msg: 'Ошибка, данного пути не существует!'});
});


module.exports = router;