  
  /* var mysql = require('mysql');

   var con = mysql.createConnection({
       host: "paedatabase.c6w0dfqhf1bm.eu-west-3.rds.amazonaws.com",
       user: "PAEmasteruser",
       password: "0123456789",
       database: "PAEdatabase"
   });
   
   con.connect(function(err) {
   if (err) throw err;
   con.query("SELECT * FROM directori", function (err, result, fields) {
       if (err) throw err;
       console.log(result);
       return result;
   });
   con.end();
   });

*/


const fs = require("fs");

const { obtenerHorariosConsulta } = require("./horarios_consulta");

let json = require("/Users/escrotoman99/Desktop/PAE/horarios_consulta/profesores_codigoActualizados.json"); 

for(let i = 0; i<json.length;i++){
json[i].horaris_consulta=obtenerHorariosConsulta(json[i]);
}

fs.writeFile("profesores.json", JSON.stringify(json), function(err, result){
    if(err) console.log('error', err);
});


