const express = require('express');
const app = express();
const { ping, posts } = require('./controller/controller');

app.get('/api/ping', ping);

app.get('/api/posts/:tags?/:sortBy?/:direction?', posts);

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
