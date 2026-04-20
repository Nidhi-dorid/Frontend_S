const https = require('https');
const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
const payload = '--' + boundary + '\r\nContent-Disposition: form-data; name="cityId"\r\n\r\n1\r\n--' + boundary + '--\r\n';

const options = {
  hostname: 'pothole-backend-gbud.onrender.com',
  path: '/api/potholes/report',
  method: 'POST',
  headers: {
    'Content-Type': 'multipart/form-data; boundary=' + boundary,
    'Content-Length': payload.length
  }
};

const req = https.request(options, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log('Status', res.statusCode, body));
});
req.on('error', console.error);
req.write(payload);
req.end();
