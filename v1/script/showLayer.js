let geoGlobal = "";
let mapMarker;
/*
function removeMarker(){
    try {
        if(mapMarker){
            mapMarker.remove(map);
        }
    } catch (error) {
        console.log("No hay marker definido aun")
    }    
}
*/



function mostarLayer2(variable,NomProp,descripcion_capa){
    removeMarker();  
    let acumuladoSimple = acumuladorGlobal.map(
        x => x["data"]
    )
    let listaFiltrada = acumuladoSimple.map(
        //x => x["features"].filter(y => y["properties"][NomProp] == variable)
        x => x["features"].filter(y => Object.keys(y["properties"]).indexOf(NomProp) > -1) 
    )
    console.log(acumuladoSimple)
    let dataGlobalNivel2 = dataGlobal.filter( capaGlobal =>
        capaGlobal.idcapa == descripcion_capa
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
    let estiloDinamico = (feature) => {
        return {"fillOpacity":0.8,"opacity":0.9,"color":"#E3FF00"}
    };
    let geojson = L.geoJson({"type": 'FeatureCollection',"features":listaFiltrada.reduce( (x,y)=> x.concat(y))},
    {style:estiloDinamico,onEachFeature: onEachFeatureCustom}).addTo(map);
    mapMarker = geojson;
}


function mostarLayer(variable,NomProp,descripcion_capa){
    removeMarker();  
    console.log("Acumulado",descripcion_capa,acumuladorGlobal);
    let acumuladoSimple = acumuladorGlobal
    .filter(x => x["descripcion"] == descripcion_capa)
    .map(
        x => x["data"]
    );
    //console.log(acumuladoSimple)
    let listaFiltrada = acumuladoSimple.map(
        x => x["features"].filter(y => y["properties"][NomProp] == variable)
    );
    let estiloDinamico = (feature) => {
        return {"fillOpacity":0.8,"opacity":0.9,"color":"#E3FF00"}
    };
    let dataGlobalNivel2 = dataGlobal.filter( capaGlobal =>
        capaGlobal.idcapa == descripcion_capa
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
    let geojson = L.geoJson({"type": 'FeatureCollection',"features":listaFiltrada.reduce( (x,y)=> x.concat(y))},
    //{style:estiloDinamico}).addTo(map);
    {style:estiloDinamico,onEachFeature: onEachFeatureCustom}).addTo(map);
    mapMarker = geojson;
}

function mostarLayerPoint(variable,NomProp,descripcion_capa){
    removeMarker();    
    let acumuladoSimple = acumuladorGlobal.map(
        x => x["data"]
    );
    let listaFiltrada = acumuladoSimple.map(
        x => x["features"].filter(y => y["properties"][NomProp] == variable)
    );
    let setIcon = (feature, latlng) =>{
        myIcon = getIcon("https://raw.githubusercontent.com/Sud-Austral/DATA_MAPA_PUBLIC_V2/main/AGUAS/Iconos/Solido1.png");
        return L.marker(latlng, { icon: myIcon });
    }
    let dataGlobalNivel2 = dataGlobal.filter( capaGlobal =>
        capaGlobal.idcapa == descripcion_capa
    );
    console.log(acumuladoSimple,dataGlobalNivel2) 
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
    let geojson = L.geoJson({"type": 'FeatureCollection',"features":listaFiltrada.reduce( (x,y)=> x.concat(y))},
    {onEachFeature: onEachFeatureCustom,pointToLayer: setIcon}).addTo(map);
    mapMarker = geojson;
}

function mostarLayerPoint2(variable,NomProp,descripcion_capa){
    removeMarker();  
    let acumuladoSimple = acumuladorGlobal.map(
        x => x["data"]
    )
    let listaFiltrada = acumuladoSimple.map(
        //x => x["features"].filter(y => y["properties"][NomProp] == variable)
        x => x["features"].filter(y => Object.keys(y["properties"]).indexOf(NomProp) > -1) 
    )
    
    let dataGlobalNivel2 = dataGlobal.filter( capaGlobal =>
        capaGlobal.idcapa == descripcion_capa
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
    let setIcon = (feature, latlng) =>{
        myIcon = getIcon("https://raw.githubusercontent.com/Sud-Austral/DATA_MAPA_PUBLIC_V2/main/AGUAS/Iconos/Solido1.png");
        return L.marker(latlng, { icon: myIcon });
    }
    
    let geojson = L.geoJson({"type": 'FeatureCollection',"features":listaFiltrada.reduce((x,y)=> x.concat(y))},
    {onEachFeature: onEachFeatureCustom,pointToLayer: setIcon}).addTo(map);
    mapMarker = geojson;
}

/*
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
let geojson = L.geoJson(capa["data"],{onEachFeature: onEachFeatureCustom,pointToLayer: setIcon})
*/