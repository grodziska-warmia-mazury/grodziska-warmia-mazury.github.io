Proj4js.defs["EPSG:2180"] = "+proj=tmerc +lat_0=0 +lon_0=19 +k=0.9993 +x_0=500000 +y_0=-5300000 +ellps=GRS80 +units=m +no_defs";
var prefix = "";

$(document).ready(function() {

    var mapProj = new OpenLayers.Projection("EPSG:4326");

    var layer = new OpenLayers.Layer.Vector("Badania", {
                    strategies: [new OpenLayers.Strategy.BBOX({resFactor: 1.1})],
                    protocol: new OpenLayers.Protocol.HTTP({
                        url: "/assets/points.txt",
                        format: new OpenLayers.Format.Text()
                    }),
                    projection: mapProj
                });

	var map = new OpenLayers.Map('map', {
              projection: new OpenLayers.Projection("EPSG:900913"),
              units: 'm',
              maxExtent: new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34),
              layers: [
                new OpenLayers.Layer.OSM(),
                    // "Google Physical",
                    // {type: google.maps.MapTypeId.TERRAIN}),
                layer
            ]
    });

	var firstLoad = true;
	map.zoomToMaxExtent();

    // Interaction; not needed for initial display.
    selectControl = new OpenLayers.Control.SelectFeature(layer);
    map.addControl(selectControl);
    selectControl.activate();
    layer.events.on({
        'featureselected': onFeatureSelect,
        'loadend': function(evnt) {
        	if (firstLoad) {
        		firstLoad = false;
        		map.zoomToExtent(layer.getDataExtent());
        	}
        }
    });
});


// Needed only for interaction, not for the display.
function onPopupClose(evt) {
    // 'this' is the popup.
    var feature = this.feature;
    if (feature.layer) { // The feature is not destroyed
        selectControl.unselect(feature);
    } else { // After "moveend" or "refresh" events on POIs layer all
             //     features have been destroyed by the Strategy.BBOX
        this.destroy();
    }
}
function onFeatureSelect(evt) {
    feature = evt.feature;
    $("#previewPane .previewTitle").html(feature.attributes.title);
    $("#previewPane .previewImg img").attr("src", prefix + feature.attributes.img);
    $("#previewPane .previewTxt").html(feature.attributes.description);
    $("#previewPane .previewLink a").attr("href", prefix + feature.attributes.link);
    console.log(feature.attributes.img);
    if (feature.attributes.img == "/img/empty.png") {
        if (feature.attributes.link == "/img/sondaz.png") {
            $("#previewPane .previewLink a").hide();
        } else {
            $("#previewPane .previewLink a").show();
            $("#previewPane .previewLink a").html("Sprawozdanie z sondażu");
        }
    } else {
        $("#previewPane .previewLink a").show();
        $("#previewPane .previewLink a").html("Przejdź dalej &raquo;");
    }

}
