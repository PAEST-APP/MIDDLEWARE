const { google } = require('googleapis')

const { OAuth2 } = google.auth

const oAuth2Client = new OAuth2('4056149695-12t0f5aengg51d7f6kkia7uicm5taje0.apps.googleusercontent.com', '7ab07LHwUDLMEsk2-eGAK6rH')

oAuth2Client.setCredentials({ refresh_token: '1//04fNuh6IgajE1CgYIARAAGAQSNwF-L9Ir5LpDL0EEAj3iPlGLuXJAuo8WMvCGXWOXd0OM26b-sdDsba48eLbsCemQNY1FOinegZs' })

const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })


function createEvent(studentName, studentEmail, teacherName, teacherEmail, teacherSubject, meetingStart, meetingEnd) {

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

    return calendar.events.insert(
      { calendarId: 'primary', resource: event, sendNotifications: true },
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
