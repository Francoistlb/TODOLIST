const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");

const app = express();
const port = 3000;
app.use(bodyParser.json());

const runFromDB = (sql_request) => {
    const db = new sqlite3.Database("db.sqlite");
    const result = db.serialize(() => {
        return db.run(sql_request)
    });
    db.close()
    return result
}

const allFromDB = (sql_request) => {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database("db.sqlite");
        db.all(sql_request, (err, rows) => {
            if (err) {
                reject(err); 
            } else {
                resolve(rows);
            }
        });
        db.close();
    });
}


// INIT BDD
runFromDB("CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY ASC, title TEXT, completed TINYINT)");

app.get("/todos", async (req, res) => {
    const todo = await allFromDB("Select * from todos");
    res.send(todo);
});

app.post("/todos", (req, res) => {
    const body = req.body;
    console.log(body);
    runFromDB(`INSERT INTO todos (title, completed) VALUES ("${body.title}", "0")`);
    res.status(200).send("Todo created");
});

app.put("/todos/:id", async (req, res) => {
    const {id} = req.params;
    const tasks = await allFromDB(`SELECT * FROM todos WHERE id = ${id}`);
    const task = tasks[0];
    console.log(task);
    runFromDB(`UPDATE todos SET completed = ${task?.completed ? 0 : 1} WHERE id = ${task.id}`);
    res.status(200).send(`Task modified (${task?.completed ? "uncompleted" : "completed"})`);
});

app.delete("/todos/:id", async (req, res) => {
    const {id} = req.params;
    runFromDB(`DELETE FROM todos WHERE id = ${id}`);   
    res.status(200).send(`Task deleted`);
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

