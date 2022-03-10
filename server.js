const app = require('./api/app')

const port = 3800

// listens on port 3800
app.listen(port, () => {
  console.log(`Web app listening at ${port}`)
})