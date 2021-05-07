function get_professor(id){    
    var mysql = require('mysql');

    var con = mysql.createConnection({
    host: "paedatabase.c6w0dfqhf1bm.eu-west-3.rds.amazonaws.com",
    user: "PAEmasteruser",
    password: "0123456789",
    database: "PAEdatabase"
    });

    con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT * FROM directori WHERE codi_persona = " + id, function (err, result, fields) {
        if (err) throw err;
        console.log(result);
    });
    con.end();
    });
}