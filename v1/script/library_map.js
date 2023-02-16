const getDB = (urlData) =>{
    let rawData;
    $.get({
        url: urlData,
        success: data => rawData = data,        
        async: false
    });
    return rawData;
}

let dataCapaGlobal  = getDB("db/dataCapa1.json");
/*
console.log(dataCapaGlobal)
dataCapaGlobal = dataCapaGlobal.forEach(element => {
    if(element["Variable"] === null){
        element["Variable"] = "Sin Información";
    }
});
*/
let dataGlobal      = getDB("db/dataGlobal1.json");
dataGlobal.forEach(element => {
    if(element["Variable"] === null){
        element["Variable"] = "Sin Información"
    }
});

//console.log(dataGlobal)
//dataCapaGlobal = dataCapaGlobal.slice(0,2)

let dataColor   = getDB("data/dataColor1.json");
let dataIcono   = getDB("data/dataIcono1.json");


