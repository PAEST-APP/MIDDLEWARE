const http = require ('http');

const options ={
    host: 'localhost',
    path: '/',
    port:3000,
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=UTF-8'
    }
};

const request = http.request(options, (res) => {
    if (res.statusCode !== 201) {
      console.error(`Did not get a Created from the server. Code: ${res.statusCode}`);
      res.resume();
      return;
    }
  
    let data = '';
  
    res.on('data', (chunk) => {
      data += chunk;
    });
  
    res.on('close', () => {
      console.log('Event created');
      //console.log(JSON.parse(data));
    });
  });

  const requestData = {
    studentName: 'Youssef El Houas',
    studentEmail: 'youssef.elhg@gmail.com',
    teacherName: 'Saul Garcia Huertes',
    teacherEmail: 'paest.app@gmail.com',

    meeting: {
      start: '2021-02-04T20:30:00',
      end: '2021-02-04T20:50:00',
    }

  };

  request.write(JSON.stringify(requestData));
  request.end();

request.on('error', (err) => {
  console.error(`Encountered an error trying to make a request: ${err.message}`);
});