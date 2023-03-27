import Table from './table.js';
import fs from 'fs';
import init from '../init.js';


class Database {
    //file for persistance

    filename = null;
    name = null;
    data = null;

    constructor(name) {
        this.name = name;
        this.filename = `./${name}.cdj`;
        this.data = {};
        init(this);
    }

    createTable(name,columns) {
        let table = new Table(name,columns);
        this.data[name] = table;
    }

    insertRow(tableName, data) {
        this.data[tableName].insertRow(data);
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

    persistOnDisk() {
        fs.writeFile(this.filename, JSON.stringify(this.data), (err) => {
            if (err) {
                throw err;
            }
            console.log("Data written to file");
        });
        
    }



}

export default Database;

