'use strict';

(function() {

  const cronos = modulejs.require('cronos');
  const ui = modulejs.require('ui');
  const map = modulejs.require('map');

  let zone = moment.tz.guess();
  let arr = zone.split('/');
  let city = arr[arr.length-1];

  cronos.init(zone);
  ui.init();
  map.init(city);

})()

