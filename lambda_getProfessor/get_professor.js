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
  try {    

 const temp1 = await new Promise((resolve, reject) => {
   connection.query("SELECT despatx, email, nom_prof FROM directori WHERE id_gauss =" + event.idgauss, function (err, result) {  
         if (err) {console.log("Error->" + err);     
        reject(err);}         
    resolve(result);});
  });
  
  const temp2 = await new Promise((resolve, reject) => {
      connection.query("SELECT horaris_consulta FROM horaris WHERE id_gauss =" + event.idgauss, function (err, result){
        if(err){console.log("Error->" + err);
            reject(err);}
    resolve(result)
    });
  });
  
  const temp3 = await new Promise((resolve, reject) => {
      connection.query("SELECT consultes FROM directori WHERE id_gauss =" + event.idgauss, function (err, result){
        if(err){console.log("Error->" + err);
            reject(err);}
    resolve(result)
    });
  });
var data1 = temp1[0];

var data2 = JSON.parse(temp2[0].horaris_consulta);
var fechaHoy = new Date();
var horasArray = [];
for (var i = 0; i < data2.length; i++){
    if(new Date(data2[i]) > fechaHoy){
        horasArray.push(data2[i]);
    }
}

var data3 = JSON.parse(temp3[0].consultes);

var data = [data1, horasArray, data3];

return data

  } catch (err) {    

 return {   

    statusCode: 400,   

    body: err.message 

    } 

  }

 };
