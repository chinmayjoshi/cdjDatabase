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
    let startTime = new Date().getTime();
    let db = new Database(dbname);
    let endTime = new Date().getTime();
    console.log("Time taken to read in-mem structure for columns" + (endTime - startTime));
    let rows = db.getRows(tableName);
    db.getRowsWithFilterAndAggregateColumnImplementation(tableName, {age:{value :75 ,operation : "greater"}});

}
async function readTestAggregate(dbname,tableName,filter,aggregateColumn,aggregateOperation){
    let db = new Database(dbname);
    console.log("Row implementation started at " + new Date().getTime());
    await db.getRowsWithFilterAndAggregateRowImplementation(tableName,filter,aggregateColumn,aggregateOperation);
  
}

async function readTestColumnarAggregate(dbname,tableName,filter,aggregateColumn,aggregateOperation){
    let db = new Database(dbname);
    console.log("Columnar implementation started at " + new Date().getTime());
    await db.getRowsWithFilterAndAggregateColumnImplementation(tableName,filter,aggregateColumn,aggregateOperation);

}









let filter = {age:{value :18 ,operation : "greater"}, salary:{value : 10000, operation : "greater"}};

let dbname = "bigDataTest";
let tableName = "wideTable";

console.log("Inputs are " + dbname + " " + tableName + " " + JSON.stringify(filter));

await readTestAggregate(dbname,tableName,filter,"salary","sum");

await readTestColumnarAggregate(dbname,tableName,filter,"salary","sum");

//Higher order function to time the execution of a function

function timeFunction(func, args) {
    let start = new Date().getTime();
    func(args);
    let end = new Date().getTime();
    return end - start;
}





