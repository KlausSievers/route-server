import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import Draw from 'ol/interaction/Draw';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import Feature from 'ol/Feature';
import Overlay from 'ol/Overlay';
import { Point, LineString } from 'ol/geom';
import * as olProj from 'ol/proj';
import Polyline from 'ol/format/Polyline';
import { Circle as CircleStyle, Fill, Icon, Stroke, Style } from 'ol/style';
import axios from 'axios';
import { getVectorContext } from 'ol/render';

var markerStyle = new Style({
  image: new CircleStyle({
    radius: 7,
    fill: new Fill({ color: 'red' }),
    stroke: new Stroke({
      color: 'white', width: 2
    })
  })
});

var routeStyle = new Style({
  stroke: new Stroke({
    width: 6, color: [26, 115, 232, 0.8]
  })
});

var marker = [];

var locations = [];
var polyline = new LineString(locations);
var routeFeature = new Feature(polyline);

routeFeature.setStyle(routeStyle);



var markerSource = new VectorSource({
  features: marker
});

var routeSource = new VectorSource({
  features: [routeFeature]
});

var markerLayer = new VectorLayer({
  source: markerSource
});

var routeLayer = new VectorLayer({
  source: routeSource
});

var raster = new TileLayer({
  source: new OSM()
});


var map = new Map({
  layers: [raster, routeLayer, markerLayer],
  target: 'map',
  view: new View({
    //projection: 'EPSG:4326',
    // displayProjection:'EPSG:4326',
    center: olProj.fromLonLat([7.88, 49.8]),
    zoom: 7.5
  })
});

// change mouse cursor when over marker
// map.on('pointermove', function(e) {
//   if (e.dragging) {
//     $(element).popover('destroy');
//     return;
//   }
//   var pixel = map.getEventPixel(e.originalEvent);
//   var hit = map.hasFeatureAtPixel(pixel);
//   map.getTarget().style.cursor = hit ? 'pointer' : '';
// });
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');

var overlay = new Overlay({
  element: container,
  autoPan: true,
  autoPanAnimation: {
    duration: 250
  }
});
map.addOverlay(overlay);

closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};

map.on('singleclick', function (event) {
  var features = map.getFeaturesAtPixel(event.pixel);
  
  if (features.length > 0 && features[0].values_.type === 'marker') {
    var coordinate = event.coordinate;
    var origMarker = features[0].values_;

    var popupHtml = '';
    if (origMarker.image) {
      popupHtml = '<img src="img/'+origMarker.image+'" onclick="openOverlay(\''+origMarker.image+'\')" style="width: 200px">';
      popupHtml += '<div>'+origMarker.text+'</div>';
    } else {
      popupHtml = origMarker.text;
    }

    content.innerHTML = popupHtml;
    overlay.setPosition(coordinate);
  } else {
    overlay.setPosition(undefined);
    closer.blur();
  }
});

function handleCoord(response) {
  var newCoord = response.data;

  if (newCoord.length > 0) {
    newCoord.forEach(c => {
      locations.push(olProj.fromLonLat([c.longitude, c.latitude]));
    });

    var polyline = new LineString(locations);
    var routeFeature = new Feature(polyline);
    routeFeature.setStyle(routeStyle);

    routeLayer.getSource().clear();
    routeLayer.getSource().addFeature(routeFeature);

    map.render();
  }
}

function handleMarker(response) {
  var newMarker = response.data;
  if (newMarker.length > 0) {
    newMarker.forEach(m => {
      var f = new Feature({
        geometry: new Point(olProj.fromLonLat([m.longitude, m.latitude])),
        text: m.text,
        image: m.img,
        type: 'marker'
      });

      f.setStyle(markerStyle);
      markerLayer.getSource().addFeature(f);
    });

    map.render();
  }
}


var lastRequestTime = Date.now();
axios.get('https://vfl-grafenwald-fussball.de:8090/coord').then(handleCoord);
axios.get('https://vfl-grafenwald-fussball.de:8090/marker').then(handleMarker);
setInterval(() => {
  axios.get('https://vfl-grafenwald-fussball.de:8090/coord/' + lastRequestTime).then(handleCoord);
  axios.get('https://vfl-grafenwald-fussball.de:8090/marker/' + lastRequestTime).then(handleMarker);
  lastRequestTime = Date.now();
}, 10000);





