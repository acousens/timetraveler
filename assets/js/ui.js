'use strict';

modulejs.define('ui', ['cronos'], function(cronos) {

  const _self = {};

  const display = {
    origin: {
      time: document.querySelector('[data-origin-time]'),
      date: document.querySelector('[data-origin-date]'),
      zone: document.querySelector('[data-origin-zone]')
    },
    dest: {
      time: document.querySelector('[data-dest-time]'),
      date: document.querySelector('[data-dest-date]'),
      zone: document.querySelector('[data-dest-zone]')
    }
  }

  const datepicker = document.getElementById('datepicker');
  const timepicker = document.getElementById('timepicker');

  let picker;

  _self.init = function() {
    picker = new Pikaday({
      field: datepicker,
      format: 'D MMM YYYY',
      defaultDate: new Date(),
      setDefaultDate: true,
      onSelect: function(date) {
        dateChanged(this.getMoment());
      }
    });

    let moments = cronos.get()
    update(moments);

    let originHour = moments.origin.hour();
    let originMinute = moments.origin.minute();

    let options = timepicker.getElementsByTagName('option')
    let xoption = null;
    for (let i = 1; i < 25; i++) {
      let hour = i, minute;
      for (let j = 0; j < 4; j++) {
        minute = j * 15;
        let m = moment();
        m.hour(hour);
        m.minute(minute);

        let option = document.createElement('option');
        option.textContent = `${m.format("h:mm a")}`;
        option.value = `${m.hour()}:${m.minute()}`
        timepicker.appendChild(option)

        if (xoption === null && originHour === hour && (minute >= originMinute || minute >= 45) ) {
          xoption = document.createElement('option');
          xoption.textContent = `${moments.origin.format("h:mm a")}`;
          xoption.value = `${moments.origin.hour()}:${moments.origin.minute()}`;
          timepicker.insertBefore(xoption, option)
          timepicker.selectedIndex = option.index - 1;
        }

      }
    }

    timepicker.addEventListener('change', timeChanged);
  }

  _self.markerMoved = markerMoved;

  function dateChanged(mdate) {
    let moments = cronos.dateChanged(mdate)
    update(moments)
  }

  function timeChanged(e) {
    let moments = cronos.timeChanged(e.target.value);
    update(moments)
  }

  function markerMoved(marker, latlng) {
    let moments = cronos.markerMoved(marker, latlng);
    update(moments)
  }

  function update(moments) {
    let parts = ['time', 'date', 'zone']
    for (let k in moments) {
      for (let part of parts) {
        display[k][part].textContent = formatted(moments[k], part)
      }
    }
  }

  function formatted(data, part = 'full') {
    let parts = {
      full: data.format("dddd, MMMM Do YYYY, h:mm a"),
      date: data.format("dddd, MMMM Do YYYY"),
      time: data.format("h:mm a"),
      zone: data.tz()
    }
    return parts[part]
  }

  return _self;
});
