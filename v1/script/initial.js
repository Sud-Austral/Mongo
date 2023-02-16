//Mapa de Leaflet
let map = L.map("mapid",{
    minZoom: 0,
    maxZoom: 18,
    zoomSnap: 0,
    zoomDelta: 0.25
}).setView([-33.458725187656356, -70.66008634501547],10);

function slideToggleLegend(idLegenda) {
    //alert( "clicked " +idLegenda);
    $( "#" + idLegenda ).slideToggle( "slow", function() {
        // Animation complete.
    });
  }
//"Capa":"datos_de_pozos"
//"idcapa":26
//dataGlobal = dataGlobal.filter(x => x["idcapa"] == 10);
//https://github                .com/Sud-Austral/DATA_MAPA_PUBLIC_V2/raw/main/AGUAS/Iconos/solido1.png
//https://raw.githubusercontent .com/Sud-Austral/DATA_MAPA_PUBLIC_V2    /main/AGUAS/Iconos/Solido1.png

iconosDB = iconosDB.map( x =>{
    x.replaceAll("https://github","https://raw.githubusercontent")
    .replaceAll("/DATA_MAPA_PUBLIC_V2/raw","/DATA_MAPA_PUBLIC_V2")});

const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replaceAll(" ","")
    .replaceAll(":","")
    .replace(/[^a-zA-Z0-9 ]/g, "");
    } 

function getIcon(url){
    url = url?url:"https://github.com/Sud-Austral/DATA_MAPA_PUBLIC_V2/raw/main/svg/default.png";
    let myIcon;
    if(url.split(".")[1] == "svg"){
        myIcon = L.icon({
            iconUrl: url,
            iconSize:  [50,50]   //[25, 25] // width and height of the image in pixels
            });
    }
    else{
        myIcon = L.icon({
            iconUrl: url,
            iconSize:  [15,215]   //[25, 25] // width and height of the image in pixels
            });
    }
    return myIcon;
}

function getLayerMapBox(id){
    const base = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: id,
        tileSize: 512,
        zoomOffset: -1
    });
    return base;
}

function getMapaBase(){
    const objetos = {
        "Mapa claro":               getLayerMapBox("mapbox/streets-v11"),
        "Mapa Oscuro":              getLayerMapBox("mapbox/dark-v9"),
        "Mapa Satelital":           getLayerMapBox("mapbox/satellite-streets-v9"),
        "Mapa Gris":                getLayerMapBox("mapbox/light-v10"),
        "Navegación Diario":        getLayerMapBox("mapbox/navigation-day-v1"),
        "Navegación nocturna":      getLayerMapBox("mapbox/navigation-night-v1"),
        "HEREv3_satelliteDay":      L.tileLayer.provider('HEREv3.normalDayCustom', {apiKey: 'SjU6SSxb2QKvye8tQtgvPnCmX-TbmwtTtJol3gz57iI'}),
        "HEREv3_pedestrianNight":   L.tileLayer.provider('HEREv3.pedestrianNight', {apiKey: 'SjU6SSxb2QKvye8tQtgvPnCmX-TbmwtTtJol3gz57iI'}),
        "HEREv3_pedestrianDay":     L.tileLayer.provider('HEREv3.pedestrianDay', {apiKey: 'SjU6SSxb2QKvye8tQtgvPnCmX-TbmwtTtJol3gz57iI'}),
        "HEREv3_reduceDay":         L.tileLayer.provider('HEREv3.reducedDay', {apiKey: 'SjU6SSxb2QKvye8tQtgvPnCmX-TbmwtTtJol3gz57iI'}),
        "HEREv3_normalNight":       L.tileLayer.provider('HEREv3.normalNight', {apiKey: 'SjU6SSxb2QKvye8tQtgvPnCmX-TbmwtTtJol3gz57iI'}),
        "HEREv3_normalDayMobile":   L.tileLayer.provider('HEREv3.normalDayMobile', {apiKey: 'SjU6SSxb2QKvye8tQtgvPnCmX-TbmwtTtJol3gz57iI'}),
        "HEREv3_normalDayGrey":     L.tileLayer.provider('HEREv3.normalDayGrey', {apiKey: 'SjU6SSxb2QKvye8tQtgvPnCmX-TbmwtTtJol3gz57iI'})
    }
    return objetos;
}

class COMUNABASE{
    constructor(){
        //Mapas Bases de MapBox
        this.mapasBases = getMapaBase();
        //Set Primer mapas base al mapa Leaflet
        this.mapasBases["Mapa claro"].addTo(map);
        //Obtener Comuna
        this.codigo_comuna = getComuna();
        //URL de los datos de Comuna
        this.urlBaseComuna = `https://raw.githubusercontent.com/Sud-Austral/DATA_MAPA_PUBLIC_V2/main/chile_comunas/${this.codigo_comuna}.json`;
        //this.urlBaseComuna = `https://raw.githubusercontent.com/Sud-Austral/DATA_MAPA_PUBLIC_V2/main/chile_comunas_test/${this.codigo_comuna}.json`;
        console.log(this.urlBaseComuna)
        //Get Data de Comuna
        this.dataBaseComuna = getData(this.urlBaseComuna);
        //Get Shape de Comuna
        this.shapeBaseComuna = L.geoJson(this.dataBaseComuna,{
            style: style,
            onEachFeature: onEachFeature            
        }).addTo(map);
        let nombreComuna = this.dataBaseComuna["features"][0]["properties"]["COMUNA"];
        nombreComuna = `<span id="comunaID"> ${nombreComuna} </span>`.toString();
        this.jsonComuna = {};
        this.jsonComuna[nombreComuna] = this.shapeBaseComuna;
        this.controlComunaBase = L.control.layers(null, this.jsonComuna, {
            position: 'topleft', // 'topleft', 'bottomleft', 'bottomright'
            collapsed: false // true
        }).addTo(map);
        map.fitBounds(this.shapeBaseComuna.getBounds());
        let zoom = map.getZoom();
        let zoomMin = 10
        map.setZoom(zoom > zoomMin ? zoomMin : zoom);     
    }
}

class LEGENDMAP{

    iconDefault = "https://github.com/Sud-Austral/DATA_MAPA_PUBLIC_V2/raw/main/svg/default.png";

    constructor(idName, Nombre,dictIcono,dictColor,titulo){
        this.Nombre = Nombre;
        this.idName = idName;
        this.legend = L.control({ position: 'bottomleft' });
        this.dictIcono = dictIcono;
        this.dictColor = dictColor;
        this.titulo = titulo;
    }

    setLegenda(){
        let titulo = this.titulo;
        let nombre = this.Nombre;
        let dicAux = this.dictIcono;
        let dicAux2 = this.dictColor;
        let idName = this.idName;
        this.legend.onAdd = function () {
            var div = L.DomUtil.create('div', 'legend');
            let htmlString = "";
            //console.log(dicAux)
            if(dicAux){
                Object.keys(dicAux).forEach(x => {
                    try {
                        //let url = dicAux[x]?dicAux[x]['options']['iconUrl']:iconDefault;
                        let url = dicAux[x]?dicAux[x]['options']?dicAux[x]['options']['iconUrl']:dicAux[x]:iconDefault;
                        x = x != ""?x:"Sin Información";
                        let htmlAux = `<span><img src="${url}" alt="Girl in a jacket" width="20" height="20"> ${x}</span><br>`
                        htmlString = htmlString + htmlAux;    
                    } catch (error) {
                        console.log("Error en Diccionario Icono setLegenda");
                    }                    
                });
            }
            if(dicAux2){
                Object.keys(dicAux2).forEach(x => {
                    try {
                        let color = dicAux2[x];
                        x = x != ""?x:"Sin Información";
                        //let htmlAux = `<span><img src="${dicAux2[x]['options']['iconUrl']}" alt="Girl in a jacket" width="20" height="20"> ${x}</span><br>`
                        let htmlAux = `<div class="contenedor"><div class="sidebar"><span class="desc1" style='background: ${color};'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></div><div class="principal"><span>  ${x} </span></div></div>`;
                        htmlString = htmlString + htmlAux;  
                    } catch (error) {
                        console.log("Error en Diccionario Color setLegenda");
                    }                    
                });
            }
            let htmlMinimize = `<i id="clickme" class="gg-minimize-alt"> </i>`;
            div.innerHTML +=
            '<div class="legendCustom">' + 
            `<div class="contenedor"><div class="principal2"> <p class="titleLegend principal"><b>${titulo}</b></p></div><div onclick="slideToggleLegend('${idName}_slide')" class="sidebar2">${htmlMinimize}</div></div> `+
            //'<span class="desc1" style="background: #e82c2c;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>'+
            `<div id="${idName}_slide"> ${htmlString}</div>` +
            '</div>';
            return div;
        };
        $(`#${this.idName}`).parent().parent().parent().find("input").change(() => {
            let check = $(`#${this.idName}`).parent().parent().parent().find("input").prop("checked");
            check?this.legend.addTo(map):this.legend.remove();
        });        
    }
}

class MAPAGLOBAL{
    constructor(comunaBase){          
        //let comunaBase = new COMUNABASE();    
        this.jsonTotalCapas = {};
        //https:// github.com                 /Sud-Austral/mapa_insumos/tree/main/comunas_capas/shapes_por_comuna/APR_SSC_COM_CGS/?CUT_COM=00000.json
        //https:// raw.githubusercontent.com  /Sud-Austral/mapa_insumos     /main/comunas_capas/shapes_por_comuna/APR_SSC_COM_CGS/13101.json
        dataCapaGlobal = dataCapaGlobal.map(capa => {
            //console.log(capa)
            capa["url"] = capa["url"]
                .replaceAll("github.com","raw.githubusercontent.com")
                .replaceAll("tree","");
            return capa;
        });
        this.dataGlobalNivel1 = dataCapaGlobal.map(capa => {
            capa["urlData"] = `${capa.url.split("?")[0]}${comunaBase.codigo_comuna}.json`;
            try {
                capa["data"] = getData(capa["urlData"]);
            } catch (error) {
                console.log("Revisa " + capa["urlData"]);
                capa["data"] = null;
            }            
            return capa;
        }).filter( capa =>
            capa["data"] != null
        );
        
        //
        this.legendas = []
        this.ContadorColores = 0;
        this.ContadorIconos = 0;
        this.dataGlobalNivel1.forEach(capa =>{
            let dataGlobalNivel2 = dataGlobal.filter( capaGlobal =>
                capaGlobal.idcapa == capa.idcapa
            );            
            let dataGlobalDescripCapaUnique2 = dataGlobalNivel2.filter(x => x["popup_0_1"] == 1);
            //console.log("aka2",dataGlobalDescripCapaUnique2);
            let dataGlobalDescripCapaUnique = [...new Set(dataGlobalNivel2
            //let dataGlobalDescripCapaUnique = [...new Set(dataGlobalDescripCapaUnique2
                                    .filter(x => x.popup_0_1 != null)
                                    .sort((x,y) => {return x["posición_capa"] - y["posición_capa"]})
                                    
                                    .map(x => x.descripcion_capa)
                                    .filter(x => x)
                                    )];
            let dataGlobalPropiedadesUnique = [... new Set(dataGlobalNivel2.sort( x=> x.posicion_popup).map(x => x.Propiedad))]
            let diccionarioNombrePropiedadPopup = {}
            dataGlobalNivel2.forEach(x => diccionarioNombrePropiedadPopup[x.Propiedad] = x["descripcion_pop-up"]);
            //console.log("aka2",dataGlobalPropiedadesUnique);
            
            function onEachFeatureCustom(feature, layer){
                
                

                let htmlString = dataGlobalPropiedadesUnique.map(element => getStringHTML4(feature, element,diccionarioNombrePropiedadPopup[element])).toString();
                htmlString = htmlString.replaceAll(",", "")
                htmlString = htmlString + 
                "</div><center><img class='banner2' src='https://raw.githubusercontent.com/Sud-Austral/mapa_glaciares/main/img/logo_DataIntelligence_normal.png' alt='Data Intelligence'/></center>";
                layer.bindPopup("<div class='parrafo_popup'>" + htmlString + "</div>", customOptions);                
                layer.on({
                    mouseover: highlightFeature,
                    mouseout: resetHighlight,
                    click: zoomToFeature,
                })
            }
            //console.log(capa["data"])
            let tipoGeometria = capa["data"]["features"][0]["geometry"]["type"];
            dataGlobalDescripCapaUnique.sort(x => x["posición_capa"]).forEach(capaUnica =>{
                let capaUnicaID = removeAccents(capaUnica);
                let capaUnicaName = capaUnica;
                capaUnica = `<span id='${capaUnicaID}'>${capaUnica}</span>`;
                let estiloDinamico = null;
                let dataGlobalCapas = dataGlobalNivel2.filter(x => x["descripcion_capa"] == capaUnicaName);
                let tituloLeyenda = dataGlobalCapas[0]["titulo_leyenda"];
                
                //console.log(capaUnicaName,"***********",tipoGeometria,"***********",dataGlobalCapas[0]["Variable"])                
                if(tipoGeometria == "Point"){
                    let setIcon;                   
                    if(dataGlobalCapas.length == 1){                        
                        if(dataGlobalCapas[0]["Variable"] == "default"){
                            let objReferencia = dataGlobal.filter(x => x["descripcion_capa"] == capaUnicaName)[0];   
                            let jsonIconosRandom = {};
                            //{"Falabella"=icon(falabella,"Ripley":"")}
                            let jsonIconosRandom2 = {}; 
                            jsonIconosRandom[objReferencia["Propiedad"]] = getIcon(objReferencia["url_icono"]);
                            setIcon = (feature,latlng) => {
                                return L.marker(latlng, { icon: jsonIconosRandom[objReferencia["Propiedad"]] });
                            }
                            jsonIconosRandom2[capaUnicaName] = jsonIconosRandom[objReferencia["Propiedad"]]; 
                            //descripcion_pop-up
                            this.legendas.push(new LEGENDMAP(capaUnicaID,capaUnicaName,jsonIconosRandom2,null,tituloLeyenda));  
                        
                            //this.legendas.push(new LEGENDMAP(capaUnicaID,capaUnicaName,jsonIconosRandom,null,tituloLeyenda));  
                        }
                        if(dataGlobalCapas[0]["Variable"] == "random"){
                            
                            //let nameProperties = dataGlobal.filter(x => x["descripcion_capa"] == capaUnica)[0]["Propiedad"];
                            //capaUnicaName
                            //console.log("polygono",dataGlobal.filter(x => x["descripcion_capa"] == capaUnicaName))
                            let objReferencia = dataGlobal.filter(x => x["descripcion_capa"] == capaUnicaName)[0];
                            let nameProperties = objReferencia["Propiedad"];
                            let paletaReferencia = objReferencia["Color"];                             
                            let iconoDBReferencia = dataIcono.filter(x => x["Paleta"] == paletaReferencia);
                            let propertiesUniques = [... new Set(capa["data"]["features"].map(x => x["properties"][nameProperties]))];
                            
                            let jsonIconosRandom = {}; 
                            let contadorIcono = 0;
                            //console.log("2",capaUnicaName,paletaReferencia);  
                            propertiesUniques.forEach(x =>{
                                //this.ContadorIconos++;Link
                                //jsonIconosRandom[x] = getIcon(iconosDB[this.ContadorIconos%iconosDB.length]);
                                try {
                                    jsonIconosRandom[x] = getIcon(iconoDBReferencia[contadorIcono%iconoDBReferencia.length]["Link"])
                                    contadorIcono++;
                                } catch (error) {
                                    jsonIconosRandom[x] = getIcon(dataIcono[contadorIcono]["Link"])                                    
                                }     
                            });   
                            //console.log("aka",capaUnicaName,jsonIconosRandom);
                            setIcon = (feature, latlng) => {                                
                                let descripcionCapa = feature.properties[nameProperties];
                                let myIcon = jsonIconosRandom[descripcionCapa];
                                return L.marker(latlng, { icon: myIcon });
                            }
                            
                            this.legendas.push(new LEGENDMAP(capaUnicaID,capaUnicaName,jsonIconosRandom,null,tituloLeyenda))
                        }
                    }
                    else{
                        //console.log(capaUnicaName,"no random")
                        let jsonColores = {};
                        let descripcionCapa;
                        //capaUnicaName
                        //dataGlobal.filter(x => x["descripcion_capa"] == capaUnica).forEach( x =>{
                        dataGlobal.filter(x => x["descripcion_capa"] == capaUnicaName).forEach( x =>{
                            descripcionCapa = x["Propiedad"];
                            x.Variable = x.Variable?x.Variable:"";
                            jsonColores[x.Variable] = x.url_icono
                        });   
                        setIcon = (feature, latlng) =>{
                            let valorCapa = feature.properties[descripcionCapa];
                            let myIcon;
                            try {
                                myIcon = getIcon(jsonColores[valorCapa]); 
                                return L.marker(latlng, { icon: myIcon });   
                            } catch (error) {
                                myIcon = getIcon("https://raw.githubusercontent.com/Sud-Austral/DATA_MAPA_PUBLIC_V2/main/AGUAS/Iconos/Solido1.png");
                                return L.marker(latlng, { icon: myIcon });
                            }
                        }
                        //console.log("json",jsonColores)
                        this.legendas.push(new LEGENDMAP(capaUnicaID,capaUnicaName,jsonColores,null,tituloLeyenda))
                    }  
                    /*
                    var markers = L.markerClusterGroup();
                    let shapeAux = L.geoJson(capa["data"],{onEachFeature: onEachFeatureCustom,pointToLayer: setIcon});
                    markers.addLayer(shapeAux);                 
                    this.jsonTotalCapas[capaUnica] = markers;                    
                    */
                    //console.log(capaUnicaName,capa["data"]["features"].length)
                    this.jsonTotalCapas[capaUnica] = L.geoJson(capa["data"],{onEachFeature: onEachFeatureCustom,pointToLayer: setIcon});
                    
                }
                else{
                    if(dataGlobalCapas.length == 1){
                        if(dataGlobalCapas[0]["Variable"] == "default"){
                            /*
                            color: "#00008c",
                            opacity: 0.6,
                            fillColor: '#333333',
                            fillOpacity: 0
                            */
                            let objReferencia = dataGlobal.filter(x => x["descripcion_capa"] == capaUnicaName)[0];   
                            let jsonIconosRandom = {}; 
                            let jsonIconosRandom2 = {}; 
                            //jsonIconosRandom[objReferencia["Propiedad"]] = getIcon(objReferencia["url_icono"]);
                            jsonIconosRandom[objReferencia["Propiedad"]] = objReferencia["Color"];
                            estiloDinamico = () => {
                                return {"fillOpacity":0.5,"color":jsonIconosRandom[objReferencia["Propiedad"]]}
                                //return {"color":"#000000","fillOpacity":0.5}
                            }
                            jsonIconosRandom2[capaUnicaName] = jsonIconosRandom[objReferencia["Propiedad"]]; 
                            this.legendas.push(new LEGENDMAP(capaUnicaID,capaUnicaName,null,jsonIconosRandom2,tituloLeyenda))    
                        
                            //this.legendas.push(new LEGENDMAP(capaUnicaID,capaUnicaName,null,jsonIconosRandom,tituloLeyenda))    
                        }
                        if(dataGlobalCapas[0]["Variable"] == "random"){
                            //let paletaNombre = dataGlobalCapas[0]["Paleta"]; 
                            //let nameProperties = dataGlobal.filter(x => x["descripcion_capa"] == capaUnica)[0]["Propiedad"];
                            //capaUnicaName
                            //let nameProperties = dataGlobal.filter(x => x["descripcion_capa"] == capaUnicaName)[0]["Propiedad"];
                            let objReferencia = dataGlobal.filter(x => x["descripcion_capa"] == capaUnicaName)[0];
                            let nameProperties = objReferencia["Propiedad"];
                            let paletaReferencia = objReferencia["Color"];
                            let colorDBReferencia = dataColor.filter(x => x["Paleta"] == paletaReferencia);
                            //console.log(colorDBReferencia);

                            let propertiesUniques = [... new Set(capa["data"]["features"].map(x => x["properties"][nameProperties]))];
                            let jsonColoresRandom = {}; 
                            let contadorColor = 0;                           
                            propertiesUniques.forEach(x =>{
                                //this.ContadorColores++;
                                //jsonColoresRandom[x] = "#" + coloresDB[this.ContadorColores%coloresDB.length]
                                try {
                                    jsonColoresRandom[x] = colorDBReferencia[contadorColor%colorDBReferencia.length]["Color"];
                                    contadorColor++;
                                } catch (error) {
                                    jsonColoresRandom[x] = dataColor[contadorColor]["Color"];
                                }                                
                            });
                            estiloDinamico = (feature) => {
                                let descripcionCapa = feature.properties[nameProperties];
                                return {"fillOpacity":0.5,"color":jsonColoresRandom[descripcionCapa]}
                            }

                            this.legendas.push(new LEGENDMAP(capaUnicaID,capaUnicaName,null,jsonColoresRandom,tituloLeyenda))
                        }
                    }
                    else{
                        //console.log("Mira aka",capaUnica)
                        //console.log(dataGlobal)
                        //console.log(dataGlobal.filter(x => x["descripcion_capa"] == capaUnica))
                        let jsonColores = {};
                        let descripcionCapa;
                        dataGlobal.filter(x => x["descripcion_capa"] == capaUnicaName).forEach( x =>{
                            descripcionCapa = x["Propiedad"];
                            x.Variable = x.Variable?x.Variable:""; 
                            jsonColores[x.Variable] = x.Color
                        });
                        //console.log(jsonColores)
                        estiloDinamico = (feature) =>{
                            let valuePropertie = feature.properties[descripcionCapa];
                            return {"fillOpacity":0.5,"color":jsonColores[valuePropertie]}
                        }
                        this.legendas.push(new LEGENDMAP(capaUnicaID,capaUnicaName,null,jsonColores,tituloLeyenda));
                        }
                        this.jsonTotalCapas[capaUnica] = L.geoJson(capa["data"],{style:estiloDinamico,onEachFeature: onEachFeatureCustom});
                }
            });
        });        
        this.controlTotalCapas1 = L.control.layers(comunaBase.mapasBases, null, {
            position: 'topright',
            collapsed:  true
        }).addTo(map);
        this.controlTotalCapas2 = L.control.layers(null, this.jsonTotalCapas, {
            position: 'topright',
            collapsed:  true
        }).addTo(map);
        $('.op1').on('click', function(){
            comunaBase["mapasBases"]["Mapa Oscuro"].remove();
            comunaBase["mapasBases"]["Mapa Satelital"].remove();
            comunaBase["mapasBases"]["Mapa claro"].addTo(map);
        });
        $('.op2').on('click', function(){
            comunaBase["mapasBases"]["Mapa claro"].remove();
            comunaBase["mapasBases"]["Mapa Satelital"].remove();
            comunaBase["mapasBases"]["Mapa Oscuro"].addTo(map);
        });
        $('.op3').on('click', function(){
            comunaBase["mapasBases"]["Mapa claro"].remove();
            comunaBase["mapasBases"]["Mapa Oscuro"].remove();
            comunaBase["mapasBases"]["Mapa Satelital"].remove();
            comunaBase["mapasBases"]["Mapa Satelital"].addTo(map);
        });
        this.legendas.forEach(x => x.setLegenda());      
    }
}

//let detalle = new MAPAGLOBAL();
let comunaBase = new COMUNABASE();
let detalle = new MAPAGLOBAL(comunaBase); 


//let bandera = true;

let base = comunaBase["mapasBases"]["Mapa claro"];
let base2 = comunaBase["mapasBases"]["Mapa Oscuro"]; 
let base3 = comunaBase["mapasBases"]["Mapa Satelital"];

//console.log($(".leaflet-control-layers-toggle").eq(1).css("background-color","#FFA07A"))//.css("background-color","black") //[0]//].css("background-color","black")







