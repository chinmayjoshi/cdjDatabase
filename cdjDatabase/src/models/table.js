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

    getRows() {
        return this.rows;
    }

    
}

export default Table;