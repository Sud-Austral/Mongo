class layerSingle {
    constructor(capa) {
      this.capa = capa;
      this.objReferencia = dataGlobal.filter(x => x["descripcion_capa"] == capa["nombre"])[0];
      this.objReferenciaGlobal = dataCapaGlobal.filter(x => x.idcapa == this.objReferencia.idcapa)[0];
      //console.log(this.objReferenciaGlobal)
      this.data = {};
      this.jsonColoresRandom = null;
      this.legend = null;
      this.geojson = null;
    }

    fixParche_NOM_ACUIF(valor){
        try {
            valor["properties"]["NOM_ACUIF"] = valor["properties"]["NOM_ACUIF"]
                                                .replaceAll("Biobio","BioBio");
            return true;
        } catch (error) {
            return false;
        }
    }

    

    getLegend(Comunas){
        let dataAcumulada = []
        let dataAcumuladoFull = []
        Comunas.forEach(x =>{
            try {               
                this.data[x.codComuna].data.features.
                    forEach(x => this.fixParche_NOM_ACUIF(x));
                    //forEach(x => x["properties"]["NOM_ACUIF"] = x["properties"]["NOM_ACUIF"]
                    //.replaceAll("Biobio","BioBio"));
                let auxArray = this.data[x.codComuna].data.features.map(x => x["properties"]);                
                dataAcumuladoFull = dataAcumuladoFull.concat(this.data[x.codComuna].data.features);
                dataAcumulada = dataAcumulada.concat(auxArray);    
            } catch (error) {
                console.error(error.name + ': ' + error.message,x,this.objReferencia);
            }      
        });
        console.log(dataAcumuladoFull) 
        let objReferencia = this.objReferencia;
        let variableUnica =  objReferencia["Propiedad"]; 

        let unicos = dataAcumulada.map(x => x[variableUnica]);
        unicos = [...new Set(unicos)];
        console.log("Tipo",objReferencia["Tipo"])
        if(objReferencia["Tipo"] == "Puntos" || objReferencia["Tipo"] == "Punto"){
            //Esto es un punto
            if(objReferencia["Variable"] == "random"){
                //Esto es un punto random
                let paleta = getPalletteIcon(objReferencia);
                console.log(paleta)
                let result = getHtmlFromPointRandom2(unicos,paleta,objReferencia,variableUnica);
                let htmlString = result[0];
                this.jsonColoresRandom = result[1]
                this.legend = getLegendLeaflet2(htmlString);
            }
            else{                
                //Esto es un punto Definido
                console.log("Definido")
                let result = getHtmlFromPointDefinidos2(variableUnica,objReferencia,unicos)
                let htmlString = result[0]
                this.jsonColoresRandom = result[1]
                this.legend = getLegendLeaflet2(htmlString);                        
            }
            //console.log(this.jsonColoresRandom,objReferencia["Variable"])
            this.getMapaPoint(dataAcumuladoFull)
        }
        else{
            //Esto es un poligono
            if(objReferencia["Variable"] == "random"){
                //Esto es un poligono random                
                let paleta = getPallette(objReferencia);
                let result = getHtmlFromPoligonRandom2(unicos,paleta,objReferencia,variableUnica);
                let htmlString = result[0]
                this.jsonColoresRandom = result[1]
                this.legend = getLegendLeaflet2(htmlString);
            }
            else{
                
                //"Esto es un poligono con colores definidos"
                let result = getHtmlFromPoligonDefinidos2(variableUnica,objReferencia,unicos)
                let htmlString = result[0]
                this.jsonColoresRandom = result[1]
                this.legend = getLegendLeaflet2(htmlString);                        
            }
            this.getMapaPoligono(dataAcumuladoFull);
        }  
         
    }

    getMapaPoint(dataAcumuladoFull){
        let dataGlobalNivel2 = dataGlobal.filter( capaGlobal =>
            capaGlobal.idcapa == this.objReferencia["idcapa"]
        );
        //console.log(dataGlobalNivel2)
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
        let propiedad = this.objReferencia["Propiedad"]
        let setIcon = (feature, latlng) =>{            
            let valorPropiedad =feature["properties"][propiedad].toString();
            
            if( valorPropiedad == "" ||  valorPropiedad === null){
                valorPropiedad="Sin Información"
                //console.log(variable,variable===null)
            };
            let color = this.jsonColoresRandom[valorPropiedad];
            let myIcon = getIcon(color);
            return L.marker(latlng, { icon: myIcon });
        }

        if(this.objReferencia["Variable"] == "default"){
            setIcon = (feature, latlng) =>{
                let url = this.objReferencia["url_icono"];
                let myIcon = getIcon(url);
                return L.marker(latlng, { icon: myIcon });
            }
        }
        let geojson = L.geoJson({"type": 'FeatureCollection',
        "features":dataAcumuladoFull},//{style:estiloDinamico}).addTo(map);
        {onEachFeature: onEachFeatureCustom,pointToLayer: setIcon}).addTo(map);
        this.geojson = geojson;
    }

    getMapaPoligono(dataAcumuladoFull){
        let propiedad = this.objReferencia["Propiedad"]
        
        console.log(this.objReferencia)

        let estiloDinamico = (feature) => {  
            let valorPropiedad =feature["properties"][propiedad]?feature["properties"][propiedad]:"Sin Información"          
            let color = this.jsonColoresRandom[valorPropiedad];
            
            return {"fillOpacity":0.7,"opacity":0.75,"color":color}
        }
        if(this.objReferencia["Variable"] == "default"){
            estiloDinamico = () =>{
                let color = this.objReferencia["Color"];
                return {"fillOpacity":0.7,"opacity":0.75,"color":color}
            }
        }
        //console.log(dataGlobal,this.objReferencia,this.objReferenciaGlobal)
        let dataGlobalNivel2 = dataGlobal.filter( capaGlobal =>
            capaGlobal.idcapa == this.objReferencia["idcapa"]
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
        "features":dataAcumuladoFull},
        {style:estiloDinamico,onEachFeature: onEachFeatureCustom}).addTo(map);
        /*
        let geojson = L.geoJson({"type": 'FeatureCollection',
        "features":dataAcumuladoFull},
        {style:estiloDinamico,onEachFeature: onEachFeatureCustom}).addTo(map);
        */
        this.geojson = geojson;
    }

}