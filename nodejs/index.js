
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

  return calendar.events.insert(
    { calendarId: 'primary', resource: event },
    err => {
      // Check for errors and log them if they exist.
      if (err) return console.error('Error Creating Calender Event:', err)
      // Else log that the event was created.
      return console.log('Calendar event successfully created.')
    }
  )

}
module.exports = {
  createEvent
};
