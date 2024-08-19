var prefix = "";

$(document).ready(function() {
  var grodziskoStyle = new ol.style.Style({
    image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
      anchor: [0.5, 35],
      anchorXUnits: 'fraction',
      anchorYUnits: 'pixels',
      src: '/assets/img/map/monument.png'
    }))
  });

  var grodziskoStyle2 = new ol.style.Style({
          image: new ol.style.Circle({
            radius: 7,
            snapToPixel: false,
            fill: new ol.style.Fill({color: '#FF6B6B'}),
            stroke: new ol.style.Stroke({
              color: 'black', width: 2
            })
          })
  });

  var sondazStyle = new ol.style.Style({
    image: new ol.style.Circle({
      radius: 5,
      fill: new ol.style.Fill({color: '#4ECDC4'}),
      stroke: new ol.style.Stroke({color: 'black', width: 1})
    })
  });

  var sondazStyle2 = new ol.style.Style({
    image: new ol.style.RegularShape({
      radius: 5,
      points: 4,
      fill: new ol.style.Fill({color: '#4ECDC4'}),
      stroke: new ol.style.Stroke({color: 'black', width: 1})
    })
  });

  var vectorLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: '/assets/points2.geojson',
      format: new ol.format.GeoJSON()
    }),
    style: function(feature, resolution) {
      if (feature.get('icon') == '/img/grodzisko.png') {
        return grodziskoStyle2;
      } else {
        return sondazStyle2;
      }
    }
  });

  var map = new ol.Map({
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      }),
      vectorLayer
    ],
    target: 'map2',
    view: new ol.View({
      center: ol.proj.fromLonLat([19.6957, 53.95]),
      zoom: 9
    })
  });

  var popup = new ol.Overlay.Popup();
  map.addOverlay(popup);

  map.on('singleclick', function(evt) {
    displayFeatureInfo(evt);
  });

  function displayFeatureInfo(evt) {
    var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
      return feature;
    });

    popupContent = "";
    if (feature.get('link') == '/img/sondaz.png') {
      popupContent = '<div><h2>' + feature.get('title') + '</h2>' +
      '<p>Weryfikacja negatywna</p>' +
      '</div>';
    } else {
      popupContent = '<div class="map-feature-popup"><h2>' + feature.get('title') + '</h2>' +
      '<img src="' + feature.get('img') + '" />' +
      '<p>' + feature.get('description') + '</p>' +
      '<p style="clear: both;">&nbsp;</p>' +
      '<a href="' + feature.get('link') + '" class="btn btn-primary">Szczegóły</a>' +
      '</div>'
    }

    popup.show(evt.coordinate, popupContent);
  }
});
