const http = require('http');
const express = require('express');


const app = express();


app.get("/",function(req,res){
    res.send('welllllll')
});







app.listen(8000, function(){
    console.log('listening on 8000')
});