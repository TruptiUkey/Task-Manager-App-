const express = require('express');
const router = express.Router();

const Task = require('../models/task');
const {jwtAuthMiddleware} = require('../jwt');
const User = require('../models/user');

router.post('/',jwtAuthMiddleware,async (req,res)=>{
    try{
        const data = req.body;
        const newTask = new Task(data);
        const response = await newTask.save();
        console.log('Task Saved Successfully!');

        res.status(200).json({response});
        if(!response){
            console.log('Empty data cannot be saved!');
            res.status(500).json({error:'Empty data cannot be saved'});
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:'Internal Server Error'});
    }
})
router.get('/',async (req,res)=>{
    try{
        const response = await Task.find();
        console.log('Task find Successfully!');
        res.status(200).json(response);
        if(!response){
            console.log('Task not found!');
            res.status(404).json({error:'Task not found'});
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:'Internal Server Error'});
    }
})

router.get('/:taskId',jwtAuthMiddleware,async (req,res)=>{     //jwtmddleware means require token to access this endpoint
    try{
            const taskId = req.params.taskId;
            const response = await Task.findById(taskId);
            console.log('Task find Successfully!');
    
            res.status(200).json(response);
    
            if(!response){
                console.log('Task not found!');
                res.status(404).json({error:'Task not found'});
            }
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:'Internal Server Error'});
    }
})
router.post('/:taskStatus',async (req,res)=>{
    try{
        const taskStatus = (req.params.taskStatus);
        if(taskStatus =='Not Started' || taskStatus == 'In Progress' || taskStatus=='Completed'){
            const response = await Task.find({status:taskStatus});
            console.log('Data find Successfully!');
            res.status(200).json(response);
        }else{
            res.status(404).json({error:'invalid taskStatus'});
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:'Internal Server Error'});
    }
})


router.put('/:taskId',jwtAuthMiddleware,async (req,res)=>{     //jwtmddleware means require token to access this endpoint
    try{
        const taskId = req.params.taskId;
        const updatedTaskData = req.body;

        const response = await Task.findByIdAndUpdate(taskId,updatedTaskData,{
            new: true,  //return updated documents
            runValidators: true    //run mongoose validators 
        });

        if(!response){
            res.status(404).json({error:'Task not found'});
        }

        console.log('Task updated');
        res.status(200).json(response);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:'Internal Server Error'});
    }
})


router.delete('/:taskId',jwtAuthMiddleware,async (req,res)=>{     //jwtmddleware means require token to access this endpoint
    try{
        const taskId = req.params.taskId;
        const response = await Task.findByIdAndDelete(taskId);

        if(!response){
            res.status(404).json({error:'Task not found'});
        }
        console.log('Task deleted');
        res.status(200).json({message:'Task deleted successfully'});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:'Internal Server Error'});
    }
})


module.exports = router;