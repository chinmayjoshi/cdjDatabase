import Table from './table.js';
import fs from 'fs';
import InitializationService from '../services/init.js';
import constants from '../constants.js';
import appRootPath from 'app-root-path';
import Row from './row.js';
import Column from './column.js';


class Database {

    //file for persistance of in-memory database

    filename = null;
    name = null;
    data = {};


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
        //Cannot be used in deserialisation
        this.persistOnDisk();
        
    }

    insertRow(tableName, data) {

        if(this.validateInput(tableName,data) == false) {
            throw new Error("Table does not exist");
        }
        this.data[tableName].insertRow(data);
        this.appendToFile(tableName, data);
        this.appendColumnarToFile(tableName, data);
        this.persistOnDisk();
    }

    insertMultipleRows(tableName, rows) {
        this.data[tableName].insertMultipleRows(rows);
    }

    getRows(tableName) {
        return this.data[tableName].getRows();
        
    }

    getRowsWithFilter(tableName, filterCriteria) {
        return this.data[tableName].getRowsWithFilter(filterCriteria);
    }

    //Read from file and return rows

    getRowsWithFilterAndAggregateRowImplementation(tableName, filterCriteria, aggregateColumn = null, aggregateOperation = null) {

        let directoryName = appRootPath + constants.baseLocation + "/" + tableName
        let fileLocation = directoryName + this.data[tableName].filename;

        let readStream =  fs.createReadStream(fileLocation);
        readStream.setEncoding('utf8');

        let aggregateResult = {value: 0};
        let leadingHalf = "";

        readStream.on('data', (chunk) => {

            //Will create a Util and move these methods there
            let rows = this.splitChunkIntoRows(chunk);
            this.processRows(tableName,rows, filterCriteria, aggregateColumn, aggregateOperation, aggregateResult, leadingHalf);

        });
        
        readStream.on('end', () => {
            console.log("End of file");
            if(aggregateColumn != null && aggregateOperation != null) {
                console.log(aggregateResult);
            }
        });

        readStream.on('error', (err) => {
            console.log(err.stack);
        });


    }

    //Helper functions

    splitChunkIntoRows(chunk) {
        let rows = chunk.split("\n");
        return rows;
    }

    processRows(tableName,rows, filterCriteria, aggregateColumn, aggregateOperation, aggregateResult, leadingHalf) {

        let i =0;
        
        for(let row of rows) {
            try {
                let data = JSON.parse(row);
                //Creation of row object should happen in a method of row class
                let rowObject = new Row(data);
                this.filterOrAggregate(tableName, filterCriteria, aggregateColumn, aggregateOperation, rowObject,aggregateResult);
            }
            catch(err) {
                //Handle corner case where row is split across two chunks

                if(i == 0) {
                    row = leadingHalf + row;
                    try {
                        let rowObject = new Row(JSON.parse(row));
                        this.filterOrAggregate(tableName, filterCriteria, aggregateColumn, aggregateOperation, rowObject,aggregateResult);

                    }
                    catch(err) {
                        //Do nothing
                    }
                    
                }
                if(i == rows.length - 1) {
                    leadingHalf = row;
                }
            }

        i++; 
        }
    }

    

    //Read from columnar file
    getRowsWithFilterAndAggregateColumnImplementation(tableName, filterCriteria, aggregateColumn = null, aggregateOperation = null) {
        let directoryName = appRootPath + constants.baseLocation + "/" + tableName;
        if(aggregateColumn != null && aggregateOperation != null) {
            let fileLocation = directoryName + "/" + aggregateColumn + ".cdj";
            let readStream =  fs.createReadStream(fileLocation);
            readStream.setEncoding('utf8');

            let aggregateResult = {value: 0};

            readStream.on('data', (chunk) => {
                let rows = this.splitChunkIntoRows(chunk);
                
                for(let row of rows) {
                    try {
                        let data = row.split(" ");
                        //Filter and aggregate 
                        if(aggregateColumn != null && aggregateOperation != null) {
                            if(aggregateOperation == "sum") {
                                aggregateResult.value += parseInt(data[1]);
                            }
                        }
                    }
                    catch(err) {
                        //Do nothing
                    }
                }

            });

            readStream.on('end', () => {
                console.log("End of file");
                if(aggregateColumn != null && aggregateOperation != null) {
                    console.log(aggregateResult);
                }
            });

            
        }
       
    }
    

    validateInput(tableName, data) {
        if (this.data[tableName] == undefined) {
            return false;
        }
        else {
            return true;
        }
    }

    filterOrAggregate(tableName, filterCriteria, aggregateColumn, aggregateOperation, rowObject,aggregateResult) {

        if(this.data[tableName].filter(rowObject, filterCriteria)) {
            if(aggregateColumn != null && aggregateOperation != null) {
                if(aggregateOperation == "sum") {
                    //get column location
                    let columnLocation = this.data[tableName].getColumnLocation(aggregateColumn);
                    let columnValue = rowObject.data[columnLocation];
                    aggregateResult.value += columnValue;

                }
            } 
            else {
                //Only filters
                console.log(rowObject.data);
            }
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
                let primaryKeyUniqueIndex = tableData.primaryKeyUniqueIndex;
                let primaryKeyColumnLocation = tableData.primaryKeyColumnLocation;
                let table = new Table(tableName,columns,primaryKeyUniqueIndex,primaryKeyColumnLocation);
                this.data[tableName] = table;
                
                for(let row of rows) {
                    this.data[tableName].insertRow(row.data);
                }
            }

    }


    //Delete actually just empties the database
    deleteDB() {
        this.data = {};
        this.persistOnDisk();

    }

    // Hard persist only useful for persisting in-memory database
    persistOnDisk() {
        let fileLocation = appRootPath + constants.baseLocation + this.filename;
        fs.writeFileSync(fileLocation, JSON.stringify(this.data), (err) => {
            if (err) {
                throw err;
            }
            console.log("Data written to file");
        });
        
    }

    //Write to row-wise structure on disk
    appendToFile(tableName, data) {
        console.log("Appending to file");
        let directoryName = appRootPath + constants.baseLocation + "/" + tableName
        let fileLocation = directoryName + this.data[tableName].filename;
        //Create directory if it does not exist
        fs.existsSync(directoryName) || fs.mkdirSync(directoryName);

        //create file if it does not exist
        fs.existsSync(fileLocation) || fs.writeFileSync(fileLocation, "");

        fs.appendFileSync(fileLocation, JSON.stringify(data) + "\n", (err) => {
            if (err) {
                throw err;
            }
            console.log("Data written to file for row storage");
        });

    }

    /*
    * Write to columnar structure on disk
    */
    appendColumnarToFile(tableName, data) {
 
        let directoryName = appRootPath + constants.baseLocation + "/" + tableName;
        fs.existsSync(directoryName) || fs.mkdirSync(directoryName);

        let columns = this.data[tableName].columns;

        let primaryKeyName = this.data[tableName].getPrimaryKey().name;
        let primaryKeyIndex = columns.findIndex((column) => column.name == primaryKeyName);

        for (let i=0;i<columns.length; i++) {

            let fileLocation = directoryName + "/" + columns[i].name + ".cdj";
            fs.existsSync(fileLocation) || fs.writeFileSync(fileLocation, "");
            let value = data[i];
            let primaryKeyValue = data[primaryKeyIndex];
            let datatowrite = primaryKeyValue + " " + value;
            fs.appendFileSync(fileLocation, datatowrite + "\n", (err) => {
                if (err) {
                    throw err;
                }
                console.log("Data written to file for columnar storage");
            }
            );

        }


    }

}

export default Database;


