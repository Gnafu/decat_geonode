/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
    pages: [{
        name: "mapviewer",
        path: "/",
        component: require('./pages/MapViewer')
    }, {
        name: "mappermalink",
        path: "/permalink/map/:mapId/:hazardId/:annotationId",
        component: require('./pages/MapPermaLink')
    }, {
        name: "hazardpermalink",
        path: "/permalink/hazard/:hazardId/:annotationId",
        component: require('./pages/HazardPermaLink')
    }],
    pluginsDef: require('./plugins.js'),
    initialState: {
        defaultState: {
            mousePosition: {enabled: false},
            controls: {
                help: {
                    enabled: false
                },
                print: {
                    enabled: false
                },
                toolbar: {
                    active: null,
                    expanded: false
                },
                drawer: {
                    enabled: true,
                    menu: "1"
                },
                RefreshLayers: {
                    enabled: false,
                    options: {
                        bbox: true,
                        search: true,
                        title: false,
                        dimensions: false
                    }
                },
                cookie: {
                    enabled: false,
                    seeMore: false
                }
            },
            alerts: {
                currentInterval: {
                    label: "all"
                },
                minZoom: 0
            }
        },
        mobile: {
            mapInfo: {enabled: true, infoFormat: 'text/html' },
            mousePosition: {enabled: true, crs: "EPSG:4326", showCenter: true}
        }
    },
    storeOpts: {
        persist: {
            whitelist: ['security']
        }
    }
};
