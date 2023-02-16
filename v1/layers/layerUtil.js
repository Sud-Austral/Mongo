function removeMarker(){
    try {
        if(mapMarker){
            mapMarker.remove(map);
        }
    } catch (error) {
        console.log("No hay marker definido aun")
    }    
}

let getHtmlToolTip = (variable) => `<span class="tooltiptext">Haz click para marcar ${variable}</span>` 



function getLegendLeaflet2(stringHtml){
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

function getHtmlFromPoligonDefinidos2(variableUnica,objReferencia,unicos){
    
    let descripcion = objReferencia["descripcion_capa"];
    
    let htmlString = "";
    let acumulador = [];
    let dictColor = []
    if(objReferencia["Variable"] == "default"){
        let variable = objReferencia["titulo_leyenda"];
        let color = objReferencia["Color"];
        dictColor[variable] = color
        let idCapa = objReferencia["idcapa"];
        //let htmlAux = `<div class="contenedor"><div class="sidebar"><span class="desc1" style='background: ${color};'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></div><div class="principal"><span onclick="mostarLayer2('default','${variableUnica}',${idCapa})">
        let htmlAux = `<div class="contenedor"><div class="sidebar"><span class="desc1" style='background: ${color};'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></div><div class="principal"><span class="variableLeyenda" onclick="general2.markPolygon2('${descripcion}','${variable}')">  ${variable} ${getHtmlToolTip(variable)} </span></div></div>`;
        htmlString = htmlString + htmlAux;
    }
    else{
        //dataGlobal.filter(x => x["Propiedad"] == variableUnica).forEach(
        unicos.sort().forEach(
            x =>{
                //x = x? x: "Sin Información";
                //let variable = x["Variable"];
                let variable = x;
                variable= variable? variable: "Sin Información";
                let idCapa = objReferencia["idcapa"];
                if(acumulador.indexOf(variable) == -1){
                    //console.log(variableUnica,objReferencia)
                    console.log(unicos,objReferencia["Capa"],x,"falta",dataGlobal)
                    try {
                        //console.log(objReferencia["Capa"],x,"falta",dataGlobal)
                        //console.log(dataGlobal.filter(y => objReferencia["Capa"] == y["Capa"] && y["Variable"] == x))
                        let color = dataGlobal.filter(y => objReferencia["Capa"] == y["Capa"] && y["Variable"] == x)[0]["Color"];
                        //console.log(objReferencia,dataGlobal.filter(y => objReferencia["Capa"] == y["Capa"] && y["Variable"] == x))
                        //let color = "FFF";
                        dictColor[variable] = color
                        //let htmlAux = `<div class="contenedor"><div class="sidebar"><span class="desc1" style='background: ${color};'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></div><div class="principal"><span onclick="mostarLayer('${variable}','${variableUnica}',${idCapa})">  ${variable} </span></div></div>`;
                        let htmlAux = `<div class="contenedor"><div class="sidebar"><span class="desc1" style='background: ${color};'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></div><div class="principal"><span class="variableLeyenda" onclick="general2.markPolygon('${descripcion}','${variable}')">  ${variable} ${getHtmlToolTip(variable)} </span></div></div>`;
                        htmlString = htmlString + htmlAux;
                        acumulador.push(variable);                        
                    } catch (error) {
                        console.log("Error en la leyenda",objReferencia["Capa"],x);
                    }                    
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
    return [innerHTML,dictColor];
}

function getHtmlFromPoligonRandom2(unicos,colorDBReferencia,objReferencia,variableUnica){
    console.log("Poligono random")
    let htmlString = "";
    let contadorColor = 0; 
    let jsonColoresRandom = {};
    let descripcion = objReferencia["descripcion_capa"];
    if(unicos.length == 0){
        htmlString = "Sin información";
    }
    else{
        unicos.forEach(
            x =>{
                x = x? x: "Sin Información";
                jsonColoresRandom[x] = colorDBReferencia[contadorColor % colorDBReferencia.length]["Color"];
                contadorColor++;
                let htmlAux = `<div class="contenedor"><div class="sidebar"><span class="desc1" style='background: ${jsonColoresRandom[x]};'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></div><div class="principal"><span class="variableLeyenda" onclick="general2.markPolygon('${descripcion}','${x}')">  ${x} ${getHtmlToolTip(x)} </span></div></div>`;
                htmlString = htmlString + htmlAux;  
        });

    }
    let htmlMinimize = '<img id="clickme" src="Content/img/min.png" alt="imagen minimizar"></img><img id="clickme2" src="Content/img/max.png" alt="imagen maximizar"></img>';
    let titulo = objReferencia["titulo_leyenda"];
    let idName = removeAccents(objReferencia["descripcion_capa"]);
    let innerHTML = '<div class="legendCustom">' + 
                    `<div class="contenedor container"><div class="row"><div class="principal2 col-10"> <p class="titleLegend principal"><b>${titulo}</b></p></div><div onclick="slideToggleLegend('${idName}_slide',this);" class="sidebar2 col-2">${htmlMinimize}</div></div></div> `+
                    `<div id="${idName}_slide"> ${htmlString}</div>` +
                    '</div>';
    return [innerHTML,jsonColoresRandom];
}

function getHtmlFromPointRandom2(unicos,colorDBReferencia,objReferencia,variableUnica){
    
    let descripcion = objReferencia["descripcion_capa"];
    let htmlString = "";
    let contadorColor = 0; 
    let jsonColoresRandom = {};
    
    unicos.forEach(
        x =>{
            if(x == "" && x === null){
                x="Sin Información"
            }
            console.log(colorDBReferencia)
            jsonColoresRandom[x] = colorDBReferencia[contadorColor % colorDBReferencia.length]["Link"];
            let url = colorDBReferencia[contadorColor % colorDBReferencia.length]["Link"] ;

            contadorColor++;
            let htmlAux = `<span class="variableLeyenda" onclick="general2.markPoint('${descripcion}','${x}')"><img src="${url}" alt="Girl in a jacket" width="20" height="20"> ${x} ${getHtmlToolTip(x)} </span><br>`
            //onclick="mostarLayer('${variable}','${variableUnica}',${idCapa})"
            htmlString = htmlString + htmlAux; 
    });
    if(unicos.length == 0){
        htmlString = "Sin información";
    }
    let htmlMinimize = '<img id="clickme" src="Content/img/min.png" alt="imagen minimizar"></img><img id="clickme2" src="Content/img/max.png" alt="imagen maximizar"></img>';
    let titulo = objReferencia["titulo_leyenda"];
    let idName = removeAccents(objReferencia["descripcion_capa"]);
    let innerHTML = '<div class="legendCustom">' + 
                    `<div class="contenedor container"><div class="row"><div class="principal2 col-10"> <p class="titleLegend principal"><b>${titulo}</b></p></div><div onclick="slideToggleLegend('${idName}_slide',this);" class="sidebar2 col-2">${htmlMinimize}</div></div></div> `+
                    `<div id="${idName}_slide"> ${htmlString}</div>` +
                    '</div>';
    
    return [innerHTML,jsonColoresRandom];
}

function getHtmlFromPointDefinidos2(variableUnica,objReferencia,unicos){
    console.log(variableUnica)
    let descripcion = objReferencia["descripcion_capa"];
    let htmlString = "";
    let acumulador = [];
    let jsonColoresRandom = {};
    if(objReferencia["Variable"] == "default"){
        let variable = objReferencia["titulo_leyenda"];
        let url = objReferencia["url_icono"];
        jsonColoresRandom[variable] = url;
        let htmlAux = `<span class="variableLeyenda" onclick="general2.markPoint2('${descripcion}','${variable}')"><img src="${url}" alt="Girl in a jacket" width="20" height="20"> ${variable} ${getHtmlToolTip(variable)} </span><br>`
        htmlString = htmlString + htmlAux;
    }
    else{
        //dataGlobal.filter(x => x["Propiedad"] == variableUnica).forEach(
        unicos.forEach(
            x =>{
                //let variable = x["Variable"];
                let variable = x
                if( variable === "" ||  variable === null){
                    variable="Sin Información"
                    //console.log(variable,variable===null)
                };
                var variable2 = variable
                variable = variable.toString();
                //let idCapa = x["idcapa"];
                let idCapa = objReferencia["idcapa"];
                let color = dataGlobal.filter(y => objReferencia["Capa"] == y["Capa"] && y["Variable"] === variable && y["Propiedad"] == variableUnica)[0]["url_icono"];               
                
                if(acumulador.indexOf(variable) == -1){
                    let url = color;
                    jsonColoresRandom[variable] = url;
                    let htmlAux = `<span class="variableLeyenda" onclick="general2.markPoint('${descripcion}','${x}')"><img src="${url}" alt="Girl in a jacket" width="20" height="20"> ${variable} ${getHtmlToolTip(variable)}</span><br>`
                    htmlString = htmlString + htmlAux;
                    acumulador.push(variable);
                }
        });
    }
    if(unicos.length == 0){
        htmlString = "Sin información";
    }
    let htmlMinimize = '<img id="clickme" src="Content/img/min.png" alt="imagen minimizar"></img><img id="clickme2" src="Content/img/max.png" alt="imagen maximizar"></img>';
    
    let titulo = objReferencia["titulo_leyenda"];
    let idName = removeAccents(objReferencia["descripcion_capa"]);
    let innerHTML = '<div class="legendCustom">' + 
                    `<div class="contenedor container"><div class="row"><div class="principal2 col-10"> <p class="titleLegend principal"><b>${titulo}</b></p></div><div onclick="slideToggleLegend('${idName}_slide',this);" class="sidebar2 col-2">${htmlMinimize}</div></div></div> `+
                    `<div id="${idName}_slide"> ${htmlString}</div>` +
                    '</div>';
    return [innerHTML,jsonColoresRandom];
}

