var moment = require('moment-timezone');
moment().format();

const db = require('./index');
let lowdb = {};

lowdb.getQueries = function(){
    let result = db.get('queries').value()
        .map( i => {
            return {
                query: i.query,
                id: i._id,
                error:i.error,
                date: i.date,
                message: i.message
            }
        });
    return result;
};

lowdb.getDate = function () {
    var result = db.get('date').value();
    return result;
}

lowdb.getSentLetters = function () {
    var result = db.get('sentletters').value();
    return result;
}



lowdb.getQuery = function(id){
    let result = db.get('queries')
        .find({ _id: id })
        .value();
    return result;
};

lowdb.getQuerieEmails = function(id){
    var result = db.get('queries').find({ _id: id }).value().emails;
    return result;
}
lowdb.getQuerieSentMessages = function(id){
    var result = db.get('queries').find({ _id: id }).value().sentmessages;
    return result;
}

lowdb.getAllSentEmails = function(){
    var result = db.get('allsentemails').value();
    return result;
}


lowdb.updateQuerieEmails = function(id, data){
    db.get('queries')
        .find({ _id: id })
        .assign({ emails: data})
        .assign({ fetchemails: true })
        //.assign({ datesendingemails: moment().locale('ru').format('LLLL') })
        .write();
};

lowdb.updateQuerieEmailStatistic = function(id, data){
    db.get('queries')
        .find({ _id: id })
        .assign({ emailstatistics: data})
        .write();
};

lowdb.updateQuerieDate = function(id){
    db.get('queries')
        .find({ _id: id })
        .assign({ datesendingemails: moment().locale('ru').format('LLLL') })
        .write();
};


lowdb.updateQuerieSentMessages = function(id){
    db.get('queries').find({ _id: id }).update('sentmessages', n => n + 1)
        .write();
}


lowdb.updateSuccessEmails = function(id, email){

    let successemails = db.get('queries').find({ _id: id }).value().successemails;
    successemails.push(email);
    db.get('queries')
        .find({ _id: id })
        .assign({ successemails: successemails})
        .write();
}

lowdb.updateAllSentEmails = function(email){
    db.get('allsentemails')
        .push(email)
        .write()
}


lowdb.updateQueries = function(query){
    db.get('queries')
        .push(query)
        .write();
};

lowdb.updateWebpages = function(id, webpages){
    db.get('queries')
        .find({ _id: id })
        .assign({ webpages: webpages})
        .write();
};


lowdb.updateSentLetters = function(value){
     db.set('sentletters', value)
        .write()
}
lowdb.updateDate = function(value){
    db.set('date', value)
        .write()
}





lowdb.getDbMeta = function(prop){
    return db.get(prop).value();
}

lowdb.updateDbMeta = function(prop, data){
    db.set(prop, data)
        .write()
}

lowdb.deleteQuery = function(id){
    db.get('queries')
        .remove({ _id: id })
        .write();
};



module.exports = lowdb;




























