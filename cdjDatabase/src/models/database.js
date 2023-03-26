import Table from './table.js';

class Database {
    //file for persistance

    filename = null;
    name = null;
    data = null;

    constructor(name) {
        this.name = name;
        this.filename = `./${name}.cdj`;
        this.data = {};
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



}

export default Database;

