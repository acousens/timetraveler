'use strict';

modulejs.define('cronos', function() {

  const _self = {};

  let dates = {
    origin: null,
    target: null
  }

  const defaults = {
    origin: 'America/New_York',
    target: 'Europe/Paris'
  }

  _self.init = function() {
    for (let k in dates) {
      dates[k] = moment();
      updateZone(k, defaults[k]);
    }
  }

  _self.get = function() {
    return dates;
  }

  _self.zoneChanged = function(map, ll) {
    let latlng = [ll.lat, ll.lng];
    let zone = tzlookup(latlng[0], latlng[1]);
    if (map === 'origin') {
      let clone = dates.origin.clone();
      updateZone(map, zone)
      dates.origin
        .hour(clone.hour())
        .minute(clone.minute())
      refresh('target');
    } else {
      updateZone(map, zone)
    }
    return dates;
  }

  _self.timeChanged = function(timeString) {
    dates.origin = calcDate(null, timeString);
    refresh('target');
    return dates;
  }

  _self.dateChanged = function(mdate) {
    let zone = dates.origin.tz();
    dates.origin = calcDate(mdate);
    updateZone('origin', zone)
    refresh('target');
    return dates;
  }

  function refresh(map) {
    if (map === 'target') {
      let zone = dates.target.tz();
      dates.target = dates.origin.clone();
      updateZone(map, zone);
    }
  }

  function updateZone(map, zone) {
    dates[map].tz(zone);
  }

  function calcDate(date=null, timeString=null) {
    let next, updated;
    if (date !== null) {
      updated = date;
      updated.hour(dates.origin.hour()).minute(dates.origin.minute())
    } else if (timeString !== null) {
      let arr = timeString.split(':'),
          hour = arr[0],
          minute = arr[1];
      updated = dates.origin.clone();
      updated.hour(hour).minute(minute);
    }
    return updated;
  }

  return _self;

});

