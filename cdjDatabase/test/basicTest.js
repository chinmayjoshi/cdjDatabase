import Database from "../src/models/database.js";
import Terminal from "../visualisers/terminal.js";
import { faker } from '@faker-js/faker';
 
function tests() {
    let dbname = "testdb2";
    let tableName = "test7";
    let db = new Database(dbname);
    // Test 1 table creation
    // db.createTable(tableName, [{"name":"id","type":"number"},{"name":"name","type":"string"}, {"name":"age","type":"number"}]);
    
    // Test 2 insert row
    db.insertRow(tableName, [1,"John", 20]);
    db.insertRow(tableName, [2,"Jane", 21]);
    db.insertRow(tableName, [3,"Jack", 22]);

    //use faker to insert 1000 rows
     for (let i = 0; i < 1000; i++) {
        db.insertRow(tableName, [i, faker.name.firstName(),Math.ceil(Math.random()* 80)]);
    }


    // Test 3 get rows
    let rows = db.data[tableName].getRows();
    //Terminal.printRows(rows);

    // Test 4 get rows with filter
    let filteredRows = db.data[tableName].getRowsWithFilter({name:{value : "John",operation : "equals"},age:{value :20 ,operation : "equals"}});
    Terminal.printRows(filteredRows);
    
    // Test 5 get rows with greater than filter
    let filteredRows2 = db.data[tableName].getRowsWithFilter({age:{value :75 ,operation : "greater"}});
    Terminal.printRows(filteredRows2);

    // Delete Database file
    // db.deleteDB();


    
}

tests();