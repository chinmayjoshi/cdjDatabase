import Database from "../src/models/database.js";
import Terminal from "../visualisers/terminal.js";


function tests() {
    let db = new Database("test");
    // Test 1 table creation
    db.createTable("test", [{"name":"id","type":"number"},{"name":"name","type":"string"}, {"name":"age","type":"number"}]);
    
    // Test 2 insert row
    db.insertRow("test", [1,"John", 20]);
    db.insertRow("test", [2,"Jane", 21]);
    db.insertRow("test", [3,"Jack", 22]);

    // Test 3 get rows
    let rows = db.data["test"].getRows();
    Terminal.printRows(rows);
    
}

tests();