import Database from "../src/models/database.js";
import Terminal from "../visualisers/terminal.js";
import { faker } from '@faker-js/faker';
 


function tests() {
    let db = new Database("test");
    // Test 1 table creation
    db.createTable("test", [{"name":"id","type":"number"},{"name":"name","type":"string"}, {"name":"age","type":"number"}]);
    
    // Test 2 insert row
    db.insertRow("test", [1,"John", 20]);
    db.insertRow("test", [2,"Jane", 21]);
    db.insertRow("test", [3,"Jack", 22]);

    //use faker to insert 1000 rows
     for (let i = 0; i < 1000; i++) {
        db.insertRow("test", [i, faker.name.firstName(),Math.ceil(Math.random()* 80)]);
    }


    // Test 3 get rows
    let rows = db.data["test"].getRows();
    //Terminal.printRows(rows);

    // Test 4 get rows with filter
    let filteredRows = db.data["test"].getRowsWithFilter({name:{value : "John",operation : "equals"},age:{value :20 ,operation : "equals"}});
    Terminal.printRows(filteredRows);
    
    // Test 5 get rows with greater than filter
    let filteredRows2 = db.data["test"].getRowsWithFilter({age:{value :75 ,operation : "greater"}});
    Terminal.printRows(filteredRows2);


    
}

tests();