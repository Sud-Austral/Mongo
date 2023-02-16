class AllLayers {
    constructor() {
      this.layerCollection = [];
      this.comunaCollection = [];
      this.geometryMark = null;
      let opcion = "C";
      this.urlImageMark = 
        `https://raw.githubusercontent.com/Sud-Austral/DATA_MAPA_PUBLIC_V2/main/ICONS_MARKS/globo_opcion_${opcion}.png`;
      this.sizeImageMark = [27,33];
    }

    getCapasInicial(){
        return [
            "AlertasdeIncendiosJ1VIIRS",
            "AlertasdeIncendiosMODIS",
            "AlertasdeIncendiosSUOMI"
        ];
    }

    markInitial(){
        console.log("Iniciamos");
        let capaInicial = this.getCapasInicial();
        $("#div-input-comunas input").each((x,y)=> $(y).click());
        $("#div-input-capas input").each((x,y)=> {
            let objeto = $(y);
            if(capaInicial.indexOf(objeto.attr("value")) > -1){
                objeto.click()
            }
        });
    }

    cleanMap(){
        this.disableMark();
        this.getCleanMap();
        this.layerCollection.filter(x => x.legend != null)
        .forEach(x => x.legend.remove(map));
    }

    addComuna(comuna){
        comuna["activa"] = false;
        this.comunaCollection.push(comuna);
    }

    activateComuna(codCom){
        let comRef = this.comunaCollection.filter(x => x.codComuna == codCom)[0];
        comRef["activa"] = true;
    }

    desactiveComuna(codCom){
        let comRef = this.comunaCollection.filter(x => x.codComuna == codCom)[0];
        comRef["activa"] = false;
    }

    activateLayer(layer){
        let layerRef = this.layerCollection.filter(x => x.capa.id == layer)[0];
        //console.log("activate",layerRef)
        layerRef["activa"] = true;
    }

    desactiveLayer(layer){
        let layerRef = this.layerCollection.filter(x => x.capa.id == layer)[0];
        layerRef["activa"] = false;
    }
    addLayer(layer){
        layer["activa"] = false;
        this.layerCollection.push(layer);
    }

    addDataLayer(layer,comuna){
        let codCom = comuna["codigo_comuna"];

        let layerRef = this.layerCollection.filter(x => x.objReferencia.descripcion_capa == layer.data.propiedadGlobal.descripcion_capa)[0];
        //console.log(codCom,layer)
        layerRef.data[codCom] = layer; 
        //console.log("All",layerRef)
    }

    getAllLegend(){
        this.getCleanMap();
        this.disableMark();
        this.layerCollection
        .filter(x => x.legend != null)
        .forEach(x => x.legend.remove(map));
        let caparActivas = this.layerCollection.filter(x => x.activa);
        //caparActivas.forEach(x => x.getLegend(this.comunaCollection.filter(x => x.activa)))  
        for (let index = caparActivas.length -  1; index >= 0; index--) {
            caparActivas[index].getLegend(this.comunaCollection.filter(x => x.activa));
        }
    }

    getCleanMap(){
        this.disableMark();
        this.layerCollection
        .filter(x => x.geojson != null)
        .forEach(
            x =>{
                try {
                    x.geojson.remove(map);
                    //x.legend.remove(map)
                } catch (error) {
                    console.log("Error al sacar ",this.objReferencia)
                }
            });
    }

    disableMark(){
        try {
            if(this.geometryMark){
                this.geometryMark.remove(map);
            }
        } catch (error) {
            console.log("Error al eliminar marca");
        }
        
    }

    markPolygon(descripcion,variable){
        this.disableMark();
        let marca = this.layerCollection
        .filter(x => x["objReferencia"]["descripcion_capa"] == descripcion);
        this.geometryMark = marca[0];
        let property = this.geometryMark.objReferencia["Propiedad"];
        let comunas = this.comunaCollection.filter(x => x.activa);
        let dataAcumuladoFull = []
        comunas.forEach(x =>{
            try {             
                dataAcumuladoFull = dataAcumuladoFull.concat(this.geometryMark.data[x.codComuna].data.features);   
            } catch (error) {
                console.log("Revisar2 ",x,this.objReferencia)
            }      
        })
        let markData = dataAcumuladoFull.filter(x => x.properties[property] == variable);
        let estiloDinamico = () => {  
            return {"fillOpacity":0.8,"opacity":0.9,"color":"#E3FF00"}
        }        
    
        let dataGlobalNivel2 = dataGlobal.filter( capaGlobal =>
            capaGlobal.idcapa == this.geometryMark.objReferencia.idcapa
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
        let geojson = L.geoJson({"type": 'FeatureCollection',
        "features":markData},//
        {style:estiloDinamico,onEachFeature: onEachFeatureCustom}).addTo(map);
        this.geometryMark = geojson;
    }

    markPolygon2(descripcion,variable){
        this.disableMark();
        let marca = this.layerCollection
        .filter(x => x["objReferencia"]["descripcion_capa"] == descripcion);
        this.geometryMark = marca[0];
        let property = this.geometryMark.objReferencia["Propiedad"];
        let comunas = this.comunaCollection.filter(x => x.activa);
        let dataAcumuladoFull = []
        comunas.forEach(x =>{
            try {             
                dataAcumuladoFull = dataAcumuladoFull.concat(this.geometryMark.data[x.codComuna].data.features);   
            } catch (error) {
                console.log("Revisar2 ",x,this.objReferencia)
            }      
        })
        let markData = dataAcumuladoFull; //.filter(x => x.properties[property] == variable);
        let estiloDinamico = () => {  
            return {"fillOpacity":0.8,"opacity":0.9,"color":"#E3FF00"}
        }        
    
        let dataGlobalNivel2 = dataGlobal.filter( capaGlobal =>
            capaGlobal.idcapa == this.geometryMark.objReferencia.idcapa
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
        let geojson = L.geoJson({"type": 'FeatureCollection',
        "features":markData},//
        {style:estiloDinamico,onEachFeature: onEachFeatureCustom}).addTo(map);
        this.geometryMark = geojson;
    }

    markPoint(descripcion,variable){
        this.disableMark();
        let marca = this.layerCollection
        .filter(x => x["objReferencia"]["descripcion_capa"] == descripcion);
        this.geometryMark = marca[0];
        let property = this.geometryMark.objReferencia["Propiedad"];
        let comunas = this.comunaCollection.filter(x => x.activa);
        let dataAcumuladoFull = []
        comunas.forEach(x =>{
            try {             
                dataAcumuladoFull = dataAcumuladoFull.concat(this.geometryMark.data[x.codComuna].data.features);   
            } catch (error) {
                console.log("Revisar2 ",x,this.objReferencia)
            }      
        })
        let markData = dataAcumuladoFull.filter(x => x.properties[property] == variable);
        //Contruye el icono de la marca
        let setIcon = (feature, latlng) =>{
            let myIcon = L.icon({
                //iconUrl: "https://raw.githubusercontent.com/Sud-Austral/DATA_MAPA_PUBLIC_V2/main/AGUAS/Iconos/Solido1.png",
                iconUrl: this.urlImageMark,
                iconSize:  this.sizeImageMark  //[25, 25] // width and height of the image in pixels
                });
            //let myIcon = getIcon();
            return L.marker(latlng, { icon: myIcon });
        }        
    
        let dataGlobalNivel2 = dataGlobal.filter( capaGlobal =>
            capaGlobal.idcapa == this.geometryMark.objReferencia.idcapa
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
        let geojson = L.geoJson({"type": 'FeatureCollection',
        "features":markData},//
        {pointToLayer: setIcon,onEachFeature: onEachFeatureCustom}).addTo(map);
        this.geometryMark = geojson;
    }

    markPoint2(descripcion,variable){
        this.disableMark();
        let marca = this.layerCollection
        .filter(x => x["objReferencia"]["descripcion_capa"] == descripcion);
        this.geometryMark = marca[0];
        let property = this.geometryMark.objReferencia["Propiedad"];
        let comunas = this.comunaCollection.filter(x => x.activa);
        let dataAcumuladoFull = []
        comunas.forEach(x =>{
            try {             
                dataAcumuladoFull = dataAcumuladoFull.concat(this.geometryMark.data[x.codComuna].data.features);   
            } catch (error) {
                console.log("Revisar2 ",x,this.objReferencia)
            }      
        })
        let markData = dataAcumuladoFull //.filter(x => x.properties[property] == variable);
        let setIcon = (feature, latlng) =>{
            let myIcon = L.icon({
                iconUrl: this.urlImageMark,
                iconSize:  this.sizeImageMark   //[25, 25] // width and height of the image in pixels
                });
            //let myIcon = getIcon("https://raw.githubusercontent.com/Sud-Austral/DATA_MAPA_PUBLIC_V2/main/AGUAS/Iconos/Solido1.png");
            return L.marker(latlng, { icon: myIcon });
        }        
    
        let dataGlobalNivel2 = dataGlobal.filter( capaGlobal =>
            capaGlobal.idcapa == this.geometryMark.objReferencia.idcapa
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
        let geojson = L.geoJson({"type": 'FeatureCollection',
        "features":markData},//
        {pointToLayer: setIcon,onEachFeature: onEachFeatureCustom}).addTo(map);
        this.geometryMark = geojson;
    }


}

