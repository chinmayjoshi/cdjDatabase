//Depends on db and table already existing 
import Database from "../src/models/database.js";


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
let aggregateColumn = "salary";
let aggregateOperation = "sum";

// Test 1 

// console.log("Inputs are " + dbname + " " + tableName + " " + JSON.stringify(filter) + " " + aggregateColumn + " " + aggregateOperation);

// await readTestAggregate(dbname,tableName,filter,aggregateColumn,aggregateOperation);
// await readTestColumnarAggregate(dbname,tableName,filter,aggregateColumn,aggregateOperation);

// Test 2 

filter = {age:{value :30 ,operation : "greater"}}
console.log("Inputs are " + dbname + " " + tableName + " " + JSON.stringify(filter) + " " + aggregateColumn + " " + aggregateOperation);

await readTestAggregate(dbname,tableName,filter,"age","count");
await readTestColumnarAggregate(dbname,tableName,filter,"age","count");








