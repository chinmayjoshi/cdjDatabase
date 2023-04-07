import Column from './column.js';
import Row from './row.js';

class Table {
    rows = [];
    name = "";
    columns = [];
    filename = null;
    primaryKeyUniqueIndex = [];
    primaryKeyColumnLocation = 0;

    constructor(name, columns ,primaryKeyColumnLocation = 0, primaryKeyUniqueIndex = []) {
        this.name = name;
        let i =0;
        for (let column of columns) {
            try {
                if(column.is_primary == undefined){
                column = new Column(column.name, column.type);
                }
                else {
                    column = new Column(column.name, column.type, column.is_primary);
                    if(column.is_primary) {
                        this.primaryKeyColumnLocation = i;
                    }
                }
            }
            catch (e) {
                throw e;
            }
            this.columns.push(column);
            i++;
        }
        //Tables now have to be unique across databases
        this.filename = `/${name}` + "_table.cdj";
    }

    insertRow(data) {
        if (data.length != this.columns.length) {
            throw new Error("Invalid row length");
        }

        let primaryKeyInRow = data[this.primaryKeyColumnLocation];
        if (this.primaryKeyUniqueIndex.includes(primaryKeyInRow)) {
            throw new Error("Violates unique constraint on primary key");
        }
        else {
            this.primaryKeyUniqueIndex.push(primaryKeyInRow);
        }

        let row = new Row(data);
        this.rows.push(row);
    }

    //TODO : Finish implementing this typecheck function
    insertFewColumns(columns,data) {
        if (columns.length != data.length) {
            throw new Error("Invalid row length");
        }
        for (let i = 0; i < columns.length; i++) {
            
        }
    }

    insertMultipleRows(rows) {
        for (let row of rows) {
            this.insertRow(row);
        }
    }
    

    getPrimaryKey() {
        for (let column of this.columns) {
            if (column.is_primary) {
                return column;
            }
        }
    }

    //Select * from table

    getRows() {
        return this.rows;
    }

    // Filter criteria example 
    // {name:{value : "John",operation : "equals"},age:{value :20 ,operation : "equals"}}
    getRowsWithFilter(filterCriteria) {
        let filteredRows = [];
        for (let row of this.rows) {
            if (this.filter(row,filterCriteria)) {
                filteredRows.push(row);
            }
        }
        return filteredRows;
    }

    getColumnLocation(columnName) {
        let index = this.columns.findIndex((column) => column.name == columnName);
        if (index == -1) {
            throw new Error("Invalid column name");
        }
        return index;
    }


    //Private methods

    filter(row,filters) {

        for (let key in filters) {
            
            let index = this.columns.findIndex((column) => column.name == key);
            if (index == -1) {
                throw new Error("Invalid filter criteria");
            }

            if(filters[key]["operation"] == "equals") {
                    if (row.data[index] != filters[key]["value"]) {
                        return false;
                    }
            }
            else if(filters[key]["operation"] == "greater") {
                if (row.data[index] <= filters[key]["value"]) {
                    return false;
                }
            }
            else if(filters[key]["operation"] == "less") {
                if (row.data[index] >= filters[key]["value"]) {
                    return false;
                }
            }
            else {
                throw new Error("Invalid operation");
            }

        }
        return true;
    }

    }

export default Table;