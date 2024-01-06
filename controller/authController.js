const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

//@desc Register a user
const registerUser = asyncHandler(async (req, res)=>{
    const { username, email, password } = req.body;
    console.log(username, email, password)

    // Simple validation, you may want to add more checks
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please provide username, email, and password' });
    }
    try {
        //const userAvailable = await User.findOne({$or: [{email: email},{username : username}]} )
        const userAvailable = await User.findOne({username})
        if(userAvailable){
            console.log(userAvailable)
            return res.status(400).json({status: 'Fail', message : 'Username or mail id already exist'});
        }else{
            let passwordStore = password;
            if(process.env.ENCRYPT_PASSWORD == "Y"){
                // Generate a salt
            const salt = bcrypt.genSaltSync(10);

            // Hash the password with the generated salt
            passwordStore = await bcrypt.hash(password, salt);
            }
            console.log(passwordStore)
            const user = await User.create({
                username, 
                email,
                password:passwordStore
            })
            if(user){
                console.log(`User created with _id :${user._id}, username:${user.username}, email: ${user.email} `);
                res.status(200).json({status: "Success", message : 'user created successfully', data: {id : user._id, username : user.username, email : user.email}})
            }else{
                res.status(400).json({status : "failed"})
            }
        }
    } catch (error) {
        console.error(error)
        res.status(400).json({status : "failed"})
    }
    
})

const authenticateUser = asyncHandler(async (req, res)=>{
    const {username, password} = req.body;
    console.log(username, password)
    let isValidUser = false
    //simple validation
    if(!username || !password){
        return res.status(400).json({message: 'Please provide username and password'})
    }

    const user = await User.findOne({username});
    if(user && process.env.ENCRYPT_PASSWORD == "Y" && bcrypt.compareSync(password, user.password)){
        isValidUser = true
    }else if(user && password == user.password){
        isValidUser = true
    }

    if(isValidUser){
        const accessToken = jwt.sign(
            {
              user: {
                username: user.username,
                email: user.email,
                id: user.id,
              },
            },
            process.env.ACCESS_TOKEN_SECERT,
            { expiresIn: process.env.USER_SESSION_TIMEOUT }
        );
          // Set the token in the response headers
        res.header('Authorization', `Bearer ${accessToken}`);
        res.status(200).json({status : 'user authentication successful'})
    }else{
        res.status(400).json({status : 'invalid user credentials'})
    }
})

const currentUser = asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
})


module.exports = {registerUser, authenticateUser, currentUser}
