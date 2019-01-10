class Query{
    constructor(){
        this._id = '';
        this.query = "";
        this.error = null;
        this.date = '';
        this.message = '';
        this.sentmessages = 0;
        this.datesendingemails = '';
        this.webpages = [];
        this.emails = [];
        this.fetchemails = false;
        this.emailstatistics = {};
    }
}

module.exports = Query;