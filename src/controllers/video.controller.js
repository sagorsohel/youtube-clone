import asyncHandler from "../utils/asyncHandler";


export const uploadVideo=asyncHandler(async(req,res)=>{
    //  
    const {title,description}=req.body;
    const videoFile=req.files.video[0].videoFile;
    const thumbFile=req.files.thumb[0].thumbFile;

    console.log('videoFile',videoFile);
    console.log('thumbFile',thumbFile);



})