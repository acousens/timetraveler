const got = require('got');

const production = process.NODE_ENV === 'production';
const origin = production ? process.env.origin : '*'

exports.trigger = (req, res) => {

  res.set('Access-Control-Allow-Origin', origin);
  res.set('Access-Control-Allow-Methods', 'GET');

  const city = req.query.city;
  const authorized = req.get('origin') === origin || !production;

  if (authorized) {
	  if (typeof city === 'string') {
    	let data = getData(req.query.city).then(function(resp) {
          let status = 200;
          if (resp.error !== undefined) {
            status = 400;
            console.log(resp.error)
          }
		   res.status(status).send(resp);
    	});
    } else {
      res.status(400).send({error: 'Need city name'});
    }
  } else {
    res.send(404);
  }
};


async function getData(city) {
  let username = await getUserName();
  let url = 'https://secure.geonames.org/searchJSON?q=';
  url += `${encodeURIComponent(city)}&maxRows=2`;
  url += `&username=${username}`;

  try {
    const response = await got(url, {json: true});
    return response.body;
  } catch(err) {
    return {error: `Geonames: ${err}`}
  }
}

async function getUserName() {
  if (production) return process.env.username;
  const fs = require('fs');
  const path = require('path');
  const filepath = path.join(__dirname, 'secrets/username.txt');

  return new Promise((resolve, reject) => {
    fs.readFile(filepath, 'utf8', (err, data) => {
      if (err) reject({error: err})
      resolve(data)
    });
  })
}
