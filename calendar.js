const { google } = require('googleapis')

const { OAuth2 } = google.auth

const oAuth2Client = new OAuth2('122622258650-p6df7on318mfc71ssh2ucvn3nql6qo9f.apps.googleusercontent.com',
    'gROjLFjm3XcRgqBoAqJrxx2B')
//Client id??? Como conseguir el de los alumnos???

oAuth2Client.setCredentials({ refresh_token: '1//04Prwj8BxNAk7CgYIARAAGAQSNwF-L9IrnSjF5H5UGFxkqgrA6bnogP1w3OmrcnU5lANvmAjO0nYo1WRxSNG06t_aXmyK6UxTSeE' })
//Refresh token??? Como conseguir el de los alumnos???
const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })

var timeStart = "2021-04-08T21:09:00" //Pasar fechas 
var timeEnd = "2021-04-08T21:50:00"

const event = {
    summary: `Meeting with Saul`,
    location: 'Campus Nord, Carrer de Jordi Girona, 1, 3, 08034 Barcelona',
    description: `Meet with Saul to talk about the new client project and how to integrate the calendar for booking.`,
    colorId: 3,
    start: {
        dateTime: timeStart,
        timeZone: 'Europe/Madrid',
    },
    end: {
        dateTime: timeEnd,
        timeZone: 'Europe/Madrid',
    },
    'attendees': [
        { 'email': 'paestapp@gmail.com' },
        { 'email': 'hector.perez.diaz@estudiantat.upc.edu' },
        //Crear un correo de admin para enviar correos???
    ],
}

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
        return console.log('Calendar event successfully created.')
    }
)


