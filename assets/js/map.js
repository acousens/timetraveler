'use strict';

modulejs.define('map', ['ui', 'cronos'], function(ui, cronos) {

  const _self = {}

  let maps = {
    origin: null,
    target: null
  }

  _self.init = function(originCity) {
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

    setDefaultCoord(originCity);
  }

  async function setDefaultCoord(originCity) {
    //let url = 'http://secure.geonames.org/citiesJSON?'
    //north=44.1&south=-9.9&east=-22.4&west=55.2&lang=de
    //&username=

    let url = 'http://secure.geonames.org/searchJSON?q=';
    url += encodeURIComponent(originCity);
    url += '&maxRows=10';
    url += '&username='

    try {
      let response = await fetch(url, {
        method: 'GET',
      }).then(async function(resp) {
        let json = await resp.json();
        let coords = json.geonames[0];
        panMap('origin', [coords.lat, coords.lng]);
      })
    } catch(err) {

    }
  }

  function panMap(map, ll) {
    maps[map].panTo(ll, {animate: false})
  }

  return _self;

});