const asyncHandler = require("express-async-handler");
const {Types} = require("mongoose")
const User = require("../models/userModel")
const NotePad = require("../models/notesModel")


const createnoteshandlers = asyncHandler(async (req, res)=>{
    const {title, content} = req.body
    const requestUser = req.user;
    console.log(requestUser);
    const userId = new Types.ObjectId(requestUser.id)
    const currentUser = await User.findOne({_id:userId});
    console.info(currentUser)
    if(!currentUser){
        console.error("User is not valid ")
        res.status(401).json({status: "failed", message : "Only Valid User can create notes"})
        return;
    }

    const note = await NotePad.create({
        userId : currentUser._id,
        title : title,
        content : content
    })
    if(note){
        console.log("Notes saved to DB : ",note)
        res.status(200).json({status: "success", message : "Notes saved successfully"})
    }else{
        res.status(502).send();
    }


})

const getAllNotesHandlers = asyncHandler(async (req, res)=>{
    const requestUser = req.user;
    console.log(requestUser);
    const userId = new Types.ObjectId(requestUser.id)
    const currentUser = await User.findOne({_id:userId});
    console.info(currentUser)

    if(!currentUser || !userId){
        console.error("User not authorized to view notes ")
        res.status(401).json({status: "failed", message : "Only Valid User can view notes"});
        return;
    }

    const noteList = await NotePad.find({userId : userId});
    res.status(200).json(noteList)

})


const findNotesByIdHandlers = asyncHandler(async (req, res)=>{
    const requestUser = req.user;
    const requestId = req.params['id']
    if(!requestId || !requestUser.id){
        return res.status(404).send();
    }
    try{
        const userId = new Types.ObjectId(requestUser.id)
        const noteId = new Types.ObjectId(requestId)
        const note = await NotePad.findOne({userId: userId, _id : noteId})
        console.log(note)
        if(!note){
            console.error("Notes not available for view")
            res.status(204).json({})
            return;
        }
        return res.status(200).json(note);
    }catch (err){
        console.error(err)
        return res.status(404).send()
    }
    
    
})

const updateNotesByIdHandlers = asyncHandler(async(req, res)=>{
    const requestId = req.params['id']
    const updateObj = req.body
    
    const note = await NotePad.findById(requestId);
    console.log(note)
    if (!note) {
        console.error("Notes not available for update")
        res.status(204).json({})
        return;
    }

    if (note.userId.toString() !== req.user.id) {
        console.error("User don't have permission to update other user notes");
        res.status(403).send('Access Forbidden')
        return
    }

    const updatedNote = await NotePad.findByIdAndUpdate(
        requestId,
        updateObj,
        { new: true }
    );

    res.status(200).json(updatedNote);
})

const shareNotesHandlers = asyncHandler(async (req, res)=>{
    const shareUserId = req.params['id'];
    const {id : userId} = req.user;
    const {_id : noteId} = req.body
    const user = await User.findById(shareUserId)
    if(!user){
        console.error("Share User not exist")
        res.status(404).json()
        return;
    }
    const note = await NotePad.findById(noteId);
    if(!note){
        console.error("Notes not available for share")
        res.status(404).json()
        return;
    }

    const sharedWith = note.sharedWith
    console.log(sharedWith)
    if(userId == shareUserId){
        res.status(401).send("Note can not with itself")
        return
    }else if(sharedWith.includes(shareUserId)){
        res.status(409).send("Already shared")
        return;
    }else{
        sharedWith.push(shareUserId)
    }

    const sharedNote = await NotePad.findByIdAndUpdate(
        noteId,
        {sharedWith: sharedWith},
        { new: true }
    );
    
    res.status(200).json(sharedNote);
    return;

} )

const seachNotesHandlers = asyncHandler( async (req, res)=>{
    const {query} = req.query
    const {id: userId} = req.user
    if(!query || !userId){
        return res.status(404).send()
    }
    try{
        var userIdObject = new Types.ObjectId('65982e15589a6af3e8f38b33');
        const results = await NotePad.find({
                    $and: [
                            { $text: { $search: query } },
                            {
                                $or: [
                                    { userId: userIdObject },
                                    { sharedWith: userIdObject },
                                ],
                            },
                        ],
                    });
      
        res.status(200).json(results)
    } catch (error) {
        console.error('Error searching:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})
module.exports = {createnoteshandlers,
                  getAllNotesHandlers,
                  findNotesByIdHandlers,
                  updateNotesByIdHandlers,
                  shareNotesHandlers,
                  seachNotesHandlers}