const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { type } = require('os');

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

userSchema.pre('save', async function (next){   //pre is a middleware function that will execute when we try to perform save operation
    const user = this;
    //hash the password only if it has been modified(or is new)
    if(!user.isModified('password')) return next();
    try{
        //hash password generation
        const salt = await bcrypt.genSalt(10);
        //hash password
        const hashedPassword = await bcrypt.hash(user.password, salt);
        //override the plain password with the hashed one
        user.password = hashedPassword;
        next();
    }catch(err){
        return next(err);
    }
})

userSchema.methods.comparePassword = async function(userPassword){
    try{
        //use bcrypt to compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(userPassword, this.password);
        console.log(isMatch);
        return isMatch;
    }catch(err){
        throw err;
    }
}

const User = mongoose.model('User',userSchema);
module.exports = User;