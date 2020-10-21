function Plotter(options){
    self = this;
    self.mapSelector = options.mapSelector;
    self.mainMap = options.mapObj;

    self.init = function(){

        let html = 
            '<div class="plotter-container">' +
                '<input id="plotValues" class="form-control-sm"' +
                   'type="text" type="text"' +
                   'placeholder="Enter Coord. Series [lat,lon],[lat,lon]"/> ' +
                '<a class="btn btn-primary btn-sm" href="#" id="plot" role="button" >Plot</a>' +
            '</div>';
        
        $(self.mapSelector).append(html);

        $(document).ready(function () {
            $( "#plot" ).on( "click", function() {
                let arrayString = null;
                try{
                    arrayString = JSON.parse('[' + $('#plotValues').val() + ']');
                    let polyline = L.polyline(arrayString, {
                        color: '#ffeaa7',
                        weight: 3,
                        opacity: 0.8
                    }).addTo(self.mainMap);

                    let btn = document.createElement('button');
                    btn.innerText = 'Delete Line';
                    btn.className = 'btn btn-danger btn-sm button-deleteline';
                    btn.onclick =  function() {
                        self.mainMap.removeLayer(polyline);
                    }
                    let linePopup = L.popup({
                        className: 'pupup-deleteline'
                    }).setContent(btn);

                    polyline.bindPopup(linePopup);

                    self.mainMap.fitBounds(polyline.getBounds());
                }catch(exc){
                    alert('Error converting string');
                }
            });
        });            
    }
}