const UserSchema = require('../models/note.model.js');
const {body, validationResult} =  require('express-validator');
const { findOneAndUpdate } = require('../models/note.model.js');
let fetch = require('node-fetch');



// POST request
// Registering new users
// Request body = { uername : "username", password : "password" }
exports.create = (req, res) => {
    
    // Validate request
    const errors = validationResult(req);
    
    if (errors.length > 0) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Create a UserSchema
    const note = new UserSchema({
        username: req.body.username, 
        password: req.body.password
    });

    // Save user in the database
    note.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: "Username already exists"
        });
    });
};

// POST request 
// User login and session control
exports.login = (req, res) => {
    
    //Validating request body
    const errors = validationResult(req);
    
    if (errors.length > 0) {
      return res.status(400).json({ errors: errors.array() });
    }

    //creating user object to find the user with username
    var users = {"username": req.body.username}
    
    //finding user using username
    UserSchema.findOne(users,function(err,user){
        
        //If user does not exist
        if(!user) return res.status(404).send("User not found")
        
        //Checking if password is correct using middleware function/method
        user.comparePassword(req.body.password, function(err, isMatch) {
            
            if (err) throw err;
            if(req.session.user) req.session.reset()
            if(isMatch) { 
                req.session.user = user
                res.send("Login successfull") 
            }
            else res.send("The credentials are incorrect");
        });
    })
    
};

//GET request
//logout route
exports.logout = (req,res) => {
    req.session.reset()
    res.send("Logged out")
}

//GET request
//show wallet
exports.wallet = (req,res) => {

    var amount = { "Amount": req.session.user.wallet}
    res.send(amount)

}

//POST request
//Add to value to ypur wallet
//Request body = { amount : (The aount that you want to add to wallet)}
//There are no validations so you can actually add negative values
exports.addvalue = async (req,res) =>{
    
    const filter = {"username": req.session.user.username}
    const update = {"wallet" : req.session.user.wallet + +req.body.amount}
    
    user = await UserSchema.findOneAndUpdate(filter,update, { new:true})

    await user.save()
    
    req.session.user = user

     res.send({"amount": req.session.user.wallet})
}

// POST request
// Buy stocks
// Request Body -> { Symbol : "(Should be a correct symbol or the price API wont work)", quantity : "(The number of stocks that you want to buy)"}
exports.buy = async (req,res) => {

    const filter = {"username": req.session.user.username}
    const quatity = req.body.quantity
    var price
    var symbol = req.body.symbol
    var userstock = req.session.user.Stocks
    
    try {
        //API to find the price of stock 
        await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=c1jvton48v6qlriv0skg`).then(response => response.json() ).then(data => price = data.c)
        .catch(e => {throw e})
        
            // balance check
            if(req.session.user.wallet - (quatity*price) > 0) {

                // find stock in array
                if( JSON.stringify(userstock).includes(symbol) ) { 
                    
                    var old = userstock.find(({stock}) => stock === symbol )
                    old.data.quantity += quatity
                    old.data.price = price
                 
                   
                }//if stock not already in array add it
                else{     
                var stock =  { "stock" : symbol, "data" : {"quantity" : quatity, "price" : price} } 
                userstock.push(stock)
                }

            }else{
                return res.send("Not enough balance in wallet")
            }
        
        const  update = {Stocks: userstock , wallet : req.session.user.wallet - (quatity*price)}
            
        user =  await UserSchema.findOneAndUpdate(filter,update,{ new:true})

        await user.save()

        req.session.user = user

        res.send(req.session.user.Stocks)

        
    } catch {
                res.status(500).send("Your request can not be processed currently")        
            }                
}


// GET request
// View user data
exports.profile = (req, res) => {
    data = { 'username' : req.session.user.username , 'wallet' : req.session.user.wallet , "stocks" :  req.session.user.Stocks}
    res.send(data)
}