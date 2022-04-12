class APIController {
    
    example(req, res){
        res.json({
            text: "This is an example API Route"
        })
    }

    getTodos(req, res){
        req.models.Todo.find({}, (err, todos) => {
            if (err){
                res.status(400).send(err)
            } else {
                res.json(todos)
            }
        })
    }


}

export default APIController