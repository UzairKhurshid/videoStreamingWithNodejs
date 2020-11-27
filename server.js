const express= require('express')
const bodyParser=require('body-parser')
const path=require('path')
const cors=require('cors')
const app=express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())


const publicDirectory = path.join(__dirname, '/public')
const viewsDirectory = path.join(__dirname, '/views')

app.set('views', viewsDirectory)
app.set('view engine', 'hbs')

const routes=require('./routes/index')

app.use(routes)

app.listen(3000,()=>{
    console.log('server is up and running on port 3000')
})