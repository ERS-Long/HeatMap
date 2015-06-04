define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/_base/lang',
    'dojo/dom', 
    'dojo/domReady!',
    'dojo/on',
    'dojo/topic',
    'dojo/text!./HeatMap/templates/HeatMap.html',
    'esri/layers/FeatureLayer',
    'esri/renderers/HeatmapRenderer',
    'esri/InfoTemplate',
    'dojo/_base/array',
    'dojo/dom-construct',
    'xstyle/css!./HeatMap/css/HeatMap.css'

], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, lang, dom, ready, on, topic, HeatMapTemplate, FeatureLayer, HeatmapRenderer, InfoTemplate, arrayUtils, domConstruct, css) {

    var heatmapFeatureLayer;
    var heatmapRenderer;
    var blurCtrl;

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        widgetsInTemplate: true,
        templateString: HeatMapTemplate,

        postCreate: function(){
            this.inherited(arguments);
        //    this.map.on('extent-change', lang.hitch(this, 'initHeatMap'));

            this.initHeatMap(this.map);
        },

        initHeatMap: function (map) {
            topic.subscribe('LayerControl/heatMap', function (r) {
        //        console.log(r.layer.url); //layer id
        //        console.log(r.subLayer.id); //array of set visible layer ids

                if (heatmapFeatureLayer)
                    map.removeLayer(heatmapFeatureLayer);

                var infoTemplate = new InfoTemplate("Facility details", "");

                var serviceURL = r.layer.url + '/' + r.subLayer.id;
                var heatmapFeatureLayerOptions = {
                  mode: FeatureLayer.MODE_SNAPSHOT,
                  infoTemplate: infoTemplate,
                  outFields: ["Fac_FRSNo"]
                };
                heatmapFeatureLayer = new FeatureLayer(serviceURL, heatmapFeatureLayerOptions);

                //var heatmapRenderer = new HeatmapRenderer();
                /*
                var heatmapRenderer = new HeatmapRenderer({
                    colors: ["rgba(0, 0, 255, 0)","rgb(0, 0, 255)","rgb(255, 0, 255)", "rgb(255, 0, 0)"],
                    blurRadius: 20,
                    maxPixelIntensity: 250,
                    minPixelIntensity: 10
                });
*/
                heatmapRenderer = new HeatmapRenderer({
                  blurRadius: blurCtrl.value,
                  colorStops: [
                      { ratio: 0, color: "rgba(250, 0, 0, 0)" },
                      { ratio: 0.6, color: "rgb(250, 0, 0)" },
                      { ratio: 0.85, color: "rgb(250, 150, 0)"},
                      { ratio: 0.95, color: "rgb(255, 255, 0)"}],
                });     
                           
                heatmapFeatureLayer.setRenderer(heatmapRenderer);
                map.addLayer(heatmapFeatureLayer);
            });

            topic.subscribe('LayerControl/removeHeatMap', function (r) {
                if (heatmapFeatureLayer)
                    map.removeLayer(heatmapFeatureLayer);
            }); 
            topic.subscribe('LayerControl/hideHeatMap', function (r) {
                if (heatmapFeatureLayer)
                    heatmapFeatureLayer.hide();
            });
            topic.subscribe('LayerControl/showHeatMap', function (r) {
                if (heatmapFeatureLayer)
                    heatmapFeatureLayer.show();
            });                                          
        },
        startup: function () {
            this.inherited(arguments);
            blurCtrl = document.getElementById('blurControl');

            var sliders = document.querySelectorAll(".blurInfo p~input[type=range]");

            var addLiveValue = function (ctrl){
                var val = ctrl.previousElementSibling.querySelector("span");
                ctrl.addEventListener("input", function (evt){
                    val.innerHTML = evt.target.value;
                });
            };

            for (var i = 0; i < sliders.length; i++) {
                addLiveValue(sliders.item(i));
            }

            blurCtrl.addEventListener("change", function (evt){
                var r = +evt.target.value;
                if (heatmapRenderer)
                {
                    if (r !== heatmapRenderer.blurRadius) {
                        heatmapRenderer.blurRadius = r;
                        heatmapFeatureLayer.redraw();
                    }
                }
            });
        }
    });
});
