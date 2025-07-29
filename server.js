const express = require('express');
const { exec } = require('child_process');
const app = express();
const PORT = process.env.PORT || 3000; // Use Render's dynamic port

app.use(express.json());
app.use(express.static(__dirname)); // Serves index.html

app.post('/run', (req, res) => {
  const command = req.body.command;
  const forbidden = ['rm', 'shutdown', 'reboot', 'mkfs', '>', '<', ':(){']; // crude filter
  if (forbidden.some(f => command.includes(f))) {
    return res.send('⚠️ Command blocked for safety.\n');
  }
  exec(command, { timeout: 5000 }, (err, stdout, stderr) => {
    if (err) return res.send(stderr || err.message);
    res.send(stdout || ' ');
  });
});

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));

