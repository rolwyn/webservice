const app = require('./api/app')

const port = 3200

// listens on port 3200
app.listen(port, () => {
  console.log(`Web app listening at http://localhost:${port}`)
})