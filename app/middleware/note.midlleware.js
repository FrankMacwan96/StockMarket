//Request body validation middleware for login route
exports.validate = (method) => {
    switch(method){
        case 'login' : {
            return [
                body('username').exists().notEmpty(),
                body('password').exists().notEmpty()
            ]
        }
        case 'register' : {
            return [
                body('username').exists().notEmpty(),
                body('password').exists().notEmpty()
            ]
        }
    }
}

//Authetication middleware
exports.autheticate = (req, res, next) =>{
    
            if (req.session.user) {     
                return next();
                
            } else {
                
                
                return res.status(400).send("Not authorized, Please login")
            }
        
    }
