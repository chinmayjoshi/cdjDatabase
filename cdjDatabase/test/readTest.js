//Depends on db and table already existing 
import Database from "../src/models/database.js";

// I can create three scenarios for 
// Filter and return all columns 
// Filter and return specific columns
// Aggregate over a column and return the result

function readTestRowStructure(dbname,tableName){
    let db = new Database(dbname);
    db.getRowsWithFilterAndAggregateRowImplementation(tableName, {age:{value :30 ,operation : "greater"}});

}

function readTestColumnStructure(dbname,tableName){
    let db = new Database(dbname);
    let rows = db.getRows(tableName);
    db.getRowsWithFilterAndAggregateColumnImplementation(tableName, {age:{value :1 ,operation : "greater"}});

}
function readTestAggregate(dbname,tableName ){
    let db = new Database(dbname);
    db.getRowsWithFilterAndAggregateRowImplementation(tableName, {age:{value :1 ,operation : "greater"}},"age","sum");
    console.log("Rows count " + db.getRows(tableName).length);
}

function readTestColumnarAggregate(dbname,tableName ){
    let db = new Database(dbname);
    db.getRowsWithFilterAndAggregateColumnImplementation(tableName, {age:{value :1 ,operation : "greater"}},"age","sum");
}





// readTestRowStructure();

//Fixed test - do not change - {value: 4037}
readTestAggregate("testdb5","test");

readTestColumnarAggregate("testdb5","test");



