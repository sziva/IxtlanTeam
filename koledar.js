const datum = new Date();
const meseci = ["Januar", "Februar","Marec","April","Maj","Junij","Julij","Avgust","September","Oktober","November","December"];

function preberiDatoteko(callback){
    fetch('prazniki.txt')
    .then(response => response.text())
    .then(data => {        
        const arrayFile = data.split("\n");
        const prazniki = Object.values(arrayFile);
        console.log(prazniki);
        callback(prazniki);
    });
}


const ustvariKoledar = () =>{
    preberiDatoteko(prazniki =>{

        datum.setDate(1);
        const mesec = datum.getMonth();
        
        //zarotiramo indexe, da je nedelja zadnji in ne prvi dan v prikazu koledarja
        let prviDan = 0;
        if(datum.getDay() === 0){
            prviDan = 6;
        }
        else{
            prviDan = datum.getDay()-1;
        }

        const zadnjiDan = new Date(datum.getFullYear(), datum.getMonth()+1, 0).getDate();
        const zadnjiDanPrejsnegaMeseca = new Date(datum.getFullYear(), datum.getMonth(), 0).getDate();
        const zadnjiDanMeseca = new Date(datum.getFullYear(), datum.getMonth()+1, 0).getDay();

        let stNaslednjihDni = 7 - zadnjiDanMeseca;
        if(stNaslednjihDni === 7){
            stNaslednjihDni = 0;
        }

        document.querySelector(".datum h1").innerHTML = meseci[mesec] + " " + datum.getFullYear();
        document.querySelector(".datum p").innerHTML = new Date().toLocaleDateString("sl");

        let flagDan = 0;
        let datumi= "";
        
        //dopolnimo preostale dneve do prvega dne v trenutnem mesecu, z zadnjimi dnevi prejsnega meseca
        for(let j = prviDan; j > 0; j--){
            flagDan++;
            if(flagDan%7 === 0){
                datumi += `<div class = "prejsni_dan nedelja">${zadnjiDanPrejsnegaMeseca-j+1}</div>`
            }else{
                datumi += `<div class = "prejsni_dan">${zadnjiDanPrejsnegaMeseca-j+1}</div>`
            }
            document.querySelector(".datumi").innerHTML = datumi;
        } 

        //v koledar vpisemo dneve trenutnega meseca z njihovimi atributi (praznik, nedelja, danasnji dan)
        for(let i = 1; i <= zadnjiDan; i++){
            const jePraznik = aliJePraznik(i, datum.getMonth(), prazniki);
            flagDan++;
            console.log(jePraznik, i, datum.getMonth());
            if(i === new Date().getDate() && datum.getMonth() === new Date().getMonth() && datum.getFullYear() === new Date().getFullYear() ){
                if(flagDan%7 === 0){
                    if(jePraznik === 1 && datum.getFullYear() === new Date().getFullYear()){
                        datumi += `<div class = "danasnji_dan nedelja praznik">${i}</div>`
                    }else if(jePraznik === 2){
                        datumi += `<div class = "nedelja praznik">${i}</div>`
                    }else{
                        datumi += `<div class = "danasnji_dan nedelja">${i}</div>`
                    }
                }else{
                    if(jePraznik === 1 && datum.getFullYear() === new Date().getFullYear()){
                        datumi += `<div class = "danasnji_dan praznik">${i}</div>`
                    }else if(jePraznik === 2){
                        datumi += `<div class = "praznik">${i}</div>`
                    }else{
                        datumi += `<div class = "danasnji_dan">${i}</div>`
                    }
                }
            }
            else{
                if(flagDan%7 === 0){
                    if(jePraznik === 1 && datum.getFullYear() === new Date().getFullYear()){
                        datumi += `<div class = "nedelja praznik">${i}</div>`
                    }else if(jePraznik === 2){
                        datumi += `<div class = "nedelja praznik">${i}</div>`
                    }
                    else{
                        datumi += `<div class = "nedelja">${i}</div>`
                    }
                }else{
                    if(jePraznik === 1 && datum.getFullYear() === new Date().getFullYear()){
                        datumi += `<div class = "praznik">${i}</div>`
                    }else if(jePraznik === 2){
                        datumi += `<div class = "nedelja praznik">${i}</div>`
                    }
                    else{
                        datumi += `<div>${i}</div>`
                    }
                }
            }
            document.querySelector(".datumi").innerHTML = datumi;
        }

       //dopolnimo preostale dneve od zadnjega dneva trenutnega meseca, z dnevi naslednjega meseca
        for (let k = 1; k <= stNaslednjihDni; k ++){
            flagDan++;
            if(flagDan%7 === 0){
                datumi += `<div class = "naslednji_dan nedelja">${k}</div>`
            }else{
                datumi += `<div class = "naslednji_dan">${k}</div>`
            }
            document.querySelector(".datumi").innerHTML = datumi;
        }
    });
}

document.querySelector(".prejsniMesec").addEventListener("click", () =>{
    datum.setMonth(datum.getMonth()-1);
    ustvariKoledar();
})

document.querySelector(".naslednjiMesec").addEventListener("click", () =>{
    datum.setMonth(datum.getMonth()+1);
    ustvariKoledar();
})

function skociNaMesec() {
    const izbraniMesec = document.getElementById("izberiMesec").value;
    const indexMeseca = meseci.indexOf(izbraniMesec);
    datum.setMonth(indexMeseca);
    ustvariKoledar();
}

function skociNaLeto(){
    const izbranoLeto = document.getElementById("izbranoLeto").value;
    if(isNaN(datum.setFullYear(izbranoLeto))){
        window.alert("Vpiši veljavno leto!");
    }else{
        datum.setFullYear(izbranoLeto);
        ustvariKoledar();
    }
}

function skociNaMesecLeto(){
    const izbranoLetoMesec = document.getElementById("izbranoLM").value;
    const dan = izbranoLetoMesec.split(".")[0];
    const mesec = izbranoLetoMesec.split(".")[1]-1;
    const leto = izbranoLetoMesec.split(".")[2];
    if(dan > 30  || mesec > 12 || isNaN(datum.setFullYear(leto))|| isNaN(datum.setMonth(mesec)) || isNaN(datum.setDate(dan))){
        window.alert("Vpiši veljaven datum!");
    }else{
        datum.setFullYear(leto);
        datum.setMonth(mesec);
        ustvariKoledar();   
    }
}

/**
 * 
 * @param {number} d dan v trenutnem mesecu
 * @param {number} m trenutni mesec
 * @param {object} prazniki vsebuje podatke o datumih praznikov in njihovih ponovitvah
 * @returns {number} vrednost: 0 -> ni praznik, 1 -> je praznik: ponovi 1x, 2 -> je praznik: vsako leto
 */
function aliJePraznik(d, m, prazniki){
    let jePraznik = 0;
    console.log(typeof(prazniki));
    for(i = 0; i < prazniki.length; i++){
        const praznik = Object.values(prazniki[i].split(" "));
        praznikDan = parseInt(praznik[0].split(".")[0]);
        praznikMesec = parseInt(praznik[0].split(".")[1]-1);
        if(d === praznikDan && praznikMesec === m){
            if(parseInt(praznik[1]) === 0){
                jePraznik = 1;
            }
            else{
                jePraznik = 2;
            }
            break;
        }else{
            jePraznik = 0;
        }
    }
    return jePraznik;
}

ustvariKoledar();
