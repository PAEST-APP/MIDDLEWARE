var express = require('express');
var bodyParser= require('body-parser');
var calen= require('./index');

var app = express();

app.use(bodyParser.json());

app.post('/', function(request,response){
  
var data = request.body;
var studentName= data.studentName;
var studentEmail= data.studentEmail;
var teacherName= data.teacherName;
var teacherEmail=data.teacherEmail;
var teacherSubject= data.teacherSubject;
var meetingStart= data["meeting"].start;
var meetingEnd= data["meeting"].end;

calen.createEvent(studentName, studentEmail, teacherName, teacherEmail, teacherSubject, meetingStart, meetingEnd);

response.send(201);
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})