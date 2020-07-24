/* github-iss: serverless
 * Jason Ball
 */

const axios = require('axios').default;
const { createCanvas } = require('canvas');

module.exports = (req, res) => {
  const canvas = createCanvas(750, 200);
  const ctx = canvas.getContext('2d');
  let iss = {};

  axios.get('https://api.wheretheiss.at/v1/satellites/25544')
    .then(({ data }) => {
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

      res.send(canvas.toDataURL());
    });
};
