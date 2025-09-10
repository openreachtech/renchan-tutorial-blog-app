import http from 'http';

const postData = JSON.stringify({
  query: 'query Customer { customer { id username inviteCode CustomerDetail { email } } }'
});

const options = {
  hostname: 'localhost',
  port: 3900,
  path: '/graphql-customer',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  console.log(`statusCode: ${res.statusCode}`);
  console.log(`headers:`, res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.write(postData);
req.end();


