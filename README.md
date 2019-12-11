sigv4-wrapper
-------------

Wrapper class to sign Node.js http(s) request options using Amazon's
[AWS Signature Version 4](http://docs.amazonwebservices.com/general/latest/gr/signature-version-4.html).

Example
-------

```javascript
const { AWS4RequestSigner } = require('sigv4-wrapper');
const sigv4 = new AWS4RequestSigner();

// given an options object you could pass to https.request
const opts = {
  host: "abcde12345.execute-api.us-east-1.amazonaws.com",
  path: "/api/v1/example",
  method: "GET"
};

// using custom domain name
const opts = {
  host: "abcde12345.company-domain.com",
  service: "execute-api",
  region: "us-east-1",
  path: "/api/v1/example",
  method: "GET"
};

console.log(sigv4.getSignedRequest(opts));  // AWS credentials must be available in process.env
/*
{ host: 'abcde12345.company-domain.com',
  service: 'execute-api',
  region: 'us-east-1',
  path: '/api/v1/example',
  method: 'GET',
  headers:
   { 'X-Amz-Security-Token':
      'FwoGZXIvYXdzEK7//////////wEaDNnYw+NSplaorrBF7yKpAeqtKaMEFaqTUfq7ACrRYFMcNBUcF6cfcjSOYBdUlEAKbVbw77QL7WVo+...
     'X-Amz-Date': '20191211T064729Z',
     Authorization:
      'AWS4-HMAC-SHA256 Credential=ASIA26CME7LZRJJSKZ2U/20191211/us-east-1/execute-api/aws4_request, SignedHeade...
*/

// we can now use this to query AWS resources using the standard Node.js https API
https.request(sigv4.getSignedRequest(opts), res => {
  res.pipe(process.stdout);
}).end();
/*
{
  "key1": "value1",
  "key2": "value2"
},
...
*/
```
Another Example
---------------

```javascript
// set up post request options
const opts = {
  host: "abcde12345.execute-api.us-east-1.amazonaws.com",
  path: "/api/v1/example",
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  }
};

// set up request body payload
const body = JSON.stringify({
  foo: "bar"
});

// add body(string) argument
const req = https.request(sigv4.getSignedRequest(opts, body), res => {
  res.pipe(process.stdout);
});
req.write(body);
req.end();
/*
{
  "key1": "value1",
  "key2": "value2"
},
...
*/
```
