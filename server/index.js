import express from 'express'

const app=express()

const PORT=3000

app.get('/',(req,res)=>{
    res.send("We are live")
})

app.listen(PORT,()=>{
    console.log("server running on port",PORT)
})

