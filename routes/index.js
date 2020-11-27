const express=require('express')
const multer=require('multer')
const path=require('path')
const fs=require('fs')
var stream = require('stream');
const router=express.Router()

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'../public/files'))
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()+'.jpg' )
    }
  })
   
var upload = multer({ storage: storage })




router.post('/addFile', upload.single('avatar'),async(req,res)=>{
    try {
        if(!req.file){
            return res.status(500).json({
                msg:'error'
            })
        }
        console.log(req.file)
        return res.status(200).json({
            msg:'success'
        })
    } catch (e) {
        console.log(e.message)
        res.status(500).send(e.message)
    }
})



router.get('/getFiles',async(req,res)=>{
    try {
        let directoryPath=path.join(__dirname , '../public/files/')
        fs.readdir(directoryPath, function (err, files) {
            //handling error
            if (err) {
                console.log('Unable to scan directory: ' + err);
                return res.status(500).render('index',{
                    error:'cannot scan directory'
                })
            } 
            //listing all files using forEach
            files.forEach(function (file) {
                // Do whatever you want to do with the file
                console.log(file)
                let dirname=path.join(__dirname , '../public/files/')
                let f=dirname  + file 
                return res.render('index',{
                    title:"Dashboard",
                    file:f
                }) 
            });
        });
    } catch (e) {
        console.log(e.message)
        res.status(500).send(e.message)
    }
})



router.get('/download/:id',(req,res)=>{
    const file=req.query.file
    try {
        var f = fs.readFileSync(file);
        console.log(file)
        res.download(file)
    } catch (e) {
        console.log(e.message)
        res.status(500).send(e.message)
    }
})

router.get('/getVideoPage',async(req,res)=>{
    res.render('v',{
        title:'Video Page'
    })
})

router.get('/video',async(req,res)=>{

    let pathDir=path.join(__dirname , '../public/files/videoplayback.mp4')
    
    fs.stat(pathDir, (err, stat) => {

        // Handle file not found
        if (err !== null && err.code === 'ENOENT') {
            res.sendStatus(404);
        }

        const fileSize = stat.size
        const range = req.headers.range

        if (range) {

            const parts = range.replace(/bytes=/, "").split("-");

            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1;
            
            const chunksize = (end-start)+1;
            const file = fs.createReadStream(pathDir, {start, end});
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
            }
            
            res.writeHead(206, head);
            file.pipe(res);
        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
            }

            res.writeHead(200, head);
            fs.createReadStream(pathDir).pipe(res);
        }
    });
})

module.exports=router