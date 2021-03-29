const {google}= require ('googleapis')

const {OAuth2}=google.auth 

const oAuth2Client = new OAuth2('650511232107-75isiaookl16vsugjhb1iqhlvlehm7a8.apps.googleusercontent.com','BbRLVEDocw472CxDwYnhV6J_')

oAuth2Client.setCredentials({ refresh_token: '1//04R17bO8JOkl9CgYIARAAGAQSNwF-L9IrmOwAGN2mXEad8pGG38bkEOI6pKYlzZpukE4QKImvKfgTmjrvHZTJJXVsYtG8AjmPzHw'})

const calendar = google.calendar ({ version: 'v3', auth: oAuth2Client })



// Create a new event start date instance for temp uses in our calendar.
const eventStartTime = new Date()

//console.log(eventStartTime.getDate())

eventStartTime.setDate(eventStartTime.getDate() + 2)

// Create a new event end date instance for temp uses in our calendar.
const eventEndTime = new Date()
eventEndTime.setDate(eventEndTime.getDate() + 3)
eventEndTime.setMinutes(eventEndTime.getMinutes() + 45)

// Create a dummy event for temp uses in our calendar
const event = {
  summary: `Meeting with Saul`,
  location: `3595 California St, San Francisco, CA 94118`,
  description: `Meet with Saul to talk about the new client project and how to integrate the calendar for booking.`,
  colorId: 1,
  start: {
    dateTime: eventStartTime,
    timeZone: 'America/Denver',
  },
  end: {
    dateTime: eventEndTime,
    timeZone: 'America/Denver',
  },
  'attendees':[
      {'email':'youssef.elhg@gmail.com'},
      {'email':'paest.app@gmail.com'},
  ],
}


// Check if we a busy and have an event on our calendar for the same time.
calendar.freebusy.query(
  {
    resource: {
      timeMin: eventStartTime,
      timeMax: eventEndTime,
      timeZone: 'America/Denver',
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
        { calendarId: 'primary', resource: event },
        err => {
          // Check for errors and log them if they exist.
          if (err) return console.error('Error Creating Calender Event:', err)
          // Else log that the event was created.
          return console.log('Calendar event successfully created.')
        }
      )

    // If event array is not empty log that we are busy.
    return console.log(`Sorry I'm busy...`)
    //solucionar error de no poder añadir mas de un evento aunq los dias sean diferentes
    //ver como se añaden participantes al evento
    //controlar franjas horarias 
  }
)