class Terminal {

    static printRows(rows) {
        for (let row of rows) {
            this.printRow(row);
        }
    }

    static printRow(row) {
        console.log(row.data);
    }

}

export default Terminal;