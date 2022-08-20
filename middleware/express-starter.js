module.exports = function() {

  const server = `const express = require('express');
  const app = express();
  const port = 3000;
  
  app.get('/', function(req, res) {
    res.send('Hello World!')
  });
  
  app.listen(port, function() {
    console.log(\`Example app listening on port \${port}!\`)
  });
  `;
  const fs = require("fs");
  fs.writeFileSync(PROCESS_PATH+"/server.js", server);
}
