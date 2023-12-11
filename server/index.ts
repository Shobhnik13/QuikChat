var require:any

const express=require('express')
const app=express()
const http=require('http')
const server=http.createServer(app)

server.listen(3001,()=>{
    console.log('Listening at 3001');
    
})
