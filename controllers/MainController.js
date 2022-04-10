class MainController {
    
    example(req, res){
        res.render("example.ejs", {
            text: "This is an example API Route"
        })
    }

    index(req, res){
        const Todo = req.models.Todo
        Todo.find({}, (err, todos) => {
            if (err){
                res.status(400).send(err)
            } else {
                res.render("index.ejs", {todos})
            }
        })
    }

    new(req, res){
        res.render("new.ejs")
    }

    create(req, res){
        const Todo = req.models.Todo
        req.body.completed = false
        Todo.create(req.body, (err, todo) => {
            if (err){
                res.status(400).send(err)
            } else {
                res.redirect("/")
            }
        })
    }

    show(req, res){
        const id = req.params.id
        const Todo = req.models.Todo
        Todo.findById(id, (err, todo) => {
            if (err){
                res.status(400).send(err)
            } else {
                res.render("show.ejs", {todo})
            }
        })
    }

    complete(req, res){
        const id = req.params.id
        const Todo = req.models.Todo
        Todo.findByIdAndUpdate(id, {completed: true}, {new: true}, (err, todo) => {
            if (err){
                res.status(400).send(err)
            } else {
                res.redirect("/")
            }
        })
    }

    destroy(req, res){
        const id = req.params.id
        const Todo = req.models.Todo
        Todo.findByIdAndDelete(id, (err, todo) => {
            if (err){
                res.status(400).send(err)
            } else {
                res.redirect("/")
            }
        })
    }


}

export default MainController