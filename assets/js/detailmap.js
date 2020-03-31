var prefix = "";

function drawDetailMap(initFeatureTitle) {
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
      fill: new ol.style.Fill({color: '#666666'}),
      stroke: new ol.style.Stroke({color: '#bada55', width: 1})
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

  var vectorSource = new ol.source.Vector({
    url: '/assets/points.geojson',
    format: new ol.format.GeoJSON()
  });

  var vectorLayer = new ol.layer.Vector({
    title: "Stanowiska",
    source: vectorSource,
    style: function(feature, resolution) {
      if (feature.get('icon') == '/img/grodzisko.png') {
        return grodziskoStyle2;
      } else {
        return sondazStyle2;
      }
    }
  });

  var map = new ol.Map({
    controls: ol.control.defaults().extend([new ol.control.LayerSwitcher(), new ol.control.ScaleLine()]),
    layers: [
      new ol.layer.Tile({
        title: "OpenStreetMaps",
        source: new ol.source.OSM()
      }),
      new ol.layer.Tile({
        title: "Ortofotomapa",
        source: new ol.source.TileWMS({
          url: 'http://mapy.geoportal.gov.pl/wss/service/img/guest/ORTO/MapServer/WMSServer',
          params: {'layers': 'Raster'}
        }),
        visible: false
      }),
      new ol.layer.Tile({
        title: "Mapa WIG 100k",
        source: new ol.source.TileWMS({
          url: 'http://wms.hgis.cartomatic.pl/topo/3857/wig100k',
          params: {'VERSION': '1.3.0', 'FORMAT': 'image/jpeg', 'layers': 'wig100k'}
        }),
        visible: false
      }),
      new ol.layer.Tile({
        title: "Messtischblatter 25k",
        source: new ol.source.TileWMS({
          url: 'http://wms.hgis.cartomatic.pl/topo/3857/m25k',
          params: {'VERSION': '1.3.0', 'FORMAT': 'image/jpeg', 'layers': 'm25k'}
        }),
        visible: false
      }),
      new ol.layer.Tile({
        title: "LIDAR",
        source: new ol.source.TileWMS({
          url: 'http://lidar.grodziska-warmia-mazury.pl/cgi-bin/qgis_mapserv.fcgi',
          params: {'layers': 'lidar'}
        }),
        visible: false
      }),
      new ol.layer.Image({
        title: "ISOK hipsometria",
        source: new ol.source.ImageWMS({
          url: 'https://mapy.geoportal.gov.pl/wss/service/PZGIK/NMT/GRID1/WMS/Hypsometry',
          params: {'layers': 'ISOK_HipsoDyn'}
        }),
        visible: false
      }),
      new ol.layer.Tile({
        title: "ISOK cieniowanie",
        source: new ol.source.TileWMS({
          url: 'https://mapy.geoportal.gov.pl/wss/service/PZGIK/NMT/GRID1/WMS/ShadedRelief',
          params: {'layers': 'Raster'}
        }),
        visible: false
      }),
      new ol.layer.Tile({
        title: "Geologia",
        source: new ol.source.TileWMS({
          url: 'http://cbdgmapa.pgi.gov.pl/arcgis/services/kartografia/smgp50k/MapServer/WmsServer',
          params: {'layers': '0'}
        }),
        visible: false
      }),
      new ol.layer.Tile({
        title: "Siatka AZP",
        source: new ol.source.TileWMS({
          url: 'https://usluga.zabytek.gov.pl/AZP/service.svc/get',
          params: {'layers': 'Sekcja_arkusza_AZP,Numer_sekcji_AZP'}
        }),
        visible: false
      }),
      new ol.layer.Tile({
        title: "Badania powierzchniowe",
        source: new ol.source.TileWMS({
          url: 'http://pow.grodziska-warmia-mazury.pl/cgi-bin/qgis_mapserv.fcgi',
          params: {'layers': 'merged'}
        }),
        visible: false
      }),
      vectorLayer
    ],
    target: 'detail-map',
    view: new ol.View({
      center: ol.proj.fromLonLat([19.6957, 53.8084]),
      zoom: 15
    })
  });

  var listenerKey = vectorSource.on('change', function(e) {
    if (vectorSource.getState() == 'ready') {
      vectorSource.forEachFeature(function(feature) {
        if (feature.get('title') == initFeatureTitle) {
          map.getView().setCenter(ol.extent.getCenter(feature.getGeometry().getExtent()));
          return true;
        }
      });
    }
  });

  function bindInputs(layerid, layer) {
    var btn = $(layerid);
    btn.on('click', function() {
      if (btn.hasClass("active")) {
        layer.setVisible(false);
        btn.removeClass("active")
        if (layerid == '#layer9') {
          $('#map-legend').hide();
        }
      } else {
        layer.setVisible(true);
        btn.addClass("active");
        if (layerid == '#layer9') {
          $('#map-legend').show();
        }
      }
    });
  }
  map.getLayers().forEach(function(layer, i) {
    bindInputs('#layer' + i, layer);
    if (layer instanceof ol.layer.Group) {
      layer.getLayers().forEach(function(sublayer, j) {
        bindInputs('#layer' + i + j, sublayer);
      });
    }
  });
  $('#map-legend').hide();
}
