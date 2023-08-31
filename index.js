import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

var tasks = [];

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index.ejs", {
        tasks: tasks
    })
  });

app.post("/addtask", (req, res) => {
    tasks.push(req.body["task"])
    res.redirect("/");
});

app.listen(port, () => {
console.log(`Listening on port ${port}`);
});