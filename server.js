const app = require('./api/app')

const port = process.env.PORT || 4300

app.listen(port, () => {
  console.log(`Web app listening at http://localhost:${port}`)
})