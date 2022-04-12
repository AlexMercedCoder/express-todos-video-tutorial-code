// *********************************
// Enabling Enviromental Variables
// *********************************
import dotenv from "dotenv"
dotenv.config()

// *********************************
// Import Dependencies
// *********************************
import express from "express"
import methodOverride from "method-override"
import cors from "cors"
import morgan from "morgan"
import MainController from "./controllers/MainController.js"
import APIController from "./controllers/APIController.js"
import UnauthController from "./controllers/UnauthController.js"
import mongoose from "mongoose"
import session from 'express-session'
import MongoStore from 'connect-mongo'

// *********************************
// Global Variables & Controller Instantiation
// *********************************
const PORT = process.env.PORT || 3333
const MONGO_URI = process.env.MONGO_URI
const mainController = new MainController()
const apiController = new APIController()
const unauthController = new UnauthController()

// *********************************
// MongoDB Connection
// *********************************
mongoose.connect(MONGO_URI)

mongoose.connection
.on("open", () => console.log("Connected to Mongo"))
.on("close", () => console.log("Disonnected from Mongo"))
.on("error", (error) => console.log(error))

// *********************************
// Model Objects
// *********************************
const TodoSchema = new mongoose.Schema({
    message: String,
    completed: Boolean,
    username: String
})

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}
})

const Todo = mongoose.model("Todo", TodoSchema)
const User = mongoose.model("User", UserSchema)

// *********************************
// Creating Application Object
// *********************************
const app = express()

// *********************************
// Routers
// *********************************
const MainRoutes = express.Router()
const APIRoutes = express.Router()
const UnauthRoutes = express.Router()

// *********************************
// Middleware
// *********************************
// Global Middleware
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(methodOverride("_method"))
app.use("/static", express.static("static"))
app.use(morgan("tiny"))
app.use(session({
    secret: process.env.SECRET,
    store: MongoStore.create({ mongoUrl: MONGO_URI }),
    resave: false,
    saveUninitialized: true
  }));
app.use((req, res, next) => {
    req.models = {
        Todo,
        User
    }
    next()
})
app.use("/", UnauthRoutes)
app.use("/", MainRoutes)
app.use("/api", APIRoutes)
// Router Specific Middleware
APIRoutes.use(cors())
MainRoutes.use((req, res, next) => {
    if (req.session.loggedIn){
        next()
    }else {
        res.redirect("/")
    }
})


// *********************************
// Unauthenticated
// *********************************
UnauthRoutes.get("/", unauthController.main)
UnauthRoutes.post("/signup", unauthController.signup)
UnauthRoutes.post("/login", unauthController.login)
UnauthRoutes.post("/logout", unauthController.logout)


// *********************************
// Routes that Render Pages with EJS
// *********************************
MainRoutes.get("/todo", mainController.index) // "/"
MainRoutes.get("/todo/new", mainController.new)
MainRoutes.post("/todo", mainController.create)
MainRoutes.get("/todo/:id", mainController.show)
MainRoutes.put("/todo/complete/:id", mainController.complete)
MainRoutes.delete("/todo/:id", mainController.destroy)

// *********************************
// API Routes that Return JSON
// *********************************
APIRoutes.get("/", apiController.example) //"/api"
APIRoutes.get("/todos", apiController.getTodos)

// *********************************
// Server Listener
// *********************************
app.listen(PORT, () => console.log(`👂Listening on Port ${PORT}👂`))