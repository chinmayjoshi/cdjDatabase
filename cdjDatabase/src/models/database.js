import Table from './table.js';
import fs from 'fs';
import InitializationService from '../services/init.js';
import constants from '../constants.js';
import appRootPath from 'app-root-path';
import Row from './row.js';
import util from "util";



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

    /*
     * Below methods support the in-memory implementation
     */

    createTable(name, columns) {
        let table = new Table(name, columns);
        if (this.data[name] != undefined) {
            throw new Error("Table already exists");
        }
        this.data[name] = table;
        //Cannot be used in deserialisation
        this.persistOnDisk();

    }

    insertRow(tableName, data) {

        if (this.validateInput(tableName, data) == false) {
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

    //Delete actually just empties the database
    deleteDB() {
        this.data = {};
        this.persistOnDisk();

    }

    // Hard persist - this being async can be a problem
    persistOnDisk() {
        let fileLocation = appRootPath + constants.baseLocation + this.filename;
        fs.writeFileSync(fileLocation, JSON.stringify(this.data), (err) => {
            if (err) {
                throw err;
            }
            console.log("Data written to file");
        });

    }

    //Read from file and return rows

    getRowsWithFilterAndAggregateRowImplementation(tableName, filterCriteria, aggregateColumn = null, aggregateOperation = null) {

        let directoryName = appRootPath + constants.baseLocation + "/" + tableName
        let fileLocation = directoryName + this.data[tableName].filename;

        let readStream = fs.createReadStream(fileLocation);
        readStream.setEncoding('utf8');

        let aggregateResult = {
            value: 0
        };
        let leadingHalf = "";
        let chunkCountForRow = 0;

        readStream.on('data', (chunk) => {

            chunkCountForRow++;
            //Will create a Util and move these methods there
            let rows = this.splitChunkIntoRows(chunk);
            this.processRows(tableName, rows, filterCriteria, aggregateColumn, aggregateOperation, aggregateResult, leadingHalf);

        });

        readStream.on('end', () => {
            console.log("End of file");
            if (aggregateColumn != null && aggregateOperation != null) {
                console.log(aggregateResult);
            }
            console.log("Chunk count for row " + chunkCountForRow);
            console.log("Row implemenation finished execution at " + new Date().getTime());
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

    processRows(tableName, rows, filterCriteria, aggregateColumn, aggregateOperation, aggregateResult, leadingHalf) {

        let i = 0;

        for (let row of rows) {
            try {
                let data = JSON.parse(row);
                //Creation of row object should happen in a method of row class
                let rowObject = new Row(data);
                this.filterOrAggregate(tableName, filterCriteria, aggregateColumn, aggregateOperation, rowObject, aggregateResult);
            } catch (err) {
                //Handle corner case where row is split across two chunks

                if (i == 0) {
                    row = leadingHalf + row;
                    try {
                        let rowObject = new Row(JSON.parse(row));
                        this.filterOrAggregate(tableName, filterCriteria, aggregateColumn, aggregateOperation, rowObject, aggregateResult);

                    } catch (err) {
                        //Do nothing
                    }

                }
                if (i == rows.length - 1) {
                    leadingHalf = row;
                }
            }

            i++;
        }
    }



    //Read from columnar file
    async getRowsWithFilterAndAggregateColumnImplementation(tableName, filterCriteria, aggregateColumn = null, aggregateOperation = null) {
        let directoryName = appRootPath + constants.baseLocation + "/" + tableName;

        let chunkCountForColumn = 0;

        let filteredIds = [];

        let promises = [];

        for (let key in filterCriteria) {

            let filteredIdsForFilter = [];

            let fileLocation = directoryName + "/" + key + ".cdj";

            let readStream = fs.ReadStream(fileLocation);
            readStream.setEncoding('utf8');
            readStream.on('data', (chunk) => {
                chunkCountForColumn++;
                let rows = this.splitChunkIntoRows(chunk);
                for (let row of rows) {
                    try {
                        let data = row.split(" ");
                        let id = data[0];
                        let value = data[1];

                        let table = this.data[tableName];
                        if (table.filterOnColumn(value, filterCriteria[key]) == true) {
                            filteredIdsForFilter.push(id);

                        }

                    } catch (err) {
                        //Boundary case
                        console.log(err);
                    }

                }

            });

            const streamEnded = util.promisify(readStream.on).bind(readStream);
            promises.push(streamEnded('end'));
            await streamEnded('end');
            console.log("Chunk count for column " + chunkCountForColumn);
            filteredIds.push(filteredIdsForFilter);

        }


        // wait for all read streams of all column files to finish
        await Promise.all(promises);

        let intersection = filteredIds.reduce((a, b) => a.filter(c => b.includes(c)));

        //Aggregation
        let aggregateResult = {
            value: 0
        };

        let fileLocation = directoryName + "/" + aggregateColumn + ".cdj";

        let aggregateColumnReadStream = fs.createReadStream(fileLocation);
        aggregateColumnReadStream.setEncoding('utf8');

        aggregateColumnReadStream.on('data', (chunk) => {
            let rows = this.splitChunkIntoRows(chunk);
            for (let row of rows) {
                try {
                    let data = row.split(" ");
                    let id = data[0];
                    let value = data[1];

                    if (intersection.includes(id)) {
                        if (aggregateOperation == "sum") {
                            //Handle type conversion
                            let parsedValue = parseInt(value);
                            if (!isNaN(parsedValue)) {
                                aggregateResult.value += parsedValue;
                            }
                        }
                        if (aggregateOperation == "count") {
                            aggregateResult.value += 1;
                        }
                    }
                } catch (err) {
                    //Boundary case
                    console.log(err);
                }


            }
        });

        aggregateColumnReadStream.on('end', () => {
            console.log("End of file");
            console.log("Column implementation result :" + aggregateResult.value);
            console.log("Column implementation finished execution at " + new Date().getTime());

        });


    }

    validateInput(tableName, data) {
        if (this.data[tableName] == undefined) {
            return false;
        } else {
            return true;
        }
    }

    filterOrAggregate(tableName, filterCriteria, aggregateColumn, aggregateOperation, rowObject, aggregateResult) {

        if (this.data[tableName].filter(rowObject, filterCriteria)) {
            if (aggregateColumn != null && aggregateOperation != null) {
                if (aggregateOperation == "sum") {
                    //get column location
                    let columnLocation = this.data[tableName].getColumnLocation(aggregateColumn);
                    let columnValue = rowObject.data[columnLocation];
                    aggregateResult.value += columnValue;
                }
                if (aggregateOperation == "count") {
                    aggregateResult.value += 1;
                }
            } else {
                //Only filters

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

        for (let tableName in data) {
            let tableData = data[tableName];
            let columns = tableData.columns;
            let rows = tableData.rows;
            let primaryKeyUniqueIndex = tableData.primaryKeyUniqueIndex;
            let primaryKeyColumnLocation = tableData.primaryKeyColumnLocation;
            let table = new Table(tableName, columns, primaryKeyUniqueIndex, primaryKeyColumnLocation);
            this.data[tableName] = table;

            for (let row of rows) {
                this.data[tableName].insertRow(row.data);
            }
        }

    }




    /* 
    * Write methods 
    * TODO : Implement bulk write methods for these for large data

    */

    //Write to row-wise structure on disk
    appendToFile(tableName, data) {
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

        for (let i = 0; i < columns.length; i++) {

            let fileLocation = directoryName + "/" + columns[i].name + ".cdj";
            fs.existsSync(fileLocation) || fs.writeFileSync(fileLocation, "");
            let value = data[i];
            let primaryKeyValue = data[primaryKeyIndex];
            let datatowrite = primaryKeyValue + " " + value;
            fs.appendFileSync(fileLocation, datatowrite + "\n", (err) => {
                if (err) {
                    throw err;
                }
            });

        }


    }

}

export default Database;