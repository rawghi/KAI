function MapComponent(){
    let self = this;
    self.internalMap = null;
    self.genericLayer = null;
    self.mapId = 'mainMap';

    self.init = function(){
        self.internalMap = self.initMap();
        
    };

    /* MAP INIT */
    self.initMap = function(){
        
        let genericLayer = self.createGenericLayer();
        let featuresLayer = self.createFeaturesLayer();
        let plotLayer = self.createPlotLayer();
        
        let overlayPoi = {
            "Locations": genericLayer,
            "Geography": featuresLayer,
            "Mission Plots": plotLayer
        }

        self.internalMap = L.map(self.mapId,{
            crs: L.CRS.Kerbin.Equirectangular,
            minZoom: 1,
            maxZoom: 6,
            zoomDelta: 1,
            center: [0,0],
            zoom: 2,
            maxBounds: [[-90,-190], [90,190]],
            maxBoundsViscosity: 0.8,
            worldCopyJump: false,
            attributionControl: true,
            layers: [genericLayer, featuresLayer],
            contextmenu: true,
            contextmenuWidth: 140,
            contextmenuItems: [{
                text: 'Show coordinates',
                callback: self.showCoordinates
            }, {
                text: 'Center map here',
                callback: self.centerMap
            }, '-', {
                text: 'Zoom in',
                callback: self.zoomIn
            }, {
                text: 'Zoom out',
                callback: self.zoomOut
            }]
        }).setView([0,0], 2);
            
        L.tileLayer.kaiMaps({body: 'kerbin', style:'sat'}).addTo(self.internalMap);

        L.control.layers(null,overlayPoi).addTo(self.internalMap);

        //coord controls
        L.control.coordinates({
            decimals:4,
            enableUserInput:false,
            useLatLngOrder: true
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
            color: '#fff',
            type: 'line',
            doubleClickSpeed: 2000,
            weight: 1,
            opacity: 0.4,
            radius: 2
        }));

        //scale control
        L.control.scale().addTo(self.internalMap);

        //plotter
        let plotter = new Plotter({
            mapSelector: '#' + self.mapId,
            mapObj: self.internalMap
        });
        plotter.init();

        //resize
        self.internalMap.invalidateSize();
        self.internalMap.getSize();
        
        return self.internalMap;
    };

    self.showCoordinates = function(e) {
        alert('Latitude, Longitude: ['  + e.latlng.lat + ',' + e.latlng.lng + ']');
    }
    
    self.centerMap = function (e) {
        self.internalMap.panTo(e.latlng);
    }
    
    self.zoomIn = function(e) {
        self.internalMap.zoomIn();
    }
    
    self.zoomOut = function(e) {
        self.internalMap.zoomOut();
    }  

    self.contextMenuFunc = function(e, arg){
        switch (arg){
            case "SHOWCOORD":
                alert(e.latlng);
                break;
            case "CENTER":
                self.internalMap.panTo(e.latlng);
                break;
            case "ZOOMIN":
                self.internalMap.zoomIn();
                break;
            case "ZOOMOUT":
                self.internalMap.zoomOut();
                break;
            default:
                break;
        }
    }

    self.createPlotLayer = function(){
        let genericPlotGroup = new L.layerGroup();

        _.forEach(data_plot, function(plot) {
            let polyline = L.polyline(plot.data, {color: '#fbc531'});

            let MyPopupContent = 
            '<div class="popup-container">' +
                '<div class="popup-desc">' +
                    plot.name +
                '</div>' + 
            '</div>';

            polyline.bindPopup(MyPopupContent).openPopup();

            polyline.addTo(genericPlotGroup);

        });

        return genericPlotGroup;

    }

    self.createGenericLayer = function(){
        
        let genericPoiGroup = new L.layerGroup();

        _.forEach(data_genericpoi, function(poi) {
            let divIcon = L.divIcon({
                className: 'kai-marker',
                iconSize: [36, 36],
                iconAnchor: [18, 42],
                popupAnchor: [0, -42],
                html:'<div class="circle"><img src="https://maps.kaero.space/CDN/mapicons/' + poi.icon + '.png" /></div><div class="arrow"></div>'
              });
            
            let myIcon = L.icon({
                iconUrl: 'https://maps.kaero.space/CDN/mapicons/' + poi.icon + '.png',
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
                        '<img src="https://maps.kaero.space/CDN/maplocations/' + poi.image +'" />' +
                    '</div>' +
                '</div>';

            myMarker.bindPopup(MyPopupContent).openPopup();

            myMarker.addTo(genericPoiGroup);

        });
        return genericPoiGroup;
    }

    self.createFeaturesLayer = function(){
        
        let featuresPoiGroup = new L.layerGroup();

        _.forEach(data_features, function(poi) {
                        
            let svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svgElement.setAttribute('xmlns', "http://www.w3.org/2000/svg");
            svgElement.setAttribute('viewBox', "0 0 " + poi.width + " " + poi.height);
            svgElement.innerHTML = poi.source;
            let svgElementBounds = poi.bounds;
            L.svgOverlay(svgElement, svgElementBounds).addTo(featuresPoiGroup);

        });
        return featuresPoiGroup;
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
