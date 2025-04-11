const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const port = 3000;

const runFromDB = (sql_request) => {
    const db = new sqlite3.Database("db.sqlite");
    const result = db.serialize(() => {
        return db.run(sql_request)
    });
    db.close()
    return result
}

// INIT BDD
runFromDB("CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY ASC, title TEXT, completed TINYINT)");

app.get("/", (req, res) => {
    const todo = runFromDB("Select * from todos");
    res.send(todo);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

