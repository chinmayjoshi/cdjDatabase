import fs from 'fs';
import constants from '../constants.js';
import appRootPath from 'app-root-path';

//Not a great pattern of using a service
class InitializationService  {
    constructor(db) {
        this.db = db;
        let databaseName = db.name;
        let fileLocation = appRootPath + constants.baseLocation + db.filename;
        console.log(fileLocation);
        this.init(databaseName, fileLocation,db);
    }

    /* 
        we want to load from file if it exists
        else we want to create a new file

    */

    init(name, location ,db) {
        console.log("Attempting to load from disk");
        //if file exists load from file ,else create new file

        if(fs.existsSync(location)) {
            console.log("File exists");
            this.#loadFromFile(location,db);
        }
        else {
            console.log("File does not exist");
            this.#createFile(location,db);
        }

    }

    //TODO : See if redis does this faster in any manner

    #loadFromFile(location,db) {
        //read file and load data into db
        let bufferedData = fs.readFileSync(location);
        let data = JSON.parse(bufferedData);
        db.deserialize(data);

    }

    #createFile(location,db) {
        fs.writeFileSync(location, JSON.stringify(db.data), (err) => {
            if (err) {
                throw err;
            }
            console.log("Data written to file");
        }
    )}


}

export default InitializationService;