$(document).ready(function () {
    initMap();


});

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


/* 
 * Code mofified from the brilliant solution of Ivan Sanchez Ortega from https://gitlab.com/IvanSanchez/Leaflet.Kerbal
 */

/* MAP INIT */
function initMap(){
    var mymap = L.map('mainMap',{
        crs: L.CRS.Kerbin.Equirectangular,
        minZoom: 0,
        maxZoom: 5
    }).setView([0,0], 0);
        
    L.tileLayer.kaiMaps({body: 'kerbin', style:'sat'}).addTo(mymap);

    mymap.invalidateSize();
    mymap.getSize();

};


/* TILE LAYER DEFINITION */
L.TileLayer.KaiMaps = L.TileLayer.extend({
	options: {},
	initialize: function(options) {
		var url = "https://rawghi.github.io/KAI/mapserver/{z}/{y}/{x}.png"
		L.TileLayer.prototype.initialize.call(this, url, options);
	}
});
L.tileLayer.kaiMaps = function(options) {
	return new L.TileLayer.KaiMaps(options);
};

/* CRS AND DATUM */
L.Datum = L.Datum || {};
L.Datum.Kerbin = L.extend({}, L.CRS.Earth, {
	R: 600000
});
L.CRS.Kerbin = {};
L.CRS.Kerbin.Equirectangular = L.extend({}, L.Datum.Kerbin, {
	code: 'KSP:30001',
	projection: L.Projection.LonLat,
	transformation: new L.Transformation(1 / 180, 1, -1 / 180, 0.5)
});
