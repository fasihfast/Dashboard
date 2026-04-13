import express from 'express';
import Victim from "../models/Victim.js"


const router = express.Router();

router.post("/", async (req,res) => {
    try{
        const victim = Victim(req.body);
        await victim.save();
        res.status(201).json({success: true , victim });

    }catch (err){

            console.error(err);
            res.status(500).json({success:false, message: "Error saving victim"})     
    }
})

router.get("/alldata", async (req,res) => {
    try{
        console.log("Request received")
        const victims = await Victim.find().sort({ date: -1, time: -1 });
        console.log("Victims data :",victims);
        res.json({victims});

    }catch(err){
        console.error(err);
        res.status(500).json({message: "Error fetching the victims"});
    }
})

export default router;