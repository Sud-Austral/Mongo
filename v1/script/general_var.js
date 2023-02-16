//Mapa de Leaflet
let map = L.map("mapid",{
    minZoom: 0,
    maxZoom: 18,
    zoomSnap: 0,
    zoomDelta: 0.25,
    
}).setView([-33.458725187656356, -70.66008634501547],10);
map.attributionControl.setPrefix("");

$(window).ready(function() { 
    $(".loader").fadeOut("slow");
    /*
    setTimeout(function(){
        $(".loader").fadeOut("slow");
    }, 5000);
    */
    //$(".comunaID").parent().parent().parent().parent().parent().parent().css( "background", "black"); 
    /*
    $($($(".comunaID")  .parent().parent().parent().parent().parent().parent().parent())
        .children()[0]).css( "background", "#049fec");
    console.log($($(".comunaID")  .parent().parent().parent().parent().parent().parent().parent())
    .html())
    $(".comunaID").parent().parent().parent().parent().parent().parent().css( "background", "#03a7ab")
    $($($(".comunaID")  .parent().parent().parent().parent().parent().parent().parent())
        .children()[2]).css( "background", "#A5CD00");

    
   console.log($($($(".comunaID")  .parent().parent().parent().parent().parent().parent().parent())
   .children()[0]).html())
*/

        $($($(".comunaID")  .parent().parent().parent().parent().parent().parent().parent())
        .children()[0]).css( "background", "#B3CCFF");
        $($($(".comunaID")  .parent().parent().parent().parent().parent().parent().parent())
        .children()[0]).css( "accent-color", "#4784FF");

        $($($(".comunaID")  .parent().parent().parent().parent().parent().parent().parent())
        .children()[2]).css( "background", "#A5CD00");
        $($($(".comunaID")  .parent().parent().parent().parent().parent().parent().parent())
        .children()[2]).css( "accent-color", "#A3FFA3");
        
        $(".comunaID").parent().parent().parent().parent().parent().parent().css( "background", "#03a7ab");
        $(".comunaID").parent().parent().parent().parent().parent().parent().css( "accent-color", "#ceeefe");
});

function slideToggleLegend(idLegenda,padre) {
    //alert( "clicked " +idLegenda);
    $( "#" + idLegenda ).slideToggle( "slow", function() {
        // Animation complete.
    });
    $($(padre).children()[0]).is(":visible")?$($(padre).children()[0]).css("display", "none"):$($(padre).children()[0]).css("display", "block");
    $($(padre).children()[1]).is(":visible")?$($(padre).children()[1]).css("display", "none"):$($(padre).children()[1]).css("display", "block");
}





const htmlDI = "<span id='span_mapa'><a target='_blank' id='hyper_map' href='https://di-nextmile.com' title='The best'><img id='imagenLogoMapa' src='Content/img/logo_NextMile2.png'></img> Next-Mile by DataIntelligence </a></span>";

function getLayerMapBox(id){
    const base = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        //attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        //    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: id,
        tileSize: 512,
        zoomOffset: -1,
    });
    return base;
}

function getMapaBase(){
    const objetos = {
        // `<span class="comunaID"> ${nombreComuna} </span>`.toString();
        //"<span class='BaseID'>Mapa claro</span>": getLayerMapBox("mapbox/streets-v11"),
        "Mapa claro": getLayerMapBox("mapbox/streets-v11"),
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
    Object.keys(objetos).forEach(x => objetos[x].options.attribution = htmlDI)
    return objetos;
}

const removeAccents = (str) => {
    try{
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replaceAll(" ","")
        .replaceAll(":","")
        .replace(/[^a-zA-Z0-9 ]/g, "");
    }
    catch{
        return "";
    }} 

iconosDB = iconosDB.map( x =>{
    x.replaceAll("https://github","https://raw.githubusercontent")
    .replaceAll("/DATA_MAPA_PUBLIC_V2/raw","/DATA_MAPA_PUBLIC_V2")});

function getIcon(url){
    url = url?url:"https://github.com/Sud-Austral/DATA_MAPA_PUBLIC_V2/raw/main/svg/default.png";
    console.log(url.split(".")[3],url)
    let myIcon;
    if(url.split(".")[1] == "svg"){
        myIcon = L.icon({
            iconUrl: url,
            iconSize:  [3,3]   //[25, 25] // width and height of the image in pixels
            });
    }
    else{
        myIcon = L.icon({
            iconUrl: url,
            iconSize:  [15,15]   //[25, 25] // width and height of the image in pixels
            });
    }
    return myIcon;
}

/*
this.controlTotalCapas2 = L.control.layers(null, this.jsonTotalCapas, {
    position: 'topright',
    collapsed:  true
}).addTo(map);

addOverlay( <ILayer> layer, <String> name )
*/

