'use strict';

modulejs.define('cronos', function() {

  const _self = {};

  let dates = {
    origin: null,
    dest: null
  }

  const defaults = {
    origin: 'America/New_York',
    dest: 'Europe/Paris'
  }

  _self.init = function(originZone) {
    defaults.origin = originZone;
    for (let k in dates) {
      dates[k] = moment();
      updateZone(k, defaults[k]);
    }
  }

  _self.get = function() {
    return dates;
  }

  _self.markerMoved = function(marker, ll) {
    let zone = getZoneFromCoord(ll)
    if (marker === 'origin') {
      let clone = dates.origin.clone();
      updateZone(marker, zone)
      // Re-apply current time
      dates.origin
        .hour(clone.hour())
        .minute(clone.minute())
      updateDest();
    } else {
      updateZone(marker, zone)
    }
    return dates;
  }

  _self.timeChanged = function(timeString) {
    dates.origin = calcDate(null, timeString);
    updateDest();
    return dates;
  }

  _self.dateChanged = function(mdate) {
    let zone = dates.origin.tz();
    dates.origin = calcDate(mdate);
    updateZone('origin', zone)
    updateDest();
    return dates;
  }

  function updateDest() {
    let zone = dates.dest.tz();
    dates.dest = dates.origin.clone();
    updateZone('dest', zone);
  }

  function getZoneFromCoord(ll) {
    let latlng = [ll.lat, ll.lng];
    return tzlookup(latlng[0], latlng[1]);
  }

  function updateZone(which, zone) {
    dates[which].tz(zone);
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
