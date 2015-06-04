# HeatMap
CMV HeatMap Widget, 

Requires the sublayer control enhancment impelmented by Gregg Roemhildt
https://github.com/cmv/cmv-app/pull/401



Configuration:

            heatMap: {
                include: true,
                id: 'heatMap',
                type: 'titlePane', //titlePane, invisible
                canFloat: true,
                title: '<i class="icon-large icon-road"></i>&nbsp;&nbsp;HeatMap',
                path: 'widgets/HeatMap',
                position: 28,
                open: false,
                options: {
                    map: true,
                }
            }
            
  Sublayer Menu Configuration
  
            type: 'dynamic',
            url: 'https://gis.eparm.net/eparmgis/rest/services/XXXXXXXX/MapServer',
            title: 'Facilities',
            options: {
                id: 'Facilities',
                opacity: 1.0,
                visible: false,
                imageParameters: imageParameters
            },
            identifyLayerInfos: {
                layerIds: [0, 1, 2, 3, 4, 5, 6]
            },
            layerControlLayerInfos: {
                metadataUrl: true,
                menu: [{
                      label: 'Create Heatmap',
                      topic: 'heatMap',
                      iconClass: 'fa fa-search fa-fw'
                  },{
                      label: 'Hide Heatmap',
                      topic: 'hideHeatMap',
                      iconClass: 'fa fa-search fa-fw'
                  },{
                      label: 'Show Heatmap',
                      topic: 'showHeatMap',
                      iconClass: 'fa fa-search fa-fw'
                  },{
                      label: 'Remove Heatmap',
                      topic: 'removeHeatMap',
                      iconClass: 'fa fa-search fa-fw'
                  }]              
            }




