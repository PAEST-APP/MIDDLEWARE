//Index
const { google } = require('googleapis')

const { OAuth2 } = google.auth

const oAuth2Client = new OAuth2('4056149695-12t0f5aengg51d7f6kkia7uicm5taje0.apps.googleusercontent.com', '7ab07LHwUDLMEsk2-eGAK6rH')

oAuth2Client.setCredentials({ refresh_token: '1//04fNuh6IgajE1CgYIARAAGAQSNwF-L9Ir5LpDL0EEAj3iPlGLuXJAuo8WMvCGXWOXd0OM26b-sdDsba48eLbsCemQNY1FOinegZs' })

const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })

const mysql = require('mysql'); 

const connection = mysql.createConnection({ 

//following param coming from aws lambda env variable 

  host: "paedatabase.c6w0dfqhf1bm.eu-west-3.rds.amazonaws.com",  

  user: "PAEmasteruser", 

  password: "0123456789", 

  port: 3306,

  database: "PAEdatabase", 

  // calling direct inside code  

  connectionLimit: 10,   

  multipleStatements: true,

  // Prevent nested sql statements 

  connectionLimit: 1000,   

  connectTimeout: 60 * 60 * 1000, 

  acquireTimeout: 60 * 60 * 1000, 

  timeout: 60 * 60 * 1000, 

  debug: true 

});

exports.handler = async (event) => {
    try{
      var dateStart = new Date((typeof event.meetingStart === "string" ? new Date(event.meetingStart) : event.meetingStart).toLocaleString("en-US", {timeZone: 'Europe/Madrid'})); 
      var dateEnd = new Date((typeof event.meetingEnd === "string" ? new Date(event.meetingEnd) : event.meetingEnd).toLocaleString("en-US", {timeZone: 'Europe/Madrid'}));
      meetStart = JSON.stringify(dateStart);
      meetEnd = JSON.stringify(dateEnd);
      // Create a dummy event for temp uses in our calendar
      const evento = {
          summary: `Meeting with ` + event.teacherName + ` and ` + event.studentName,
          //esto cambiara en funcion de la facultad del profe
          location: `Campus Nord `,
          description: `Meet with ` + event.teacherName + " of" +event.teacherSubject,
          colorId: 1,
          start: {
              dateTime: event.meetingStart,
              timeZone: 'Europe/Madrid',
          },
          end: {
              dateTime: event.meetingEnd,
              timeZone: 'Europe/Madrid',
          },
          'attendees': [
              { 'email': event.studentEmail },
              { 'email': event.teacherEmail },
          ],
      }
      const temp2 = await new Promise((resolve, reject) => {
        connection.query("SELECT horaris_consulta FROM horaris WHERE id_gauss =" + event.idgauss, function (err, result){
          if(err){console.log("Error->" + err);
              reject(err);}
          resolve(result)
          });
      });          
      var hactu = JSON.parse(temp2[0].horaris_consulta);
      var m = -1;
      var fecha = meetStart.split("."); 
      for (var i = 0; i < hactu.length; i++){
          if (hactu[i].includes(fecha[0].slice(1, fecha[0].length))){
              m = i;
              i = hactu.length;
          }
      }
      if (m != -1){
        const update = await new Promise((resolve, reject) => {
            connection.query("UPDATE horaris SET horaris_consulta = JSON_REMOVE(horaris_consulta, '$["+m+"]') WHERE id_gauss =" + event.idgauss, function (err, result){
              if(err){console.log("Error->" + err);
                  reject(err);}
            resolve(result)
          });
        });
        var response = calendar.events.insert({calendarId: 'primary', resource: evento, sendNotifications: true});
        return response
      }else{
        return 'Evento no creado'
      }
  }catch(err){    
   return {   

      statusCode: 400,   

      body: err.message 

    }
  }
};
