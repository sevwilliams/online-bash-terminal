const express = require('express');
const { exec } = require('child_process');
const app = express();
const PORT = process.env.PORT || 3000; // Use Render's dynamic port

app.use(express.json());
app.use(express.static(__dirname)); // Serves index.html

app.post('/run', (req, res) => {
  const input = req.body.command.trim();
  const isPython = input.startsWith('>>>');

  let command;
  if (isPython) {
    // Strip the >>> and run with python -c
    const pyCode = input.replace(/^>>> */, '');
    command = `python3 -c "${pyCode.replace(/"/g, '\\"')}"`;
  } else {
    // Default to Bash
    const forbidden = ['rm', 'shutdown', 'reboot', ':(){', 'mkfs', '>', '<'];
    if (forbidden.some(f => input.includes(f))) {
      return res.send('⚠️ Command blocked for safety.\n');
    }
    command = input;
  }

  exec(command, { timeout: 5000 }, (err, stdout, stderr) => {
    if (err) return res.send(stderr || err.message);
    res.send(stdout || ' ');
  });
});

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));

