const { google } = require('googleapis')

const { OAuth2 } = google.auth

const oAuth2Client = new OAuth2('34796249029-1ql4i2ppti30oqcttfbik7ud8psvqvkp.apps.googleusercontent.com', 'E4au1mKUWy4JrJ-GYgSV3pVv')

oAuth2Client.setCredentials({ refresh_token: '1//04GIcCahRq70hCgYIARAAGAQSNwF-L9Ir-wDzyNbOqaamP-sSk0hm1mSr_q3mXhOwRauNDu0zF2iXAVLdEHz0V7ywJKHlg7Bcq8U' })

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
                        sendNotifications: true,
                    },
                    err => {
                        // Check for errors and log them if they exist.
                        if (err) return console.error('Error Creating Calender Event:', err)
                        // Else log that the event was created.
                        return console.log('Calendar event successfully created. ' + calendarId)
                    }
                )

            return console.log(`Sorry I'm busy...`)
        }
    )


}
module.exports = {
    createEvent
};
