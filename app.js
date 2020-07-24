/* github-iss
 * Jason Ball
 */

// Imports
const axios = require('axios').default;
const express = require('express');
const { createCanvas } = require('canvas');

// Constants
const url = 'https://api.wheretheiss.at/v1/satellites/25544';

// Globals
let iss = {};
const canvas = createCanvas(750, 200);
const ctx = canvas.getContext('2d');

// Express "server"
const app = express();

// Get ISS data
async function getData() {
  const { data } = await axios.get(url);
  iss = data;
  iss.latitude = Math.round((iss.latitude + Number.EPSILON) * 1000) / 1000;
  iss.longitude = Math.round((iss.longitude + Number.EPSILON) * 1000) / 1000;
  iss.velocity /= 3600;
  iss.velocity = Math.round((iss.velocity + Number.EPSILON) * 1000) / 1000;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = '48px "Lucida Console"';
  ctx.fillText(' Latitude:', 10, 50);
  ctx.fillText('Longitude:', 10, 100);
  ctx.fillText(' Velocity:', 10, 150);
  ctx.fillText(`${iss.latitude}°`, 320, 50);
  ctx.fillText(`${iss.longitude}°`, 320, 100);
  ctx.fillText(`${iss.velocity} km/s`, 320, 150);
}
setInterval(getData, 1000);

// Main route
app.get('/', (req, res) => {
  res.send(canvas.toDataURL());
});

// Start listening when there is data available
getData()
  .then(() => app.listen(3000));
