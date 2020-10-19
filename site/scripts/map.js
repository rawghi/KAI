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
            maxBounds: [[-90,-190], [90,190]],
            maxBoundsViscosity: 0.8,
            worldCopyJump: true,
            attributionControl: true
            

        }).setView([0,0], 0);
            
        L.tileLayer.kaiMaps({body: 'kerbin', style:'sat'}).addTo(self.internalMap);
        
        L.control.coordinates({
            decimals:4,
            enableUserInput:false
        }).addTo(self.internalMap);


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
                iconAnchor: [18, 18],
                popupAnchor: [0, -18],
                html:'<img src="https://rawghi.github.io/KAI/CDN/mapicons/' + poi.icon + '.png" />'
              });
            
            let myIcon = L.icon({
                iconUrl: 'https://rawghi.github.io/KAI/CDN/mapicons/' + poi.icon + '.png',
                iconSize: [24, 24],
                iconAnchor: [12, 12],
                popupAnchor: [0, -12]
            });
            
            let myMarker = L.marker(poi.coords, {icon: myIcon});
            //let myMarker = L.marker(poi.coords, {icon: divIcon});


            let MyPopupContent = poi.description;

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
