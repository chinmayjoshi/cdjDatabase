import Table  from "../../src/models/table";

test("Table creation", () => {
    let table = new Table("test", [{"name":"id","type":"number"},{"name":"name","type":"string"}, {"name":"age","type":"number"}]);
    expect(table.name).toBe("test");
    expect(table.columns.length).toBe(3);
    expect(table.rows.length).toBe(0);
}
);

test("Insert row", () => {
    let table = new Table("test", [{"name":"id","type":"number"},{"name":"name","type":"string"}, {"name":"age","type":"number"}]);
    table.insertRow([1,"John", 20]);
    expect(table.rows.length).toBe(1);
    expect(table.rows[0].data).toStrictEqual([1,"John", 20]);
    expect(table.rows[0].columns).toStrictEqual(["id","name","age"]);
}
);

test("Insert multiple rows", () => {
    let table = new Table("test", [{"name":"id","type":"number"},{"name":"name","type":"string"}, {"name":"age","type":"number"}]);
    table.insertMultipleRows([[1,"John", 20],[2,"Jane", 21],[3,"Jack", 22]]);
    expect(table.rows.length).toBe(3);
    expect(table.rows[0].data).toStrictEqual([1,"John", 20]);
    expect(table.rows[0].columns).toStrictEqual(["id","name","age"]);
    expect(table.rows[1].data).toStrictEqual([2,"Jane", 21]);
    expect(table.rows[1].columns).toStrictEqual(["id","name","age"]);
    expect(table.rows[2].data).toStrictEqual([3,"Jack", 22]);
    expect(table.rows[2].columns).toStrictEqual(["id","name","age"]);
}
);

test("Get rows", () => {
    let table = new Table("test", [{"name":"id","type":"number"},{"name":"name","type":"string"}, {"name":"age","type":"number"}]);
    table.insertMultipleRows([[1,"John", 20],[2,"Jane", 21],[3,"Jack", 22]]);
    let rows = table.getRows();
    expect(rows.length).toBe(3);
    expect(rows[0].data).toStrictEqual([1,"John", 20]);
    expect(rows[0].columns).toStrictEqual(["id","name","age"]);
    expect(rows[1].data).toStrictEqual([2,"Jane", 21]);
    expect(rows[1].columns).toStrictEqual(["id","name","age"]);
    expect(rows[2].data).toStrictEqual([3,"Jack", 22]);
    expect(rows[2].columns).toStrictEqual(["id","name","age"]);
}
);

test("Get rows with filter", () => {
    let table = new Table("test", [{"name":"id","type":"number"},{"name":"name","type":"string"}, {"name":"age","type":"number"}]);
    table.insertMultipleRows([[1,"John", 20],[2,"Jane", 21],[3,"Jack", 22]]);
    let rows = table.getRowsWithFilter({name:{value : "John",operation : "equals"},age:{value :20 ,operation : "equals"}});
    expect(rows.length).toBe(1);
    expect(rows[0].data).toStrictEqual([1,"John", 20]);
    expect(rows[0].columns).toStrictEqual(["id","name","age"]);
}
);

