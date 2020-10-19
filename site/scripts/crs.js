/* 
 * Code mofified from the brilliant solution of Ivan Sanchez Ortega from https://gitlab.com/IvanSanchez/Leaflet.Kerbal
 */

/* TILE LAYER DEFINITION */
L.TileLayer.KaiMaps = L.TileLayer.extend({
	options: {},
	initialize: function(options) {
		var url = "https://rawghi.github.io/kai-mapserver/tiles/{z}/{y}/{x}.png"
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
