const puppeteer = require('puppeteer');
const jsdom = require('jsdom');

//var id = 1003202 //Josep
//var id = 1002571 //Xavi
var id = 1002262 //Ramon

scrapping();
async function scrapping(){
  try {
    // Abrimos una instancia del puppeteer y accedemos a la url de google
    const browser = await puppeteer.launch() ;
    const page = await browser.newPage();
    const response = await page.goto('https://directori.upc.edu/directori/dadesPersona.jsp?id=' + id);
    const body = await response.text();

    // Creamos una instancia del resultado devuelto por puppeter para parsearlo con jsdom
    const { window: { document } } = new jsdom.JSDOM(body);

    //Creamos la variable donde guardaremos la info
    var data = [];

    // Seleccionamos los titulos y lo mostramos en consola
    document.querySelectorAll('td')
      .forEach(element => data.push(element.textContent));

    //Empezamos a editar la String
    var dataStr = data.toString();
    dataStr = dataStr.trim();
    //Nos quedamos con el nombre
    var n = dataStr.search(",");
    var name  = dataStr.slice(0, n);
    //Nos quedamos con el mail
    n = dataStr.search(" ,") + 2;
    var m = dataStr.search("EDU") + 3;
    var mail = dataStr.slice(n,m);
    mail = mail.trim();
    n = mail.search("UPC");
    mail = mail.slice(0, n) + "@" + mail.slice(n, mail.length);
    n = dataStr.search("Adreça ,") + 8;
    m = dataStr.search(",T");
    //Cogemos la dirección
    var addr = dataStr.slice(n,m);
    addr = addr.trim();
    m = addr.search('\n');
    //Cogemos el departamento
    var dept = addr.slice(0,m);
    addr = addr.slice(m +  1, addr.length);
    n = addr.search('\n') + 7;
    addr = addr.slice(n, addr.length);
    addr.trim();
    var edi = addr.slice(0, addr.search('\n'));
    addr = addr.slice(addr.search('\n') + 1, addr.length);
    addr.trim();
    //Cogemos el despacho
    var despatx = edi + '\n' + addr.slice(6, addr.search('\n'));
    //Cogemos la dirección
    addr = addr.slice(addr.search('\n') + 1, addr.length);
    addr = addr.trim();
    addr1 = addr.slice(0, addr.search('\n') + 1);
    addr = addr.trim();
    addr = addr.slice(addr.search('\n')  + 1, addr.length);
    addr = addr.trim();
    addr2 = addr.slice(0, addr.search('\n') + 1);
    addr = addr.slice(addr.search('\n') + 1, addr.length);
    addr = addr.trim();
    addr = addr1 + addr2 + addr;
    

    var fs = require('fs');
    //Devolviendo solo lo del profesor creo que seria correcto.
    var directori = [];
    var profesor = {
        "id" : id,
        "nom"    : name,
        "img"   : "src-img",
        "mail"  : mail,
        "departamento" : dept,
        "despatx" : despatx,
        "direcció" : addr,
        "consultes" : [
                        "Dilluns 00:00-00:00",
                        "Dimecres 00:00-00:00"
                    ]
    };

    //No creo que sea necesario crear un JSON
    let rawdata = fs.readFileSync('directori.json');
    let current_data = JSON.parse(rawdata);
    directori.push(current_data);
    console.log(typeof current_data);

    if(JSON.stringify(current_data).includes(name)){
        console.log("Nombre en archivo");
    }else{
        directori.push(profesor);
    }   

    //Exportamos a JSON
    directori = JSON.stringify(directori);
    console.log(directori);
    fs.writeFile("directori.json", directori, function(err, result){
        if(err) console.log('error', err);
    });

    // Cerramos el puppeteer
    await browser.close();
  } catch (error) {
    console.error(error);
  }
}
