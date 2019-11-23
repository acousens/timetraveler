'use strict';

modulejs.define('ui', ['cronos'], function(cronos) {

  const _self = {};

  const displays = {
    origin: document.getElementById('origin-display'),
    target: document.getElementById('target-display')
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

    let dates = cronos.get()
    for (let k in dates) {
      update(k, dates[k])
    }

    let originHour = dates.origin.hour();
    let originMinute = dates.origin.minute();

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
          xoption.textContent = `${dates.origin.format("h:mm a")}`;
          xoption.value = `${dates.origin.hour()}:${dates.origin.minute()}`;
          timepicker.insertBefore(xoption, option)
          timepicker.selectedIndex = option.index - 1;
        }

      }
    }

    timepicker.addEventListener('change', timeChanged);
  }

  _self.update = update
  _self.updateAll = function(data) {
    for (let k in data) {
      update(k, data[k])
    }
  }

  function dateChanged(mdate) {
    let moments = cronos.dateChanged(mdate)
    for (let k in moments) {
      update(k, moments[k])
    }
  }

  function timeChanged(e) {
    let moments = cronos.timeChanged(e.target.value);
    for (let k in moments) {
      update(k, moments[k])
    }
  }

  function update(display, data) {
    displays[display].getElementsByClassName('display-time')[0]
      .textContent = formatted(data, 'time');
    displays[display].getElementsByClassName('display-date')[0]
      .textContent = formatted(data, 'date');

      //`${formatted(data)} - ${data.tz()}`
  }

  function formatted(data, part = 'full') {
    let parts = {
      full: data.format("dddd, MMMM Do YYYY, h:mm a"),
      date: data.format("dddd, MMMM Do YYYY"),
      time: data.format("h:mm a")
    }
    return parts[part]
  }

  return _self;
});
