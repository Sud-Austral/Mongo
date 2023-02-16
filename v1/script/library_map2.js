const customOptions = {
    'className': 'custom'
}

//Esta funcion toma una url publica y devuelve un objeto con los datos geograficos
function getData(urlData) {
    let rawData;
    $.get({
        url: urlData,
        success: data => rawData = data, 
        error: () => console.log("No File in " + urlData),       
        async: false
    });
    //console.log(rawData)
    let dataJson = rawData? JSON.parse(rawData): null;
    return dataJson?dataJson["features"].length > 0?dataJson:null:null;
}
//Esta funcion recibe el parametro CUT_COM de la url y devuelve el codigo
function getComuna(){
    const valores = window.location.search;
    //Creamos la instancia
    const urlParams = new URLSearchParams(valores);
    //Accedemos a los valores
    let codigo_comuna = urlParams.get('CUT_COM');
    codigo_comuna = codigo_comuna?codigo_comuna:"13101"; 
    codigo_comuna = codigo_comuna.length == 5? codigo_comuna:  `0${codigo_comuna}`;
    return codigo_comuna;
}

function getComuna2(){
    const valores = window.location.search;
    //Creamos la instancia
    const urlParams = new URLSearchParams(valores);
    //Accedemos a los valores
    let codigo_comuna = JSON.parse(urlParams.get('comunas'));
    codigo_comuna = codigo_comuna?codigo_comuna.map(x =>{
        let codigo_aux = x.toString();
        codigo_aux = codigo_aux.length == 5? codigo_aux:  `0${codigo_aux}`;
        return codigo_aux;  
    }):["13101"]; 
    //codigo_comuna = codigo_comuna.length == 5? codigo_comuna:  `0${codigo_comuna}`;
    //console.log(codigo_comuna)
    return codigo_comuna;
}

function getStringHTML2(feature, nombreCapa) {
    let htmlString = "<b><center> " + nombreCapa + "</b> : "  + feature.properties[nombreCapa] + " </center>";
    return htmlString;
}
//
function getStringHTML3(feature, nombreCapa) {
    let htmlString = "<b><center> " + nombreCapa + "</b> : "  + feature.properties[nombreCapa] + " </center>";
    return htmlString;
}

function getStringHTML4(feature, nombreCapa, descripcionCapa) {
    let htmlString = "<b><center> " + descripcionCapa + "</b> : "  + feature.properties[nombreCapa] + " </center>";
    return htmlString;
}

function highlightFeature(e){
    var layer = e.target;
    layer.setStyle({
        weight: 5,
        color: "#666",
        dashArray: '',
        fillOpacity: 0.2
    });
    info.update(layer.feature.properties)
}
function resetHighlight(e){
//    console.log("this",this);
    //console.log("e",e.sourceTarget._eventParents["45"]);
    let keysparent = Object.keys(e.sourceTarget._eventParents);
    console.log(keysparent)
    e.sourceTarget._eventParents[keysparent].resetStyle(e.target)
    //chileJS.resetStyle(e.target);
    info.update();
}
function zoomToFeature(e){
    map.fitBounds(e.target.getBounds());
}

function onEachFeature2(feature, layer){
    try {
        let htmlString = Object.keys(feature.properties).map(element => getStringHTML3(feature, element)).toString();
        htmlString = htmlString.replaceAll(",", "")
        htmlString = htmlString + 
        "</div><center><img class='banner2' src='https://raw.githubusercontent.com/Sud-Austral/mapa_glaciares/main/img/logo_DataIntelligence_normal.png' alt='Data Intelligence'/></center>";
        //console.log(lista)
        layer.bindPopup("<div class='parrafo_popup'>" + htmlString + "</div>", customOptions);

    } catch (e) {
        console.error(e);
        //layer.bindPopup("Sin Información", customOptions);
    }
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature,
    })
}
let colores = [ '#E59866','#D35400','#A04000','#6E2C00'] //,'#884EA0']
let contadorColores = 0
function EstiloAcuifero(feature){
    console.log(feature.geometry.type)    
    if(feature.geometry.type == "Polygon"){
        contadorColores++;
        return {"color":colores[contadorColores%4], "fillOpacity":1}
    }
    if(feature.geometry.type == "MultiPolygon"){
        contadorColores++;
        return {"color":colores[contadorColores%4],"fillOpacity":1}
    }
    else{
        return {"color":"black"}
    }
    //console.log(feature)

}
n = 0;
function estiloDB(){
    n++;
    return {"color": "#" + coloresDB[n%coloresDB.length]}
  } 

class SHAPE_CAPA {
    constructor(nombre, url, funcionEstilo) {
      this.nombre = nombre;
      this.url = url;
      this.data = getData(url);
      //this.shape = L.geoJson(this.data,{style:funcionEstilo,onEachFeature: onEachFeature2}) //.addTo(map);
      if(funcionEstilo){
        this.shape = L.geoJson(this.data,{style:funcionEstilo,onEachFeature: onEachFeature2})
      }
      else{
        this.shape = L.geoJson(this.data,{style:estiloDB,onEachFeature: onEachFeature2})
      }
      //this.shape = L.geoJson(this.data,{style:estiloDB,onEachFeature: onEachFeature2})   
      this.nombreCSS = `<span class="letrasControl"> ${this.nombre} </span>`  
    }
}


class SHAPE_CAPA2 {
    constructor(nombre, url, funcionEstilo) {
      this.nombre = nombre;
      this.url = url;
      this.data = getData(url);
      //console.log(this.url.split("/")[7]);
      this.capa = this.url.split("/")[7];
      
       let dataConfig = configColor.filter(x =>
            x.Capa == this.capa
        )
        /*
        function estiloShape_CAPA{

        }
        */
        if(dataConfig.length == 0){
            console.log("Cero",this.capa);
            if(funcionEstilo){
                this.shape = L.geoJson(this.data,{style:funcionEstilo,onEachFeature: onEachFeature2})
              }
              else{
                this.shape = L.geoJson(this.data,{style:estiloDB,onEachFeature: onEachFeature2})
              }
        }
        else{
            function estiloShape_CAPA(feature){
                let diccionarioReturn = {};
                dataConfig.forEach(
                    featureConfig =>{
                        diccionarioReturn[featureConfig["Variable"]] = featureConfig["Color"];
                        //console.log(featureConfig);
                        //console.log(feature);
                });
                //console.log(feature["properties"][dataConfig[0]["Propiedad"]]);
                let valueProperties = feature["properties"][dataConfig[0]["Propiedad"]];
                return {"color": "#" + diccionarioReturn[valueProperties]}
            }
            this.shape = L.geoJson(this.data,{style:estiloShape_CAPA,onEachFeature: onEachFeature2})
        }
      //this.shape = L.geoJson(this.data,{style:funcionEstilo,onEachFeature: onEachFeature2}) //.addTo(map);
      
      //this.shape = L.geoJson(this.data,{style:estiloDB,onEachFeature: onEachFeature2})   
      this.nombreCSS = `<span class="letrasControl"> ${this.nombre} </span>`  
    }
}



$(window).ready(function() {
    //$(".loader").fadeOut("slow");
    //let capasData = new CAPAS_AGUA(codigo_comuna);
    /*
    var capaRegiones2 = L.control.layers(capas_base, capasData.overlayMaps, {
        position: 'topright', // 'topleft', 'bottomleft', 'bottomright'
        collapsed:  true
    }).addTo(map);
    */
    //$(".loader").fadeOut("slow");
    //let detalle = new MAPAGLOBAL(comunaBase);   
    
    $("#comunaID").parent().parent().parent().parent().parent().parent().css( "background", "black");
    
});

//funcion para mostrar la simbologia (rango de color)
function style(feature){
    //console.log(feature.properties.SUPERFICIE);
    return{
        fillColor: '#884EA0',
        weight: 2,
        Opacity: 1,
        color: 'red',
        dashArray: '3',
        fillOpacity: 0.2
    }
}
//PopUp automatico



function onEachFeature(feature, layer){
    try {
        let htmlString = Object.keys(feature.properties).map(element => getStringHTML2(feature, element)).toString();
        htmlString = htmlString.replaceAll(",", "")
        htmlString = htmlString + 
        "</div><center><img class='banner2' src='https://raw.githubusercontent.com/Sud-Austral/mapa_glaciares/main/img/logo_DataIntelligence_normal.png' alt='Data Intelligence'/></center>";
        //console.log(lista)
        layer.bindPopup("<div class='parrafo_popup'>" + htmlString + "</div>", customOptions);
    } catch (e) {
        console.error(error);
        //layer.bindPopup("Sin Información", customOptions);

    }
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature,
    })
}

