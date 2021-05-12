
function obtenerHorariosConsulta(infoProfe) {

    let date, weekDay;
    let diaConsultas = [];

    for (let i = 0; i < infoProfe.consultes.length; i++) {
        var dia = infoProfe.consultes[i].split(" ");
        diaConsultas.push(codigoDia(dia[0]));

        var horasConsulta = dia[1].split('-');
        diaConsultas.push(parseInt(horasConsulta[0].split(':')));
        diaConsultas.push(parseInt(horasConsulta[1].split(':')));
    }


    let horaris2 = [];

    for (let k = 0; k < diaConsultas.length / 3; k++) {

        weekDay = diaConsultas[k * 3]; //dia de la semana
        date = new Date();
        let dateEnd = new Date();

        let currentDay = date.getDay(); // horari d'inici de la consulta
        let distance = weekDay - currentDay;
        date.setDate(date.getDate() + distance);
        date.setHours(diaConsultas[k * 3 + 1] + 2, 0, 0);
        //console.log(date);

        dateEnd.setDate(dateEnd.getDate() + distance); // horari de fi de la consulta
        dateEnd.setHours(diaConsultas[k * 3 + 2] + 2, 0, 0);
        //console.log(dateEnd);

        let i = false;
        let horaris = [];
        let meetingLength = 30;

        horaris.push(date);

        while (!i) { // guarda tots els slots de 30min entre la hora d'inici i fi de consulta del professorat
            let horari = new Date(horaris[horaris.length - 1].getTime() + meetingLength * 60000);
            if (horari.getTime() < dateEnd.getTime()) {
                horaris.push(horari);
            } else {
                i = true;
            }
        }

        for (let j = 0; j < 5; j++) {
            for (let i = 0; i < horaris.length; i++) {

                let date2 = new Date();
                date2.setDate(horaris[i].getDate() + j * 7);
                date2.setHours(horaris[i].getHours(), horaris[i].getMinutes(), 0);

                horaris2.push(date2);
            }
        }

    }

    return horaris2.sort((a, b) => (a.getTime() - b.getTime()));
} module.exports = {
    obtenerHorariosConsulta
};

function codigoDia(dia) {
    dias = ['Diumenge', 'Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres', 'Dissabte'];
    return dias.indexOf(dia);
}