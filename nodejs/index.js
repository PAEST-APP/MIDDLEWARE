
const { response } = require('express')
const { google } = require('googleapis')

const { OAuth2 } = google.auth

const oAuth2Client = new OAuth2('34796249029-1ql4i2ppti30oqcttfbik7ud8psvqvkp.apps.googleusercontent.com', 'E4au1mKUWy4JrJ-GYgSV3pVv')

oAuth2Client.setCredentials({ refresh_token: '1//04_a0ZFEP4ORHCgYIARAAGAQSNwF-L9IrOUR4Q5sANoP-LrJa-aWg8J7FX693GbqW4hGTVXE_mnd-kFLnJ64ipaIGp7O-JcMw1MU'})

const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })


function createEvent(request,response) {
//variables del JSON
  var data = request.body;
  var studentName= data.studentName;
  var studentEmail= data.studentEmail;
  var teacherName= data.teacherName;
  var teacherEmail=data.teacherEmail;
  var teacherSubject= data.teacherSubject;
  var meetingStart= data["meeting"].start;
  var meetingEnd= data["meeting"].end;


    var dateStart = new Date(meetingStart);
    var dateEnd = new Date(meetingEnd);

    // Create a dummy event for temp uses in our calendar
    const event = {
        summary: `Meeting with ` + teacherName + ` with student ` + studentName,
        //esto cambiara en funcion de la facultad del profe
        location: `Campus Nord `,
        description: `Meet with ` + teacherName + teacherSubject,
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
            { 'email': studentEmail },
            { 'email': teacherEmail },
        ],
    }

    /*return calendar.events.insert(
      { calendarId: 'primary', resource: event, sendNotifications: true },
      err => {
        // Check for errors and log them if they exist.
        if (err) return console.error('Error Creating Calender Event:', err)
        // Else log that the event was created.
        return console.log('Calendar event successfully created.')
      }
    )*/
    // Check if we a busy and have an event on our calendar for the same time.
    calendar.freebusy.query(
        {
            resource: {
                timeMin: dateStart,
                timeMax: dateEnd,
                timeZone: 'Europe/Madrid',
                items: [{ id: 'primary' }],
            },
        },
        (err, res) => {
            // Check for errors in our query and log them if they exist.
            if (err) response.writeHead(404, {'Content-Type': 'text/html'});
            // Create an array of all events on our calendar during that time.
            const eventArr = res.data.calendars.primary.busy

            // Check if event array is empty which means we are not busy
            if (eventArr.length === 0)
                // If we are not busy create a new calendar event.
                return calendar.events.insert(
                    {
                        calendarId: 'primary',
                        resource: event,
                        sendNotifications: true,
                    },
                    err => {
                        // Check for errors and log them if they exist.
                        if (err) response.writeHead(400, {'Content-Type': 'text/html'});
                        // Else log that the event was created.
                        response.writeHead(201, {'Content-Type': 'text/html'});
                    }
                )

                response.writeHead(480, {'Content-Type': 'text/html'});
        }
    )


}
module.exports = {
    createEvent
};