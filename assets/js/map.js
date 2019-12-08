'use strict';

modulejs.define('map', ['ui', 'cronos'], function(ui, cronos) {

  const _self = {}

  let map = null;
  let markers = {
    origin: null,
    dest: null
  };
  let arc;
  let lls = {
    origin: [40.713955826286046, -73.60839843750001],
    dest: [48.864714761802794, 2.3730468750000004]
  }
  let icon = L.divIcon({className: 'div-icon'})

  _self.init = async function(originCity) {
    map = L.map('map', {
      center: [40.713955826286046, -73.60839843750001],
      zoom: 6,
      zoomControl: false
    })

    L.tileLayer.provider('Esri.WorldTopoMap').addTo(map);
    L.control.zoom({position: 'bottomright'}).addTo(map);

    for (let k in markers) {
      markers[k] = L.marker(lls[k], {
        icon: icon,
        draggable: true,
        name: k
      });
      markers[k].on('dragend', (e) => {
        ui.markerMoved(e.target.options.name, e.target._latlng)
      })
      markers[k].on('drag', (e) => {
        lls[e.target.options.name] = e.latlng;
        updateArc();
      })
      markers[k].addTo(map)
    }

    map.on('click', function(e) {

      //let newDates = cronos.zoneChanged(e.latlng);
      //ui.updateAll(newDates)
    })

    let ll = await getCityCoords(originCity);
    markers.origin.setLatLng(ll)
    lls.origin = ll;
    updateArc()

    map.fitBounds([ll, lls.dest])
    //panMap(ll);
  }

  function updateArc() {
    if (arc != undefined) arc.removeFrom(map)

    arc = L.Polyline.Arc(lls.origin, lls.dest, {
      weight: 1,
      color: '#4d4d4d',
      dashArray: '1 3 1',
      vertices: 200
    }).addTo(map);
  }

  async function getCityCoords(city) {

    let url = `https://us-central1-thisadrian.cloudfunctions.net/timetraveler-geonames?city=${city}`;
    if (window.location.hostname === 'localhost') {
      url = `http://localhost:8080?city=${city}`
    }

    try {
      return await fetch(url, {
        method: 'GET',
      }).then(async function(resp) {
        if (resp.ok) {
          let json = await resp.json();
          if (json.error === undefined) {
            return [json.geonames[0].lat, json.geonames[0].lng];
          } else {
            console.error(resp.error);
          }
        } else {
          console.error(resp);
        }
      })
    } catch(err) {
      console.error(err);
    }
  }

  function panMap(ll) {
    map.panTo(ll, {animate: false})
  }

  return _self;

});
