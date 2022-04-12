import bcrypt from "bcryptjs"

class UnauthController {
    
    main(req, res){
        res.render("main.ejs")
    }

    signup(req, res){
        const User = req.models.User
        const {username} = req.body
        const password = bcrypt.hashSync(req.body.password, 10)
        User.create({username, password}, (err, user) => {
            if (err){
                res.status(400).send(err)
            } else {
                res.redirect("/")
            } 
        })
    }

    login(req, res){
        const User = req.models.User
        const {username, password} = req.body
        User.findOne({username}, (err, user) => {
            if (err){
                res.status(400).send(err)
            } else {
                console.log(user, password)
                if (user){
                    const pwcheck = bcrypt.compareSync(password, user.password)
                    if(pwcheck){
                        req.session.username = username
                        req.session.loggedIn = true
                        res.redirect("/todo")
                    } else {
                        res.status(400).send({error: "wrong password"})
                    }
                } else {
                    res.status(400).send({error: "User doesn't exist"})
                }
            } 
        })
    }

    logout(req, res){
        req.session.destroy((err) => {
            res.redirect("/")
        })
    }


}

export default UnauthController