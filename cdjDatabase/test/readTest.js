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
    db.getRowsWithFilterAndAggregateColumnImplementation(tableName, {age:{value :75 ,operation : "greater"}});

}
function readTestAggregate(dbname,tableName ){
    let db = new Database(dbname);
    db.getRowsWithFilterAndAggregateRowImplementation(tableName, {age:{value :30 ,operation : "greater"}},"age","sum");
    console.log("Rows count " + db.getRows(tableName).length);

    

}

// Create a higher order that takes in a function and calculates the time taken to execute the function




// readTestRowStructure();
readTestAggregate("testdb5","test");

// timeTaken(readTestAggregate);

// sum  688710
// 729364

