function MapComponent(){
    let self = this;
    self.internalMap = null;
    self.genericLayer = null;

    self.init = function(){
        self.internalMap = self.initMap();
        self.populateGenericLayer(self.internalMap);
    };

    /* MAP INIT */
    self.initMap = function(){
        self.internalMap = L.map('mainMap',{
            crs: L.CRS.Kerbin.Equirectangular,
            minZoom: 2,
            maxZoom: 6,
            zoom: 2,
            maxBounds: [[-90,-190], [90,190]],
            maxBoundsViscosity: 0.8,
            worldCopyJump: true,
            attributionControl: true
            

        }).setView([0,0], 0);
            
        L.tileLayer.kaiMaps({body: 'kerbin', style:'sat'}).addTo(self.internalMap);
        
        //coord controls
        L.control.coordinates({
            decimals:4,
            enableUserInput:false
        }).addTo(self.internalMap);

        //graticule
        L.latlngGraticule({
            showLabel: true,
            zoomInterval: [
                {start: 2, end: 3, interval: 30},
                {start: 4, end: 4, interval: 10},
                {start: 5, end: 7, interval: 5},
                {start: 8, end: 10, interval: 1}
            ],
            opacity: 0.8,
            font: '11px Ubuntu',
            weight: 0.4
        }).addTo(self.internalMap);

        //measure control
        self.internalMap.addControl(new L.Control.LinearMeasurement({
            unitSystem: 'metric',
            color: '#feca57',
            type: 'line',
            doubleClickSpeed: 2000,
            weight: 1,
            opacity: 0.9,
            radius: 2
        }));

        //scale control
        L.control.scale().addTo(self.internalMap);
        
        self.internalMap.invalidateSize();
        self.internalMap.getSize();
        
        return self.internalMap;
    };

    self.populateGenericLayer = function(myMap){
           
        _.forEach(data_genericpoi, function(poi) {
            let divIcon = L.divIcon({
                className: 'kai-marker',
                iconSize: [36, 36],
                iconAnchor: [18, 42],
                popupAnchor: [0, -42],
                html:'<div class="circle"><img src="https://rawghi.github.io/KAI/CDN/mapicons/' + poi.icon + '.png" /></div><div class="arrow"></div>'
              });
            
            let myIcon = L.icon({
                iconUrl: 'https://rawghi.github.io/KAI/CDN/mapicons/' + poi.icon + '.png',
                iconSize: [24, 24],
                iconAnchor: [12, 12],
                popupAnchor: [0, -12]
            });
            
            //let myMarker = L.marker(poi.coords, {icon: myIcon});
            let myMarker = L.marker(poi.coords, {icon: divIcon});

            let MyPopupContent = 
                '<div class="popup-container">' +
                    '<div class="popup-title">' +
                        poi.name + 
                    '</div>' + 
                    '<div class="popup-desc">' +
                        poi.description +
                    '</div>' + 
                    '<div class="popup-img">' +
                        '<img src="https://rawghi.github.io/KAI/CDN/maplocations/' + poi.image +'" />' +
                    '</div>' +
                '</div>';

            myMarker.bindPopup(MyPopupContent).openPopup();

            myMarker.addTo(myMap);

        });
    }


}

/* 
 * Workaround for 1px lines appearing in some browsers due to fractional transforms
 * and resulting anti-aliasing.
 * https://github.com/Leaflet/Leaflet/issues/3575
 */
(function(){
    var originalInitTile = L.GridLayer.prototype._initTile
    L.GridLayer.include({
        _initTile: function (tile) {
            originalInitTile.call(this, tile);

            var tileSize = this.getTileSize();

            tile.style.width = tileSize.x + 1 + 'px';
            tile.style.height = tileSize.y + 1 + 'px';
        }
    });
})()
