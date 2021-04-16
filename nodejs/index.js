
const { google } = require('googleapis')

const { OAuth2 } = google.auth

const oAuth2Client = new OAuth2('122622258650-p6df7on318mfc71ssh2ucvn3nql6qo9f.apps.googleusercontent.com','gROjLFjm3XcRgqBoAqJrxx2B')

oAuth2Client.setCredentials({ refresh_token: '1//04UTSfAQDOUXeCgYIARAAGAQSNwF-L9IrqEbIlargr1sExgHu0aSFhji_rYlGeaEM9F6atTOduql6XZggMOeCVwTLj0L-_ITTgfc'})

const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })


function createEvent(studentName, studentEmail, teacherName, teacherEmail, teacherSubject, meetingStart, meetingEnd) {

  // Create a dummy event for temp uses in our calendar
  const event = {
    summary: `Meeting with ` + teacherName + ` with student ` + studentName,
    //esto cambiara en funcion de la facultad del profe
    location: `Campus Nord `,
    description: `Meet with ` + teacherName + teacherSubject,
    colorId: 1,
    start: {
      dateTime: meetingStart,
      timeZone: 'Europe/Madrid',
    },
    end: {
      dateTime: meetingEnd,
      timeZone: 'Europe/Madrid',
    },
    'attendees': [
      { 'email': studentEmail },
      { 'email': teacherEmail },
    ],
  }

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
            if (err) return console.error('Free Busy Query Error: ', err)

            // Create an array of all events on our calendar during that time.
            const eventArr = res.data.calendars.primary.busy

            // Check if event array is empty which means we are not busy
            if (eventArr.length === 0)
                // If we are not busy create a new calendar event.
                return calendar.events.insert(
                    {
                        calendarId: 'primary',
                        resource: event,
                    },
                    err => {
                        // Check for errors and log them if they exist.
                        if (err) return console.error('Error Creating Calender Event:', err)
                        // Else log that the event was created.
                        return console.log('Calendar event successfully created. ' + calendarId)
                    }
                )

            return console.log(`Sorry I'm busy...`
            )
        }
    )

}
module.exports = {
  createEvent
};
