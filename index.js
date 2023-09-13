import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/todolistDB")

const taskSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, "Task must include content."]
    },
    checked: String
})

const Task = mongoose.model("Task", taskSchema)

const task1 = new Task({
                        content: "Order hotel in Berlin",
                        checked: "" 
                        })

const task2 = new Task({
                        content: "Check-in the flight",
                        checked: ""
                        })

const task3 = new Task({
                        content: "Get flight insurance",
                        checked: "" 
                        })

const defaultTasks = [task1, task2, task3];

app.get("/", async (req, res) => {
    let tasks = await Task.find({}).exec()
        if (tasks.length === 0) {
            try {
                await Task.insertMany(defaultTasks)
                tasks = await Task.find({}).exec()
            } catch (err) {
                console.log(err)
            }
        }
            res.render("index.ejs", {
                tasks
            })
})

app.post("/addtask", async (req, res) => {
    const newContent = req.body["newTask"]
    const newTask = new Task({
        content: newContent,
        checked: "" 
        })
    try {
        await newTask.save()
        res.redirect("/")
    }
    catch (err) {
        console.log(err)
    }
})

app.post("/delete", async (req, res) => {
    const checkedTaskId = req.body.checkbox
    try {
        await Task.deleteOne({ _id: checkedTaskId})
        console.log("Task Deleted!")
        res.redirect("/")
    } catch {(err) 
        console.log(err)
    }
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})