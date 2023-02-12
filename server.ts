const express = require('express');
const app = express();

app.get('/', (req: any, res: { send: (arg0: string) => void; }) => {
  res.send('Hello from Express!');
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
