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
      var q = event.meetingStart.search("T");
      var hora = event.meetingStart.slice(q + 1,q + 3);
      var hora_nueva = parseInt(hora, 10) + 2;
      var fechaStart = event.meetingStart.slice(0,q) + "T" + hora_nueva + event.meetingStart.slice(q+3, event.meetingStart.length - 1);
      var dateStart = new Date(event.meetingStart);
      var dateEnd = new Date(event.meetingEnd);
      /*dateStart.setHours(dateStart.getHours() + 2);
      dateEnd.setHours(dateEnd.getHours() + 2);
      //meetStart = JSON.stringify(dateStart);
      //meetEnd = JSON.stringify(dateEnd);
      dateStart.setHours(dateStart.getHours() - 2);
      dateEnd.setHours(dateEnd.getHours() - 2);*/
      // Create a dummy event for temp uses in our calendar
      const evento = {

          summary: `Meeting with ` + event.teacherName + ` and ` + event.studentName,
          //esto cambiara en funcion de la facultad del profe
          location: `Campus Nord `,
          description: `Meet with ` + event.teacherName + " of" +event.teacherSubject,
          colorId: 1,
          start: {
              dateTime: dateStart,
              timeZone: 'Europe/Madrid',
          },
          end: {
              dateTime: dateEnd,
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
      var fecha = fechaStart.split("."); //"/"2021-06-02T10:00:00"
      for (var i = 0; i < hactu.length; i++){
          if (hactu[i].includes(fecha[0])){
              m = i;
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
        connection.end();
        return response
      }else{
        connection.end();
        return 'Evento no creado'
      }
  }catch(err){    
   return {   

      statusCode: 400,   

      body: err.message 

    }
  }
};
