import fs from 'fs';

class InitializationService  {
    constructor(db) {
        this.db = db;
        databaseName = db.name;
        fileLocation = db.filename;
        this.init(databaseName, fileLocation,db);
    }

    /* 
        we want to load from file if it exists
        else we want to create a new file
        
    */

    init(name, location ,db) {
        console.log("Loading from memory");
        //if file exists load from file ,else create new file

        if(fs.existsSync(location)) {
            console.log("File exists");
            this.loadFromFile(location,db);
        }
        else {
            console.log("File does not exist");
            this.createFile(location,db);
        }

    }

    loadFromFile(location,db) {
        //read file and load data into db
        



    }

}