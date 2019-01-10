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

lowdb.getQuery = function(id){
    let result = db.get('queries')
        .find({ _id: id })
        .value();
    return result;
};

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

lowdb.getQuerieEmails = function(id){
    var result = db.get('queries').find({ _id: id }).value().emails;
    return result;
}
lowdb.getQuerieSentMessages = function(id){
    var result = db.get('queries').find({ _id: id }).value().sentmessages;
    return result;
}


lowdb.updateQuerieSentMessages = function(id){
    db.get('queries').find({ _id: id }).update('sentmessages', n => n + 1)
        .write();
}

lowdb.getAllSentEmails = function(){
    var result = db.get('allsentemails').value();
    return result;
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

lowdb.deleteQuery = function(id){
    db.get('queries')
        .remove({ _id: id })
        .write();
};



module.exports = lowdb;




























