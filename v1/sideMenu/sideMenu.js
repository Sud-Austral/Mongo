var leyendasGlobal = []

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

function openNav2() {
    document.getElementById("mySidenav2").style.width = "250px";
}

function closeNav2() {
    document.getElementById("mySidenav2").style.width = "0";
}

function slideToggleSideMenu(contenido) {
    $("#" + contenido).slideToggle( "slow", function() {
        // Animation complete.
    });
}

function cargar(){
    $(".loader").show();
    setTimeout(() => {
        $(".loader").fadeOut("slow");
    }, 2000); 


}



let capaActivas = []

function disableAllLayer(){
    leyendasGlobal.forEach(x => {
        x.remove();
    });
    leyendasGlobal = [];
    return true;
}

function getAllData(){
    let acumuladoSimple = acumuladorGlobal.map(
        x => x["data"]["features"].map(
            y => y["properties"]
        )
    ).reduce( (x,y)=> x.concat(y));
    return acumuladoSimple;   
}

function getVariableUnique(){
    let variable = acumuladorGlobal
        .filter(x => capaActivas
            .indexOf(removeAccents(x["descripcion"])) > -1)
        .map(
            x => x["propiedad"]
        )
    variable = [...new Set(variable)]
    return variable;
}

function getReference(variableUnica){
    let findDescripcion = acumuladorGlobal.filter(x => x["propiedad"] == variableUnica)[0]["descripcion"];
    let objReferencia = dataGlobal.filter(x => x["descripcion_capa"] == findDescripcion)[0];
    return objReferencia;
}

function getPallette(objReferencia){
    let pallette = objReferencia["Color"];
    let colorDBReferencia = dataColor.filter(x => x["Paleta"] == pallette);
    return colorDBReferencia;
}

function getPalletteIcon(objReferencia){
    let pallette = objReferencia["Color"];
    console.log(objReferencia)
    let refIcono = dataIcono.filter(y => y["Paleta"] == pallette);
    return refIcono;
}

function getValuesUniqueFromData(variableUnica,acumuladoSimple){
    let unicos = acumuladoSimple.map(
        x => x[variableUnica]
    )
    unicos = [...new Set(unicos)];
    return unicos;
}

function getHtmlFromPoligonRandom(unicos,colorDBReferencia,objReferencia,variableUnica){
    let htmlString = "";
    let contadorColor = 0; 
    let jsonColoresRandom = {};
    unicos.forEach(
        x =>{
            jsonColoresRandom[x] = colorDBReferencia[contadorColor % colorDBReferencia.length]["Color"];
            contadorColor++;
            let htmlAux = `<div class="contenedor"><div class="sidebar"><span class="desc1" style='background: ${jsonColoresRandom[x]};'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></div><div class="principal"><span onclick="mostarLayer('${x}','${variableUnica}')">  ${x} </span></div></div>`;
            htmlString = htmlString + htmlAux;  
    });
    let htmlMinimize = '<img id="clickme" src="Content/img/min.png" alt="imagen minimizar"></img><img id="clickme2" src="Content/img/max.png" alt="imagen maximizar"></img>';
    let titulo = objReferencia["titulo_leyenda"];
    let idName = removeAccents(objReferencia["descripcion_capa"]);
    let innerHTML = '<div class="legendCustom">' + 
                    `<div class="contenedor container"><div class="row"><div class="principal2 col-10"> <p class="titleLegend principal"><b>${titulo}</b></p></div><div onclick="slideToggleLegend('${idName}_slide',this);" class="sidebar2 col-2">${htmlMinimize}</div></div></div> `+
                    `<div id="${idName}_slide"> ${htmlString}</div>` +
                    '</div>';
    return innerHTML;
}

function getHtmlFromPointRandom(unicos,colorDBReferencia,objReferencia,variableUnica){
    console.log(objReferencia)
    let htmlString = "";
    let contadorColor = 0; 
    let jsonColoresRandom = {};
    unicos.forEach(
        x =>{
            jsonColoresRandom[x] = colorDBReferencia[contadorColor % colorDBReferencia.length]["Link"];
            let url = jsonColoresRandom[x] ;
            contadorColor++;
            let htmlAux = `<span onclick="mostarLayerPoint('${x}','${variableUnica}')"><img src="${url}" alt="Girl in a jacket" width="20" height="20"> ${x}</span><br>`
            //onclick="mostarLayer('${variable}','${variableUnica}',${idCapa})"
            htmlString = htmlString + htmlAux; 
    });
    let htmlMinimize = '<img id="clickme" src="Content/img/min.png" alt="imagen minimizar"></img><img id="clickme2" src="Content/img/max.png" alt="imagen maximizar"></img>';
    let titulo = objReferencia["titulo_leyenda"];
    let idName = removeAccents(objReferencia["descripcion_capa"]);
    let innerHTML = '<div class="legendCustom">' + 
                    `<div class="contenedor container"><div class="row"><div class="principal2 col-10"> <p class="titleLegend principal"><b>${titulo}</b></p></div><div onclick="slideToggleLegend('${idName}_slide',this);" class="sidebar2 col-2">${htmlMinimize}</div></div></div> `+
                    `<div id="${idName}_slide"> ${htmlString}</div>` +
                    '</div>';
    return innerHTML;
}

function getHtmlFromPoligonDefinidos(variableUnica,objReferencia){
    console.log(objReferencia)
    let htmlString = "";
    let acumulador = [];
    if(objReferencia["Variable"] == "default"){
        let variable = objReferencia["titulo_leyenda"];
        let color = objReferencia["Color"];
        let idCapa = objReferencia["idcapa"];
        let htmlAux = `<div class="contenedor"><div class="sidebar"><span class="desc1" style='background: ${color};'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></div><div class="principal"><span onclick="mostarLayer2('default','${variableUnica}',${idCapa})">  ${variable} </span></div></div>`;
        htmlString = htmlString + htmlAux;
    }
    else{
        dataGlobal.filter(x => x["Propiedad"] == variableUnica).forEach(
            x =>{
                console.log(x)
                let variable = x["Variable"];
                let idCapa = x["idcapa"];
                if(acumulador.indexOf(variable) == -1){
                    //console.log(variableUnica,objReferencia)
                    let color = x["Color"];
                    let htmlAux = `<div class="contenedor"><div class="sidebar"><span class="desc1" style='background: ${color};'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></div><div class="principal"><span onclick="mostarLayer('${variable}','${variableUnica}',${idCapa})">  ${variable} </span></div></div>`;
                    htmlString = htmlString + htmlAux;
                    acumulador.push(variable);
                }
        });
    }
    let htmlMinimize = '<img id="clickme" src="Content/img/min.png" alt="imagen minimizar"></img><img id="clickme2" src="Content/img/max.png" alt="imagen maximizar"></img>';
    //console.log(objReferencia)
    let titulo = objReferencia["descripcion_capa"];
    let idName = removeAccents(objReferencia["descripcion_capa"]);
    let innerHTML = '<div class="legendCustom">' + 
                    `<div class="contenedor container"><div class="row"><div class="principal2 col-10"> <p class="titleLegend principal"><b>${titulo}</b></p></div><div onclick="slideToggleLegend('${idName}_slide',this);" class="sidebar2 col-2">${htmlMinimize}</div></div></div> `+
                    `<div id="${idName}_slide"> ${htmlString}</div>` +
                    '</div>';
    return innerHTML;
}

function getHtmlFromPointDefinidos(variableUnica,objReferencia){
    let htmlString = "";
    let acumulador = [];
    if(objReferencia["Variable"] == "default"){
        let variable = objReferencia["titulo_leyenda"];
        let url = objReferencia["url_icono"];
        let htmlAux = `<span><img src="${url}" alt="Girl in a jacket" width="20" height="20"> ${variable}</span><br>`
        htmlString = htmlString + htmlAux;
    }
    else{
        dataGlobal.filter(x => x["Propiedad"] == variableUnica).forEach(
            x =>{
                let variable = x["Variable"];
                let idCapa = x["idcapa"];
                if(acumulador.indexOf(variable) == -1){
                    let url = x["url_icono"];
                    let htmlAux = `<span onclick="mostarLayerPoint('${variable}','${variableUnica}',${idCapa})"><img src="${url}" alt="Girl in a jacket" width="20" height="20"> ${variable}</span><br>`
                    htmlString = htmlString + htmlAux;
                    acumulador.push(variable);
                }
        });
    }
    let htmlMinimize = '<img id="clickme" src="Content/img/min.png" alt="imagen minimizar"></img><img id="clickme2" src="Content/img/max.png" alt="imagen maximizar"></img>';
    
    let titulo = objReferencia["titulo_leyenda"];
    let idName = removeAccents(objReferencia["descripcion_capa"]);
    let innerHTML = '<div class="legendCustom">' + 
                    `<div class="contenedor container"><div class="row"><div class="principal2 col-10"> <p class="titleLegend principal"><b>${titulo}</b></p></div><div onclick="slideToggleLegend('${idName}_slide',this);" class="sidebar2 col-2">${htmlMinimize}</div></div></div> `+
                    `<div id="${idName}_slide"> ${htmlString}</div>` +
                    '</div>';
    return innerHTML;
}

function getLegendLeaflet(stringHtml){
    var legend = L.control({position: 'bottomleft'});
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        div.innerHTML += stringHtml;
        return div;
    };                
    leyendasGlobal.push(legend)
    legend.addTo(map);
    return legend;
}

function checkComuna(inputObject, comuna){
    general2.getCleanMap()
    removeMarker()
    let countSeconds = 0;

    //cargar();
    let objeto = $(inputObject);
    
    if(objeto.is(":checked")){
        general2.activateComuna(comuna);
        $("#div-input-capas input").each((x,y)=> {
            let objeto = $(y);
            let capaNombre = objeto.attr("value");
            let capaID = "#"+objeto.attr("value") + comuna;
            if(objeto.is(":checked")){
                general.activateCapa(capaNombre,comuna);
                countSeconds++;
            }
        });
    }
    else{
        general2.desactiveComuna(comuna);
        $("#div-input-capas input").each((x,y)=> {
            let objeto = $(y);
            if(objeto.is(":checked")){
                //console.log()
                let capaID = "#"+objeto.attr("value") + comuna;
                console.log(capaID)
                $(capaID).trigger("click")
            }
        });
    }
    disableAllLayer();
    setTimeout(() => {
        general2.getAllLegend()
        return 
        let acumuladoSimple = getAllData();
        let variable = getVariableUnique();
        variable.forEach(
            variableUnica =>{
                let objReferencia = getReference(variableUnica);
                let unicos = getValuesUniqueFromData(variableUnica,acumuladoSimple);
                let jsonColoresRandom = {}; 
                if(objReferencia["Tipo"] == "Puntos"){
                    //Esto es un punto
                    if(objReferencia["Variable"] == "random"){
                        //Esto es un punto random
                        let paleta = getPalletteIcon(objReferencia);
                        let htmlString = getHtmlFromPointRandom(unicos,paleta,objReferencia,variableUnica);
                        getLegendLeaflet(htmlString);
                    }
                    else{
                        //Esto es un punto Definido
                        let htmlString = getHtmlFromPointDefinidos(variableUnica,objReferencia)
                        getLegendLeaflet(htmlString);                        
                    }
                }
                else{
                    //Esto es un poligono
                    if(objReferencia["Variable"] == "random"){
                        //Esto es un poligono random
                        let paleta = getPallette(objReferencia);
                        let htmlString = getHtmlFromPoligonRandom(unicos,paleta,objReferencia,variableUnica);
                        getLegendLeaflet(htmlString);
                    }
                    else{
                        //"Esto es un poligono con colores definidos"
                        let htmlString = getHtmlFromPoligonDefinidos(variableUnica,objReferencia)
                        getLegendLeaflet(htmlString);                        
                    }
                }
                return                 
        });
    }, 500 * countSeconds);   
}

function checkCapa(inputObject, capa){
    general2.getCleanMap()
    removeMarker()
    let objeto = $(inputObject);
    let countSeconds = 0;
    
    
    if(objeto.is(":checked")){
        general2.activateLayer(capa)
        capaActivas.push(capa)
        $("#div-input-comunas input").each((x,y)=> {
            let objeto = $(y);
            let capaID = "#"+ capa + objeto.attr("value");
            if(objeto.is(":checked")){
                general.activateCapa(capa,objeto.attr("value"));
                countSeconds++;
            }
        })
    }
    else{
        general2.desactiveLayer(capa)
        capaActivas = capaActivas.filter(x => x != capa)
        $("#div-input-comunas input").each((x,y)=> {
            let objeto = $(y);
            if(objeto.is(":checked")){
                let capaID = "#"+ capa + objeto.attr("value");
                $(capaID).trigger("click")
            }
        });
    }
    disableAllLayer();
    
    let tiempoEspera = 500 * countSeconds < 1000?1000:500 * countSeconds;
    setTimeout(() => {
        general2.getAllLegend()
        return 
        let acumuladoSimple = getAllData();
        let variable = getVariableUnique();
        variable.forEach(
            variableUnica =>{
                let objReferencia = getReference(variableUnica);
                let unicos = getValuesUniqueFromData(variableUnica,acumuladoSimple);
                let jsonColoresRandom = {}; 
                if(objReferencia["Tipo"] == "Puntos"){
                    //Esto es un punto
                    if(objReferencia["Variable"] == "random"){
                        //Esto es un punto random
                        let paleta = getPalletteIcon(objReferencia);
                        let htmlString = getHtmlFromPointRandom(unicos,paleta,objReferencia,variableUnica);
                        getLegendLeaflet(htmlString);
                    }
                    else{
                        //Esto es un punto Definido
                        let htmlString = getHtmlFromPointDefinidos(variableUnica,objReferencia)
                        getLegendLeaflet(htmlString);                        
                    }
                }
                else{
                    //Esto es un poligono
                    if(objReferencia["Variable"] == "random"){
                        //Esto es un poligono random
                        let paleta = getPallette(objReferencia);
                        let htmlString = getHtmlFromPoligonRandom(unicos,paleta,objReferencia,variableUnica);
                        getLegendLeaflet(htmlString);
                    }
                    else{
                        //"Esto es un poligono con colores definidos"
                        let htmlString = getHtmlFromPoligonDefinidos(variableUnica,objReferencia)
                        getLegendLeaflet(htmlString);                        
                    }
                }
                return                 
        });
    }, 10000);
}



// LZW-compress a string
function lzw_encode(s) {
    var dict = {};
    var data = (s + "").split("");
    var out = [];
    var currChar;
    var phrase = data[0];
    var code = 256;
    for (var i=1; i<data.length; i++) {
        currChar=data[i];
        if (dict[phrase + currChar] != null) {
            phrase += currChar;
        }
        else {
            out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
            dict[phrase + currChar] = code;
            code++;
            phrase=currChar;
        }
    }
    out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
    for (var i=0; i<out.length; i++) {
        out[i] = String.fromCharCode(out[i]);
    }
    return out.join("");
}

// Decompress an LZW-encoded string
function lzw_decode(s) {
    var dict = {};
    var data = (s + "").split("");
    var currChar = data[0];
    var oldPhrase = currChar;
    var out = [currChar];
    var code = 256;
    var phrase;
    for (var i=1; i<data.length; i++) {
        var currCode = data[i].charCodeAt(0);
        if (currCode < 256) {
            phrase = data[i];
        }
        else {
           phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
        }
        out.push(phrase);
        currChar = phrase.charAt(0);
        dict[code] = oldPhrase + currChar;
        code++;
        oldPhrase = phrase;
    }
    return out.join("");
}


function marcar_comunas(){
    //alert("Hola")
    $("#div-input-comunas input").each((x,y)=> {
        let objeto = $(y);
        if(!objeto.is(":checked")){
            //let capaID = "#"+ capa + objeto.attr("value");
            //$(capaID).trigger("click")
            $(objeto).trigger("click")
            //console.log(objeto)
        }
    });
}

function desmarcar_ckeck(){
    //alert("Hola")
    $("#div-input-comunas input").each((x,y)=> {
        let objeto = $(y);
        if(objeto.is(":checked")){
            $(objeto).trigger("click")
        }
    });
    $("#div-input-capas input").each((x,y)=> {
        let objeto = $(y);
        if(objeto.is(":checked")){
            $(objeto).trigger("click")
        }
    });
}

/*

$($(".leaflet-control-layers-list")[0])
*/
let flagBotonComunas = true;

function marcarTodoComuna(mismoBoton){
    flagBotonComunas?$(mismoBoton).text("Mostrar comunas"):$(mismoBoton).text("Ocultar comunas");
    let listaComuna = $($(".leaflet-control-layers-list")[1])
    listaComuna.find("input").each((x,y) =>{
        let boton = $(y);
        if(boton.is(":checked") == flagBotonComunas){
            boton.trigger("click");
        }
    });
    flagBotonComunas = !flagBotonComunas;
}