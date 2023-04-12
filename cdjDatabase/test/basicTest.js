import Database from "../src/models/database.js";
import Terminal from "../visualisers/terminal.js";
import { faker } from '@faker-js/faker';
 
function tests() {
    let dbname = "testdb5";
    let tableName = "test";
    //Initialisation of database is writing to row and columnar files
    let db = new Database(dbname);
    // Test 1 table creation
    db.createTable(tableName, [{"name":"id","type":"number","is_primary":1},{"name":"name","type":"string"}, {"name":"age","type":"number"}, {"name":"address","type":"string"}]);

    //use faker to insert 1000 more rows

    let largestId = db.data[tableName].getRows().reduce((max, row) => row.data[0] > max ? row.data[0] : max, 0);
     for (let i = 1; i < 100; i++) {
        db.insertRow(tableName, [largestId + i, faker.name.firstName(),Math.ceil(Math.random()* 80),faker.address.streetAddress()]);
    }


    // // Test 3 get rows
    // let rows = db.data[tableName].getRows();
    // //Terminal.printRows(rows);

    // // Test 4 get rows with filter
    // let filteredRows = db.data[tableName].getRowsWithFilter({name:{value : "John",operation : "equals"},age:{value :20 ,operation : "equals"}});
    // Terminal.printRows(filteredRows);
    
    // // Test 5 get rows with greater than filter
    // let filteredRows2 = db.data[tableName].getRowsWithFilter({age:{value :75 ,operation : "greater"}});
    // Terminal.printRows(filteredRows2);

    // // Delete Database file
    // // db.deleteDB();

    // Add a cleanup function to delete the database file and directory


    
}

function createDBandTable(dbname, tableName, columns,rowCount) {
    let db = new Database(dbname);
    db.createTable(tableName, columns);
    let largestId = db.data[tableName].getRows().reduce((max, row) => row.data[0] > max ? row.data[0] : max, 0);
    for (let i = 1; i < rowCount; i++) {
        db.insertRow(tableName, [largestId + i, faker.name.firstName(),Math.ceil(Math.random()* 80),faker.address.streetAddress(),
        faker.lorem.paragraph(),Math.ceil(Math.random()* 100000),faker.address.city(),faker.address.country()]);
    }
    return db;
    
}

// tests();


let columns = [{"name":"id","type":"number","is_primary":1},{"name":"name","type":"string"}, 
{"name":"age","type":"number"}, {"name":"address","type":"string"}, {"name":"description","type":"string"},
{"name":"salary","type":"number"}, {"name":"city","type":"string"}, {"name":"country","type":"string"},
];

createDBandTable("bigDataTest3", "wideTable3",columns,50000);