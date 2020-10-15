$(document).ready(function () {
    initMap();


});

function initMap(){
    var mymap = L.map('mainMap').setView([0,0], 1);

    L.tileLayer('https://rawghi.github.io/KAI/mapserver/{z}/{y}/{x}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        crs: L.CRS.Kerbin.Equirectangular,
        minZoom: 0,
        maxZoom: 3,
        //tileSize: 512,
        maxBounds: [[-95,-190], [95,190]],
        maxBoundsViscosity: 0.5,
        center: [0,0],
    }).addTo(mymap);

    map.invalidateSize();
    mymap.getSize();

};



// Radiuses values from http://wiki.kerbalspaceprogram.com

// Datums
L.Datum = L.Datum || {};
L.Datum.Kerbin = L.extend({}, L.CRS.Earth, {
	R: 600000
});

// CRSs
L.CRS.Kerbin = {};
L.CRS.Kerbin.Equirectangular = L.extend({}, L.Datum.Kerbin, {
	code: 'KSP:30001',
	projection: L.Projection.LonLat,
	transformation: new L.Transformation(1 / 180, 1, -1 / 180, 0.5)
});
