import Table from './table.js';
import fs from 'fs';
import InitializationService from '../services/init.js';
import constants from '../constants.js';
import appRootPath from 'app-root-path';



class Database {
    //file for persistance

    //Store metadata on a separate file

    filename = null;
    name = null;
    meta_filename = null;
    data = {};
    metadata = {};


    constructor(name) {
        this.name = name;
        this.filename = `/${name}.cdj`;
        this.meta_filename = `/${name}.meta`;
        this.data = {};
        this.init_service = new InitializationService(this);
        
    }

    createTable(name,columns) {
        let table = new Table(name,columns);
        if(this.data[name] != undefined) {
            throw new Error("Table already exists");
        }
        this.data[name] = table;
    }

    insertRow(tableName, data) {
        if(this.validateInput(tableName,data) == false) {
            throw new Error("Table does not exist");
        }
        this.data[tableName].insertRow(data);
        this.persistOnDisk();
    }

    insertMultipleRows(tableName, rows) {
        this.data[tableName].insertMultipleRows(rows);
        this.persistOnDisk();
    }

    getRows(tableName) {
        return this.data[tableName].getRows();
        
    }

    getRowsWithFilter(tableName, filterCriteria) {
        return this.data[tableName].getRowsWithFilter(filterCriteria);
    }

    validateInput(tableName, data) {
        if (this.data[tableName] == undefined) {
            return false;
        }
        else {
            
            return true;
        }
    }

    deserialize(data) {

            //skip if data is empty
            if (Object.keys(data).length === 0) {
                this.data = {};
                return;
            }

            //Create tables from data, deserialize data
            
            for ( let tableName in data) {
                let tableData = data[tableName];
                let columns = tableData.columns;
                let rows = tableData.rows;
                console.log(rows);
                this.createTable(tableName, columns);
                for(let row of rows) {
                    this.insertRow(tableName,row["data"]);
                }
            }

    }


    //Delete actually just empties the database
    deleteDB() {
        this.data = {};
        this.persistOnDisk();

    }


    persistOnDisk() {
        let fileLocation = appRootPath + constants.baseLocation + this.filename;
        fs.writeFileSync(fileLocation, JSON.stringify(this.data), (err) => {
            if (err) {
                throw err;
            }
            console.log("Data written to file");
        });
        
    }

}

export default Database;

