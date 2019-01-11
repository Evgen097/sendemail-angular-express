
var path = require('path');
var appRoot = require('app-root-path');

var moment = require('moment-timezone');
moment().format();

const config =  require(path.resolve( appRoot.path, 'bing', 'config.js'));
const lowdb = require(path.resolve( appRoot.path, 'bing', 'db', 'lowdb.js'));

let lib = {};


lib.checkLettersLimit = function (){
    let date = lowdb.getDate();
    let timeDiff = moment().diff(moment(date), 'h');
    let sentLetters = lowdb.getSentLetters();
    let lettersLimit = config.gmail.length * config.letterslimit;

    let msg = {error: true, message: `Превышен лимит отправки в ${lettersLimit} писем, повторите через ${24-timeDiff} часов!` }
    // console.log(  timeDiff        )

    if(sentLetters === 0){
        msg.error = false;
        msg.message = `Вы отправили 0 сообщений сегодня, последнее письмо было отправлено ${date}!`;
        return msg;
    }

    if(timeDiff > 24){
        // lowdb.updateSentLetters(0);
        // lowdb.updateDate(moment());
        msg.error = false;
        msg.message = `Вы отправили 0 сообщений сегодня, последнее письмо было отправлено ${timeDiff} часов назад!`;
        return msg;
    }

    if( lettersLimit > sentLetters){
        msg.error = false;
        msg.message = `Вы отправили ${sentLetters} писем за последние 24 часа, лимит составляет ${lettersLimit} писем!`;
        return msg;
    }
    return msg;
};

lib.getCurrentGmail = function(){

    let message = {error: true, message: "Нет gmail для отправки писем!"}

    try {
        let index = 0;
        let gmails = config.gmail;
        let sentletters = lowdb.getDbMeta('sentletters');

        if(sentletters > 100 && sentletters < 1000){index = parseInt(  sentletters.toString()[0]  );}
        if(sentletters >= 1000){index = parseInt(  sentletters.toString()[0] + sentletters.toString()[1]  );}

        if(gmails.length < index) {throw new Error( "Добавте gmail чтобы отправлять больше писем" )};

        message = {error: false, message: "Индекс получен!", index: index};

        return message;

    }catch (e) {
        console.error(e);
        return message;
    }

}







module.exports = lib;