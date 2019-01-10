
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('./db.json');
const db = low(adapter);

// console.log(global.__basedir);

var setDbDefaults = ()=>{
    db.defaults({queries: [], allsentemails: [] })
        .write()

    // db.set('user', data.user)
    //     .write();
    // db.set('counters', data.counters)
    //     .write();
    // db.set('products', [])
    //     .write();
    // db.get('products')
    //     .push(data.products_1)
    //     .push(data.products_2)
    //     .write();
    // db.get('letters')
    //     .push(data.letter)
    //     .write();

}
if ( !db.get('queries').size().value() ) setDbDefaults();

// console.log( db.get('queries').size().value())

module.exports = db;






























