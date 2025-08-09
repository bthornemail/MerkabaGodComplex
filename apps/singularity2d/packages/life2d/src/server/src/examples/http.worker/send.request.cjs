const http = require('http');

function sendRequest() {
  const data = JSON.stringify({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a poetic assistant, skilled in explaining complex programming concepts with creative flair."
      },
      {
        role: "user",
        content: "Compose a poem that explains the concept of recursion in programming."
      }
    ]
  });

  const options = {
    hostname: 'api.openai.com',
        // port: 443,
    // port: 80,
    path: '/v1/chat/completions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer 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',
      'Content-Length': data.length
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers)}`);
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      if (res.statusCode === 200) {
        try {
          const responseJson = JSON.parse(data);
          const assistantMessage = responseJson.choices[0].message.content;
          console.log('Assistant Message:', assistantMessage);
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      } else {
        console.error('Request failed:', res.statusCode, data);
      }
    });
  });

  req.on('error', (error) => {
    console.error(error);
  });

  req.write(data);
  req.end();
}

sendRequest();
// module.exports = sendRequest;

