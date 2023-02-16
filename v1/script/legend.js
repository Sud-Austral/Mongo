let flagLegend = true;
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = '<i style="background:#ff0000"></i> Rojo<br><i style="background:#0000ff"></i> Azul';
    return div;
};
let mostrarLegenda =  function(){
    if(flagLegend){
        //legend.removeFrom(map);
        legend.remove();
        //console.log("Verdadero")
    }
    else{
        legend.addTo(map);
    }
    flagLegend = !flagLegend;
    // Agregar la leyenda al mapa
}

/*
<div class="leaflet-bottom leaflet-left">
    <div class="legend leaflet-control">
        <div class="legendCustom">
            <div class="contenedor container">
                <div class="row"> 
                <div class="principal2 col-10"> 
                <p class="titleLegend principal"><b><b>Santiago:</b> Naturaleza del Agua</b></p>
                </div><div onclick="slideToggleLegend('DerechosAguaNaturaleza13101_slide',this);" class="sidebar2 col-2">
                    <img id="clickme" src="Content/img/min.png" alt="imagen minimizar">
                    <img id="clickme2" src="Content/img/max.png" alt="imagen maximizar">
                </div>
            </div>
        </div> 
        <div id="DerechosAguaNaturaleza13101_slide"> 
            <span><img src="https://raw.githubusercontent.com/Sud-Austral/DATA_MAPA_PUBLIC_V2/main/AGUAS/Iconos/gotaazules/Imagen527.svg" alt="Girl in a jacket" width="20" height="20"> 
                Subterranea
            </span><br>
            <span><img src="https://raw.githubusercontent.com/Sud-Austral/DATA_MAPA_PUBLIC_V2/main/AGUAS/Iconos/gotaazules/Imagen535.svg" alt="Girl in a jacket" width="20" height="20"> 
                Superficial y Corriente
            </span><br>
            <span><img src="https://raw.githubusercontent.com/Sud-Austral/DATA_MAPA_PUBLIC_V2/main/AGUAS/Iconos/gotaazules/Imagen543.svg" alt="Girl in a jacket" width="20" height="20"> 
                Superficial
            </span><br>
            <span><img src="https://raw.githubusercontent.com/Sud-Austral/DATA_MAPA_PUBLIC_V2/main/AGUAS/Iconos/gotaazules/Imagen551.svg" alt="Girl in a jacket" width="20" height="20"> 
                Superficial y Detenida</span><br>
            <span><img src="https://raw.githubusercontent.com/Sud-Austral/DATA_MAPA_PUBLIC_V2/main/AGUAS/Iconos/gotaazules/Imagen559.svg" alt="Girl in a jacket" width="20" height="20"> 
                Superficial Corrientes/Detenidas</span><br>
            <span><img src="https://raw.githubusercontent.com/Sud-Austral/DATA_MAPA_PUBLIC_V2/main/AGUAS/Iconos/gotaazules/Imagen551.svg" alt="Girl in a jacket" width="20" height="20"> 
                Superf. y Detenida</span><br>
            <span><img src="https://raw.githubusercontent.com/Sud-Austral/DATA_MAPA_PUBLIC_V2/main/AGUAS/Iconos/gotaazules/Imagen523.svg" alt="Girl in a jacket" width="20" height="20"> 
                Sin Información</span><br>
        </div>
    </div>
</div>
</div>
*/