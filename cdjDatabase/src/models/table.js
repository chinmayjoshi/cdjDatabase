import Column from './column.js';
import Row from './row.js';

class Table {
    rows = [];
    name = "";
    columns = [];

    constructor(name, columns) {
        this.name = name;
        for (let column of columns) {
            try {
                column = new Column(column.name, column.type);
            }
            catch (e) {
                throw e;
            }
            this.columns.push(column);
        }
    }

    insertRow(data) {
        if (data.length != this.columns.length) {
            console.log(data)
            console.log(this.columns)
            throw new Error("Invalid row length");
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

    //Select * from table

    getRows() {
        return this.rows;
    }

    // Filter criteria example 
    // {name:{value : "John",operation : "equals"},age:{value :20 ,operation : "equals"}}
    getRowsWithFilter(filterCriteria) {
        let filteredRows = [];
        for (let row of this.rows) {
            if (this.#filter(row,filterCriteria)) {
                filteredRows.push(row);
            }
        }
        return filteredRows;
    }

    //Private methods

    #filter(row,filters) {

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