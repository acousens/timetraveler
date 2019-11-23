'use strict';

modulejs.define('map', ['ui', 'cronos'], function(ui, cronos) {

  const _self = {}

  let maps = {
    origin: null,
    target: null
  }

  _self.init = function() {
    maps.origin = L.map('origin-map', {
      center: [40.713955826286046, -73.60839843750001],
      zoom: 6,
      zoomControl: false
    })
    maps.target = L.map('target-map', {
      center: [48.864714761802794, 2.3730468750000004],
      zoom: 6,
      zoomControl: false
    })

    for (let k in maps) {
      L.tileLayer.provider('Stamen.TonerLite').addTo(maps[k]);
      L.control.zoom({position: 'bottomright'}).addTo(maps[k]);
      maps[k].on('click', function(e) {
        let newDates = cronos.zoneChanged(k, e.latlng);
        ui.updateAll(newDates)
      })
    }
  }

  return _self;
});