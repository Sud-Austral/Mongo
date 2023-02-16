/*
////////////////////////////////////////////
////////////////////////////////////////////

            UTIL

////////////////////////////////////////////
////////////////////////////////////////////
*/
let acumuladorGlobal = []
class UTIL {    
    //static longDescription;
    //static description = 'I square the triple of any number you provide';
    static setCapa(url,name,controlGlobalCapa) {
        $.get({
            url: url,
            error: () => {console.log("No File in " + url);
            var today2 = new Date();
            var now2 = today2.toLocaleString();
            console.log("final",name,now2);},
            success: () => console.log("Conected...")
        })
        .done(
            data => {
                if(data){
                    let final = JSON.parse(data);
                    let capa = L.geoJson(final);//.addTo(map);
                    controlGlobalCapa.setCapa(capa,name)
                    var today2 = new Date();
                    var now2 = today2.toLocaleString();
                    console.log("inicio",name,now2);
                }          
            }
        )
    }
    /*
    Capa
    Tipo
    idcapa
    url
    urlData
    url_ícono
    */
    static setCapa2(capa,controlGlobalCapa, globalComuna, comunaRef) {
        //console.log(comunaRef)
        let comunaID = comunaRef.codigo_comuna;
        let codComuna = comunaRef.codigo_comuna;
        let nameComuna = comunaRef.comunaName;
        //console.log(codComuna,nameComuna)
        $.get({
            url: capa.urlData,
            error: () => console.log("No File in " + capa.urlData),
            success: () => console.log("Conected.." + url)
        })
        .done(
            data => {
                if(!data){
                    return null;
                }
                capa.data = JSON.parse(data);
                //console.log("Data",capa.data)
                let dataGlobalNivel2 = dataGlobal.filter( capaGlobal =>
                    capaGlobal.idcapa == capa.idcapa
                );
                

                let dataGlobalDescripCapaUnique = [...new Set(dataGlobalNivel2
                                            .filter(x => x.popup_0_1 != null)
                                            .sort((x,y) => {return x["posición_capa"] - y["posición_capa"]})
                                            .map(x => x.descripcion_capa)
                                            .filter(x => x)
                                            )];
                let dataGlobalPropiedadesUnique = [... new Set(dataGlobalNivel2.sort( x=> x.posicion_popup).map(x => x.Propiedad))]
                let diccionarioNombrePropiedadPopup = {}
                dataGlobalNivel2.forEach(x => diccionarioNombrePropiedadPopup[x.Propiedad] = x["descripcion_pop-up"]);
                let onEachFeatureCustom = (feature, layer) =>{
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
                let tipoGeometria = capa["data"]["features"][0]["geometry"]["type"];
                ///////////////////////////////////////////////////
                ///////////////////////////////////////////////////
                ///////////////////////////////////////////////////
                dataGlobalDescripCapaUnique.sort(x => x["posición_capa"]).forEach(capaUnica =>{
                    let capaUnicaID = removeAccents(capaUnica+ "_" + codComuna);
                    let capaUnicaName = capaUnica;
                    capaUnica = `<span id='${capaUnicaID}'>${capaUnica}-${nameComuna}</span>`;
                    let estiloDinamico = null;
                    let dataGlobalCapas = dataGlobalNivel2.filter(x => x["descripcion_capa"] == capaUnicaName);
                    let tituloLeyenda = "<b>" + nameComuna + ":</b> " + dataGlobalCapas[0]["titulo_leyenda"];
                    let legend = null;
                    let flag = false;
                    
                    if(tipoGeometria == "Point"){
                        let setIcon;                 
                        if(dataGlobalCapas.length == 1){                        
                            if(dataGlobalCapas[0]["Variable"] == "default"){
                                let objReferencia = dataGlobal.filter(x => x["descripcion_capa"] == capaUnicaName)[0];   
                                let jsonIconosRandom = {};
                                let jsonIconosRandom2 = {}; 
                                jsonIconosRandom[objReferencia["Propiedad"]] = getIcon(objReferencia["url_icono"]);
                                setIcon = (feature,latlng) => {
                                    return L.marker(latlng, { icon: jsonIconosRandom[objReferencia["Propiedad"]] });
                                }
                                jsonIconosRandom2[capaUnicaName] = jsonIconosRandom[objReferencia["Propiedad"]]; 
                                //this.legendas.push(new LEGENDMAP(capaUnicaID,capaUnicaName,jsonIconosRandom2,null,tituloLeyenda));  
                                legend = new LEGENDMAP(capaUnicaID,capaUnicaName,jsonIconosRandom2,null,tituloLeyenda);  
                                flag = true;
                                legend.setLegenda()
                            }
                            if(dataGlobalCapas[0]["Variable"] == "random"){
                                let objReferencia = dataGlobal.filter(x => x["descripcion_capa"] == capaUnicaName)[0];
                                let nameProperties = objReferencia["Propiedad"];
                                let paletaReferencia = objReferencia["Color"];                             
                                let iconoDBReferencia = dataIcono.filter(x => x["Paleta"] == paletaReferencia);
                                let propertiesUniques = [... new Set(capa["data"]["features"].map(x => x["properties"][nameProperties]))];
                                
                                let jsonIconosRandom = {}; 
                                let contadorIcono = 0;
                                propertiesUniques.forEach(x =>{
                                    try {
                                        jsonIconosRandom[x] = getIcon(iconoDBReferencia[contadorIcono%iconoDBReferencia.length]["Link"])
                                        contadorIcono++;
                                    } catch (error) {
                                        jsonIconosRandom[x] = getIcon(dataIcono[contadorIcono]["Link"])                                    
                                    }     
                                }); 
                                setIcon = (feature, latlng) => {                                
                                    let descripcionCapa = feature.properties[nameProperties];
                                    let myIcon = jsonIconosRandom[descripcionCapa];
                                    return L.marker(latlng, { icon: myIcon });
                                }                                
                                //this.legendas.push(new LEGENDMAP(capaUnicaID,capaUnicaName,jsonIconosRandom,null,tituloLeyenda))
                                legend = new LEGENDMAP(capaUnicaID,capaUnicaName,jsonIconosRandom,null,tituloLeyenda);
                                flag = true;
                                legend.setLegenda()
                            }
                        }
                        else{
                            let jsonColores = {};
                            let descripcionCapa;
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
                            //this.legendas.push(new LEGENDMAP(capaUnicaID,capaUnicaName,jsonColores,null,tituloLeyenda))
                            legend = new LEGENDMAP(capaUnicaID,capaUnicaName,jsonColores,null,tituloLeyenda);
                            flag = true;
                            legend.setLegenda()
                        }
                        
                        //this.jsonTotalCapas[capaUnica] = L.geoJson(capa["data"],{onEachFeature: onEachFeatureCustom,pointToLayer: setIcon});  
                        let geojson = L.geoJson(capa["data"],{onEachFeature: onEachFeatureCustom,pointToLayer: setIcon})
                        //console.log(capaUnicaName)
                        globalComuna.arrayGeometrias.push({"mapa":geojson,"data":capa["data"],"comuna":comunaID,"capa":capaUnicaName})
                        controlGlobalCapa.setCapa(geojson,capaUnica)       
                    }
                    else{ 
                          
                        if(dataGlobalCapas[0]["Variable"] == "auxiliar"){
                            //console.log("Entramos bien",dataGlobalCapas)
                            estiloDinamico = (feature) => {
                                return {"fillOpacity":0.7,"opacity":0.75,"color":feature["properties"]["Color"]}
                            }
                            let jsonIconosRandom2 = {}
                            let propiedades = capa["data"]["features"].map(x => x["properties"])
                            let propiedadesColorClase = propiedades.map(x => {
                                let salida = {};
                                salida["Color"] = x["Color"];
                                salida["Clase Final"] = x["Clase Final"]
                                return salida;}).sort((x,y) => x["Clase Final"] > y["Clase Final"]? 1 : -1);
                            
                            
                            propiedadesColorClase.forEach( x => {
                                let nombreClaseFinal = x["Clase Final"];
                                if(!jsonIconosRandom2[nombreClaseFinal]){
                                    jsonIconosRandom2[nombreClaseFinal] = x["Color"];
                                }                                
                            });
                            legend = new LEGENDMAP(capaUnicaID,capaUnicaName,null,jsonIconosRandom2,tituloLeyenda);
                            let geojson = L.geoJson(capa["data"],{style:estiloDinamico,onEachFeature: onEachFeatureCustom})
                            //console.log(capaUnicaName)
                            globalComuna.arrayGeometrias.push({"mapa":geojson,"data":capa["data"],"comuna":comunaID,"capa":capaUnicaName})
                            controlGlobalCapa.setCapa(geojson,capaUnica)  

                            //controlGlobalCapa.setCapa(L.geoJson(capa["data"],{style:estiloDinamico,onEachFeature: onEachFeatureCustom}),capaUnica)
                            setTimeout(() => legend.setLegenda(), 5000);
                            return
                        }                    

                        if(dataGlobalCapas.length == 1){
                            if(dataGlobalCapas[0]["Variable"] == "default"){
                                /* color: "#00008c",
                                opacity: 0.6,
                                fillColor: '#333333',
                                fillOpacity: 0 */
                                let objReferencia = dataGlobal.filter(x => x["descripcion_capa"] == capaUnicaName)[0];   
                                let jsonIconosRandom = {}; 
                                let jsonIconosRandom2 = {}; 
                                //jsonIconosRandom[objReferencia["Propiedad"]] = getIcon(objReferencia["url_icono"]);
                                jsonIconosRandom[objReferencia["Propiedad"]] = objReferencia["Color"];
                                estiloDinamico = () => {
                                    return {"fillOpacity":0.5,"color":jsonIconosRandom[objReferencia["Propiedad"]]}
                                }
                                jsonIconosRandom2[capaUnicaName] = jsonIconosRandom[objReferencia["Propiedad"]]; 
                                
                                
                                //this.legendas.push(new LEGENDMAP(capaUnicaID,capaUnicaName,null,jsonIconosRandom2,tituloLeyenda))    
                                legend = new LEGENDMAP(capaUnicaID,capaUnicaName,null,jsonIconosRandom2,tituloLeyenda);
                                flag = true;
                                legend.setLegenda()
                            }
                            if(dataGlobalCapas[0]["Variable"] == "random"){
                                let objReferencia = dataGlobal.filter(x => x["descripcion_capa"] == capaUnicaName)[0];
                                let nameProperties = objReferencia["Propiedad"];
                                let paletaReferencia = objReferencia["Color"];
                                let colorDBReferencia = dataColor.filter(x => x["Paleta"] == paletaReferencia);
                                let propertiesUniques = [... new Set(capa["data"]["features"].map(x => x["properties"][nameProperties]))];
                                let jsonColoresRandom = {}; 
                                let contadorColor = 0;                           
                                propertiesUniques.forEach(x =>{
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
                                //console.log(2,nameProperties,capa["data"]["features"])
                                //this.legendas.push(new LEGENDMAP(capaUnicaID,capaUnicaName,null,jsonColoresRandom,tituloLeyenda))
                                legend = new LEGENDMAP(capaUnicaID,capaUnicaName,null,jsonColoresRandom,tituloLeyenda);
                                flag = true;
                                legend.setLegenda()
                            }
                        }
                        else{
                            let jsonColores = {};
                            let descripcionCapa;
                            dataGlobal.filter(x => x["descripcion_capa"] == capaUnicaName).forEach( x =>{
                                descripcionCapa = x["Propiedad"];
                                x.Variable = x.Variable?x.Variable:""; 
                                jsonColores[x.Variable] = x.Color
                            });
                            estiloDinamico = (feature) =>{
                                let valuePropertie = feature.properties[descripcionCapa];
                                return {"fillOpacity":0.5,"color":jsonColores[valuePropertie]}
                            }
                            //this.legendas.push(new LEGENDMAP(capaUnicaID,capaUnicaName,null,jsonColores,tituloLeyenda));
                            legend = new LEGENDMAP(capaUnicaID,capaUnicaName,null,jsonColores,tituloLeyenda)
                            flag = true;
                            legend.setLegenda()
                        }
                            //this.jsonTotalCapas[capaUnica] = L.geoJson(capa["data"],{style:estiloDinamico,onEachFeature: onEachFeatureCustom});
                            let geojson = L.geoJson(capa["data"],{style:estiloDinamico,onEachFeature: onEachFeatureCustom});
                            //console.log(capaUnicaName)
                            globalComuna.arrayGeometrias.push({"mapa":geojson,"data":capa["data"],"comuna":comunaID,"capa":capaUnicaName})
                            controlGlobalCapa.setCapa(geojson,capaUnica)
                        //controlGlobalCapa.setCapa(L.geoJson(capa["data"],{style:estiloDinamico,onEachFeature: onEachFeatureCustom}),capaUnica)  
                    }
                    setTimeout(() => legend.setLegenda(), 5000); 
                });           
            }
        )
    }
}

class MapBase{
    constructor(){
        this.mapasBases = getMapaBase();
        //"<span class='BaseID'>Mapa claro</span>"
        //let htmlString = "<span class='BaseID'>Mapa claro</span>";
        this.mapasBases["Mapa claro"].addTo(map);
        this.controlMapaBases = L.control.layers(this.mapasBases,null , {
            position: 'topright',
            collapsed:  true
        }).addTo(map); 
    }   
}

class COMUNABASE{
    constructor(codComuna,controlComuna){
        //Mapas Bases de Diferentes Fuentes

        //this.mapasBases = getMapaBase();

        //Set Primer mapas base al mapa Leaflet
        //this.mapasBases["Mapa claro"].addTo(map);
        //Obtener Comuna
        //this.codigo_comuna = getComuna();
        this.codigo_comuna = codComuna;
        //URL de los datos de Comuna
        this.urlBaseComuna = `https://raw.githubusercontent.com/Sud-Austral/DATA_MAPA_PUBLIC_V2/main/chile_comunas/${this.codigo_comuna}.json`;
        //Get Data de Comuna
        this.dataBaseComuna = getData(this.urlBaseComuna);
        let nombreComuna = this.dataBaseComuna["features"][0]["properties"]["COMUNA"];
        //Get Shape de Comuna
        var dictColor = {0:"red",1:"blue",2:"yellow",3:"green",4:"black"}
        var estiloDinamico = (feature) =>{
            let color = feature["properties"]["Pob_0_5"];
            return {"fillOpacity":0.7,"opacity":0.75,"color":dictColor[color]}
        }
        this.shapeBaseComuna = L.geoJson(this.dataBaseComuna,{
            style: style,
            //style:estiloDinamico,
            onEachFeature: onEachFeature            
        }).addTo(map);
        this.comunaName = nombreComuna; 
        nombreComuna = `<span class="comunaID"> ${nombreComuna} </span>`.toString();
        this.jsonComuna = {};
        this.jsonComuna[nombreComuna] = this.shapeBaseComuna;
        controlComuna.addOverlay(this.shapeBaseComuna,nombreComuna);
        //map.fitBounds(this.shapeBaseComuna.getBounds());
        //let zoom = map.getZoom();
        //let zoomMin = 10
        //map.setZoom(zoom > zoomMin ? zoomMin : zoom); 
        //map.setZoom(7);  
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
        this.legend = L.control({ position: 'bottomright' });
        this.legend.onAdd = function () {
            var div = L.DomUtil.create('div', 'legend');
            div.style = "display:none"
            return div;
        };
    }
    setLegenda_DEPRECATED(){
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

            //let htmlMinimize = `<i id="clickme" class="gg-minimize-alt"> </i>`; height="40" width="40"
            let htmlMinimize = '<img id="clickme" src="Content/img/min.png" alt="imagen minimizar"></img><img id="clickme2" src="Content/img/max.png" alt="imagen maximizar"></img>';
            div.innerHTML +=
            '<div class="legendCustom">' + 
            `<div class="contenedor container"><div class="row"> <div class="principal2 col-10"> <p class="titleLegend principal"><b>${titulo}</b></p></div><div onclick="slideToggleLegend('${idName}_slide',this);" class="sidebar2 col-2">${htmlMinimize}</div></div></div> `+
            //'<span class="desc1" style="background: #e82c2c;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>'+
            `<div id="${idName}_slide"> ${htmlString}</div>` +
            '</div>';
            return div;
        };
        /*
        $(`#${this.idName}`).parent().parent().parent().find("input").change(() => {
            let check = $(`#${this.idName}`).parent().parent().parent().find("input").prop("checked");
            check?this.legend.addTo(map):this.legend.remove();
        });
        */        
    }
}

class ControlGlobalCapa{
    
    constructor(){
        this.controlGlobalCapa = L.control.layers(null, null, {
            position: 'topright',
            collapsed:  true
        }).addTo(map);
    }

    setCapa(capa,name){
        try {
            this.controlGlobalCapa.addOverlay(capa,name);
        } catch (error) {
            console.log("Error Capa")            
        }
        
    }
}

class MAPAGLOBAL{
    constructor(comunaBase,controlGlobalCapa){ 
        
        this.arrayGeometrias = []         
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
        //console.log(comunaBase)
        this.dataGlobalNivel1 = dataCapaGlobal.map(capa => {
            capa["urlData"] = `${capa.url.split("?")[0]}${comunaBase.codigo_comuna}.json`;
            
            try {
                //capa["data"] = getData(capa["urlData"]);
                //console.log(capa)
                /*
                Capa
                Tipo
                idcapa
                url
                urlData
                url_ícono
                */
                UTIL.setCapa2(capa,controlGlobalCapa,this,comunaBase); 
            } catch (error) {
                console.log("Error"+error)
            }            
            return capa;
        });
        /*
        .filter( capa =>
            capa["data"] != null
        );
        */
    }
}


class MultiMap{
    constructor(){
        let urlBaseComuna = `https://raw.githubusercontent.com/Sud-Austral/mapa_insumos/main/vigilancia/cuenca_biobio.geojson`;
        //Get Data de Comuna
        let dataBaseComuna = getData(urlBaseComuna);
        //Get Shape de Comuna
        let shapeBaseComuna = L.geoJson(dataBaseComuna,{
            style: {"color":"blue"},
            onEachFeature: onEachFeature            
        }).addTo(map);
        //map.fitBounds(shapeBaseComuna.geometry());


        this.diccionarioMaster = {}; 
        this.leyendMaster = {};
        let mapaBase = new MapBase();
        
        //let controlCapa =  new ControlGlobalCapa();
        let controlCapa = this.controlGlobalCapa = L.control.layers(null, null, {
            position: 'topright',
            collapsed:  true
        });
        this.controlCapa = controlCapa;


        //= controlGlobalCapa
        let controlComuna  = L.control.layers(null, this.jsonComuna, {
            position: 'topright', // 'topleft', 'bottomleft', 'bottomright'
            collapsed: true // true
        }).addTo(map);
        let comunas = getComuna2();
        this.multimapas = comunas
        /*[
            "13101" //,"13102" //,"13103","13104"//,"13105","13106","13107","13108",
        //"13109","13110","13111","13112","13113","13114","13115","13116",
        //"13117","13118","13119","13120","13121","13122","13123","13124"
           ]*/
           .map(x => {
                let comuna = new COMUNABASE(x,controlComuna);   
                let global = null;//new MAPAGLOBAL(comuna,controlCapa);
                return {"comuna":comuna,"global":global,"codComuna":x}
                //return null
        });
        map.fitBounds(shapeBaseComuna.getBounds());

        let nombre = dataBaseComuna["features"][0]["properties"]["NOMBRE"]
        let diccionario = {}
        diccionario[nombre] = shapeBaseComuna;
        L.control.layers(null, diccionario, {
            position: 'topright', // 'topleft', 'bottomleft', 'bottomright'
            collapsed: true // true
        }).addTo(map);

        /*
        let controlComunaBaseCuenca = L.control.layers(null, {"Cuenca":this.shapeBaseComuna}, {
            position: 'topleft', // 'topleft', 'bottomleft', 'bottomright'
            collapsed: false // true
        }).addTo(map);
        */
        //controlComuna.addOverlay(this.shapeBaseComuna,nombreComuna);


    }

    showLegend(idLeyenda){
        //console.log("showleyenda",idLeyenda);
        //this.leyendMaster[idLeyenda].addTo(map);
        //console.log(this.leyendMaster[idLeyenda])    //.legend.addTo(map));
        if(this.leyendMaster[idLeyenda].estado){
            this.leyendMaster[idLeyenda].leyenda.legend.addTo(map);
            this.leyendMaster[idLeyenda].estado = false;
        }
        else{
            this.leyendMaster[idLeyenda].leyenda.legend.remove();
            this.leyendMaster[idLeyenda].estado = true;
        }
    }

    hideLegend(idLeyenda){
        console.log("showleyenda",idLeyenda);
        this.leyendMaster[idLeyenda].remove();
    }

    setDiccionarioMater(name, capa){
        this.diccionarioMaster[name] = capa;
        return true;
    }

    getArrayReferencia(idNombre){
        //console.log(idNombre)
        return dataGlobal.filter(x => removeAccents(x["descripcion_capa"]) == idNombre);
    }

    getURL(idNombre,comuna){
        let arrayReferencia = this.getArrayReferencia(idNombre);
        
        let referencia = dataCapaGlobal.filter(x => x.idcapa == arrayReferencia[0].idcapa)[0];
        referencia["url"] = referencia["url"]
                                .replaceAll("github.com","raw.githubusercontent.com")
                                .replaceAll("tree","");
        referencia["urlData"] = `${referencia.url.split("?")[0]}${comuna}.json`;
        return referencia;
    }

    activateCapa(idCapa,comuna){
        let idCapaComuna = idCapa + comuna;
        if(this.diccionarioMaster[idCapaComuna]){
            let capaID = "#"+idCapa + comuna;
            $(capaID).trigger("click");   
        }
        else{
            let comunaBase = this.multimapas.filter(x => x.codComuna == comuna)[0];
            this.buildCapa(comunaBase.comuna,this.getURL(idCapa,comuna),idCapa);
        }
    }

    buildCapa(comunaRef,referencia,IDCAPA){
        $(".loader").show();
        
        //$(".loader").fadeOut("slow");
        let comunaID = comunaRef.codigo_comuna;
        let codComuna = comunaRef.codigo_comuna;
        let nameComuna = comunaRef.comunaName;
        let dataComunas = [];
        $.get({
            url: referencia.urlData,
            error: () => console.log("No File in " + referencia.urlData),
            //success: () => console.log("Conected..."+referencia.urlData)
            success: () => console.log("Conected...")
        }).done(
            data =>{
                let capa = referencia;
                if(!data){
                    console.log("No data")
                    return null;
                }
                let dataJson = JSON.parse(data);
                
                //console.log("Clase",dataJson,comunaRef,referencia.urlData)
                //console.log("Gran referencia",referencia)
                capa["data"] = dataJson;
                let objetoCapa = {};
                objetoCapa["data"] = dataJson;
                //console.log("Gran referencia",dataJson)
                
                let dataGlobalNivel2 = dataGlobal.filter( capaGlobal =>
                    capaGlobal.idcapa == capa.idcapa
                );
                let dataGlobalDescripCapaUnique = [...new Set(dataGlobalNivel2
                    .filter(x => x.popup_0_1 != null)
                    .sort((x,y) => {return x["posición_capa"] - y["posición_capa"]})
                    .map(x => x.descripcion_capa)
                    .filter(x => x)
                )];
                let dataGlobalPropiedadesUnique = [... new Set(dataGlobalNivel2.sort( x=> x.posicion_popup).map(x => x.Propiedad))]
                
                let diccionarioNombrePropiedadPopup = {}
                dataGlobalNivel2.forEach(x => diccionarioNombrePropiedadPopup[x.Propiedad] = x["descripcion_pop-up"]);
                let onEachFeatureCustom = (feature, layer) =>{
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
                let tipoGeometria = capa["data"]["features"][0]["geometry"]["type"];
                let arraForEach = dataGlobalDescripCapaUnique
                                    .sort(x => x["posición_capa"])
                                    .filter(x => removeAccents(x) == IDCAPA);
                //console.log("unicos",dataGlobal.filter(x => x["descripcion_capa"] == arraForEach[0])[0]["Propiedad"])
                let propiedadGlobal = dataGlobal.filter(x => x["descripcion_capa"] == arraForEach[0])[0]; //["Propiedad"];
                let descripcionGlobal = arraForEach[0]; 
                capa["data"]["propiedadGlobal"] = propiedadGlobal;
                capa["data"]["descripcionGlobal"] = descripcionGlobal;
                objetoCapa["data"]["propiedadGlobal"] = propiedadGlobal;
                objetoCapa["data"]["descripcionGlobal"] = descripcionGlobal;

                general2.addDataLayer(objetoCapa,comunaRef);
                let dataLayerGlobal = capa["data"];
                acumuladorGlobal.push({"data":dataLayerGlobal,
                    "propiedad":dataGlobal.filter(x => x["descripcion_capa"] == arraForEach[0])[0]["Propiedad"],
                    "descripcion":arraForEach[0]});
                return 
                


                //console.log("Data",propiedadGlobal,descripcionGlobal,capa["data"])
                acumuladorGlobal.push({"data":dataLayerGlobal,
                    "propiedad":dataGlobal.filter(x => x["descripcion_capa"] == arraForEach[0])[0]["Propiedad"],
                    "descripcion":arraForEach[0]});
                arraForEach.forEach(capaUnica =>{
                    let capaUnicaID = removeAccents(capaUnica+ "_" + codComuna);
                    let capaUnicaName = capaUnica;
                    capaUnica = `<span onclick="general.showLegend('${capaUnicaID}')" id='${capaUnicaID}'>${capaUnica}-${nameComuna}</span>`;
                    let estiloDinamico = null;
                    let dataGlobalCapas = dataGlobalNivel2.filter(x => x["descripcion_capa"] == capaUnicaName);
                    let tituloLeyenda = "<b>" + nameComuna + ":</b> " + dataGlobalCapas[0]["titulo_leyenda"];
                    let legend = null;
                    let flag = false;
                    
                    if(tipoGeometria == "Point"){
                        let setIcon;                 
                        if(dataGlobalCapas.length == 1){                        
                            if(dataGlobalCapas[0]["Variable"] == "default"){
                                let objReferencia = dataGlobal.filter(x => x["descripcion_capa"] == capaUnicaName)[0];   
                                let jsonIconosRandom = {};
                                let jsonIconosRandom2 = {}; 
                                jsonIconosRandom[objReferencia["Propiedad"]] = getIcon(objReferencia["url_icono"]);
                                setIcon = (feature,latlng) => {
                                    return L.marker(latlng, { icon: jsonIconosRandom[objReferencia["Propiedad"]] });
                                }
                                jsonIconosRandom2[capaUnicaName] = jsonIconosRandom[objReferencia["Propiedad"]]; 
                                //this.legendas.push(new LEGENDMAP(capaUnicaID,capaUnicaName,jsonIconosRandom2,null,tituloLeyenda));  
                                legend = new LEGENDMAP(capaUnicaID,capaUnicaName,jsonIconosRandom2,null,tituloLeyenda);  
                                this.leyendMaster[IDCAPA+comunaID] = {"leyenda":legend, "estado":true}
                                flag = true;
                                legend.setLegenda()
                            }
                            if(dataGlobalCapas[0]["Variable"] == "random"){
                                
                                let objReferencia = dataGlobal.filter(x => x["descripcion_capa"] == capaUnicaName)[0];
                                let nameProperties = objReferencia["Propiedad"];
                                let paletaReferencia = objReferencia["Color"];                             
                                let iconoDBReferencia = dataIcono.filter(x => x["Paleta"] == paletaReferencia);
                                
                                //console.log("Aki debio pasar",objReferencia,iconoDBReferencia);
                                let propertiesUniques = [... new Set(capa["data"]["features"].map(x => x["properties"][nameProperties]))];
                                
                                let jsonIconosRandom = {}; 
                                let contadorIcono = 0;
                                propertiesUniques.forEach(x =>{
                                    try {
                                        jsonIconosRandom[x] = getIcon(iconoDBReferencia[contadorIcono%iconoDBReferencia.length]["Link"])
                                        contadorIcono++;
                                    } catch (error) {
                                        jsonIconosRandom[x] = getIcon(dataIcono[contadorIcono]["Link"])                                    
                                    }     
                                }); 
                                setIcon = (feature, latlng) => {                                
                                    let descripcionCapa = feature.properties[nameProperties];
                                    let myIcon = jsonIconosRandom[descripcionCapa];
                                    return L.marker(latlng, { icon: myIcon });
                                }                                
                                //this.legendas.push(new LEGENDMAP(capaUnicaID,capaUnicaName,jsonIconosRandom,null,tituloLeyenda))
                                legend = new LEGENDMAP(capaUnicaID,capaUnicaName,jsonIconosRandom,null,tituloLeyenda);
                                flag = true;
                                this.leyendMaster[IDCAPA+comunaID] = {"leyenda":legend, "estado":true}
                                legend.setLegenda()
                            }
                        }
                        else{
                            let jsonColores = {};
                            let descripcionCapa;
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
                            //this.legendas.push(new LEGENDMAP(capaUnicaID,capaUnicaName,jsonColores,null,tituloLeyenda))
                            legend = new LEGENDMAP(capaUnicaID,capaUnicaName,jsonColores,null,tituloLeyenda);
                            flag = true;
                            this.leyendMaster[IDCAPA+comunaID] = {"leyenda":legend, "estado":true}
                            legend.setLegenda()
                        }
                        
                        //this.jsonTotalCapas[capaUnica] = L.geoJson(capa["data"],{onEachFeature: onEachFeatureCustom,pointToLayer: setIcon});  
                        let geojson = L.geoJson(capa["data"],{onEachFeature: onEachFeatureCustom,pointToLayer: setIcon})
                        //console.log(capaUnicaName)
                        //globalComuna.arrayGeometrias.push({"mapa":geojson,"data":capa["data"],"comuna":comunaID,"capa":capaUnicaName})
                        //controlGlobalCapa.setCapa(geojson,capaUnica)  
                        this.diccionarioMaster[IDCAPA+comunaID] = geojson
                        this.controlCapa.setCapa(geojson,capaUnica) 
                    }
                    else{ 
                          
                        if(dataGlobalCapas[0]["Variable"] == "auxiliar"){
                            //console.log("Entramos bien",dataGlobalCapas)
                            estiloDinamico = (feature) => {
                                return {"fillOpacity":0.7,"opacity":0.75,"color":feature["properties"]["Color"]}
                            }
                            let jsonIconosRandom2 = {}
                            let propiedades = capa["data"]["features"].map(x => x["properties"])
                            let propiedadesColorClase = propiedades.map(x => {
                                let salida = {};
                                salida["Color"] = x["Color"];
                                salida["Clase Final"] = x["Clase Final"]
                                return salida;}).sort((x,y) => x["Clase Final"] > y["Clase Final"]? 1 : -1);
                            
                            
                            propiedadesColorClase.forEach( x => {
                                let nombreClaseFinal = x["Clase Final"];
                                if(!jsonIconosRandom2[nombreClaseFinal]){
                                    jsonIconosRandom2[nombreClaseFinal] = x["Color"];
                                }                                
                            });
                            legend = new LEGENDMAP(capaUnicaID,capaUnicaName,null,jsonIconosRandom2,tituloLeyenda);
                            this.leyendMaster[IDCAPA+comunaID] = {"leyenda":legend, "estado":true}
                            let geojson = L.geoJson(capa["data"],{style:estiloDinamico,onEachFeature: onEachFeatureCustom})
                            //console.log(capaUnicaName)
                            //globalComuna.arrayGeometrias.push({"mapa":geojson,"data":capa["data"],"comuna":comunaID,"capa":capaUnicaName})
                            //controlGlobalCapa.setCapa(geojson,capaUnica)  
                            this.diccionarioMaster[IDCAPA+comunaID] = geojson
                            this.controlCapa.setCapa(geojson,capaUnica)
                            //controlGlobalCapa.setCapa(L.geoJson(capa["data"],{style:estiloDinamico,onEachFeature: onEachFeatureCustom}),capaUnica)
                            //setTimeout(() => legend.setLegenda(), 5000);
                            setTimeout(() => this.leyendMaster[IDCAPA+comunaID].leyenda.setLegenda(), 5000);
                            return
                        }                    

                        if(dataGlobalCapas.length == 1){
                            if(dataGlobalCapas[0]["Variable"] == "default"){
                                /* color: "#00008c",
                                opacity: 0.6,
                                fillColor: '#333333',
                                fillOpacity: 0 */
                                let objReferencia = dataGlobal.filter(x => x["descripcion_capa"] == capaUnicaName)[0];   
                                let jsonIconosRandom = {}; 
                                let jsonIconosRandom2 = {}; 
                                //jsonIconosRandom[objReferencia["Propiedad"]] = getIcon(objReferencia["url_icono"]);
                                jsonIconosRandom[objReferencia["Propiedad"]] = objReferencia["Color"];
                                estiloDinamico = () => {
                                    return {"fillOpacity":0.5,"color":jsonIconosRandom[objReferencia["Propiedad"]]}
                                }
                                jsonIconosRandom2[capaUnicaName] = jsonIconosRandom[objReferencia["Propiedad"]]; 
                                
                                
                                //this.legendas.push(new LEGENDMAP(capaUnicaID,capaUnicaName,null,jsonIconosRandom2,tituloLeyenda))    
                                legend = new LEGENDMAP(capaUnicaID,capaUnicaName,null,jsonIconosRandom2,tituloLeyenda);
                                this.leyendMaster[IDCAPA+comunaID] = {"leyenda":legend, "estado":true}
                                flag = true;
                                legend.setLegenda()
                            }
                            if(dataGlobalCapas[0]["Variable"] == "random"){
                                let objReferencia = dataGlobal.filter(x => x["descripcion_capa"] == capaUnicaName)[0];
                                let nameProperties = objReferencia["Propiedad"];
                                let paletaReferencia = objReferencia["Color"];
                                let colorDBReferencia = dataColor.filter(x => x["Paleta"] == paletaReferencia);
                                let propertiesUniques = [... new Set(capa["data"]["features"].map(x => x["properties"][nameProperties]))];
                                let jsonColoresRandom = {}; 
                                let contadorColor = 0;                           
                                propertiesUniques.forEach(x =>{
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
                                //console.log(2,nameProperties,capa["data"]["features"])
                                //this.legendas.push(new LEGENDMAP(capaUnicaID,capaUnicaName,null,jsonColoresRandom,tituloLeyenda))
                                legend = new LEGENDMAP(capaUnicaID,capaUnicaName,null,jsonColoresRandom,tituloLeyenda);
                                this.leyendMaster[IDCAPA+comunaID] = {"leyenda":legend, "estado":true}
                                flag = true;
                                legend.setLegenda()
                            }
                        }
                        else{
                            let jsonColores = {};
                            let descripcionCapa;
                            dataGlobal.filter(x => x["descripcion_capa"] == capaUnicaName).forEach( x =>{
                                descripcionCapa = x["Propiedad"];
                                x.Variable = x.Variable?x.Variable:""; 
                                jsonColores[x.Variable] = x.Color
                            });
                            estiloDinamico = (feature) =>{
                                let valuePropertie = feature.properties[descripcionCapa];
                                return {"fillOpacity":0.5,"color":jsonColores[valuePropertie]}
                            }
                            //this.legendas.push(new LEGENDMAP(capaUnicaID,capaUnicaName,null,jsonColores,tituloLeyenda));
                            legend = new LEGENDMAP(capaUnicaID,capaUnicaName,null,jsonColores,tituloLeyenda)
                            this.leyendMaster[IDCAPA+comunaID] = {"leyenda":legend, "estado":true}
                            flag = true;
                            legend.setLegenda()
                        }
                            //this.jsonTotalCapas[capaUnica] = L.geoJson(capa["data"],{style:estiloDinamico,onEachFeature: onEachFeatureCustom});
                            let geojson = L.geoJson(capa["data"],{style:estiloDinamico,onEachFeature: onEachFeatureCustom});
                            this.diccionarioMaster[IDCAPA+comunaID] = geojson
                            this.controlCapa.setCapa(geojson,capaUnica)
                            //console.log(capaUnicaName)
                            //globalComuna.arrayGeometrias.push({"mapa":geojson,"data":capa["data"],"comuna":comunaID,"capa":capaUnicaName})
                            //controlGlobalCapa.setCapa(geojson,capaUnica)
                        //controlGlobalCapa.setCapa(L.geoJson(capa["data"],{style:estiloDinamico,onEachFeature: onEachFeatureCustom}),capaUnica)  
                    }
                    setTimeout(() => {
                        //legend.setLegenda();
                        
                        let capaID = "#"+IDCAPA + codComuna;
                        //this.leyendMaster[IDCAPA+comunaID].setLegenda();
                        console.log(capaID)
                        
                        
                        $(capaID).trigger("click");
                        $(".loader").fadeOut("slow")
                    }, 5000); 
                });           
            }
        )
        ;
    }

    getHTMLComuna(comuna,codComuna){
        return `<div class="form-check">
                    <label class="form-check-label label-input-sideMenu">
                        <input type="checkbox"  value="${codComuna}"
                        onclick="checkComuna(this,'${codComuna}')" class="form-check-input" value="">
                        ${comuna}
                    </label>
                </div>`
    }

    getHTMLCapa(capa,codigo){
        return `<div class="form-check">
                    <label class="form-check-label label-input-sideMenu">
                        <input type="checkbox" class="form-check-input"
                        onclick="checkCapa(this,'${codigo}')" 
                        value="${codigo}">
                            ${capa}
                    </label>
                </div>`
    }

    renderComuna(){
        let comunasCodigos = this.multimapas.map(x => {
            return {"comuna":x["comuna"]["comunaName"],"codComuna":x["codComuna"]};
        })
        .sort((a,b) => (a.comuna > b.comuna)?1:-1)
        .map(x => 
            {
                general2.addComuna(x);
                return this.getHTMLComuna(x.comuna,x.codComuna);
                
            })
        .reduce( (x,y) => x + y);
        //console.log(comunasCodigos)
        $("#div-input-comunas").html(comunasCodigos)
    }

    renderCapa(){
        let capasNombre = [... new Set(
            dataGlobal
            //descripcion_capa
            //.map(x => x.titulo_leyenda)
            .map(x => x.descripcion_capa)
            .filter(x => !!x))]
            .map( x =>{
                return {"nombre":x,"id":removeAccents(x)};
            })
            .sort((a,b) => (a.nombre > b.nombre)?1:-1)
            .map( x => {
                let capa = new layerSingle(x)
                general2.addLayer(capa)
                return this.getHTMLCapa(x.nombre,x.id)})
            .reduce((x,y) => x + y);
        $("#div-input-capas").html(capasNombre)
    }

    hideControl(){
        $(".leaflet-control-layers").each((x,y)=> {
            if(x ==2){
                let objeto = $(y);
                x,objeto.hide()
            }
        })
    }

    buttonSeleccionarTodo(){
        let listaComuna = $($(".leaflet-control-layers-list")[0])
        let boton = '<input type="button" id="butonComunas" onclick="marcarTodoComuna()"  value="Seleccionar todas">'
        listaComuna.html(boton+listaComuna.html());
    }
}


