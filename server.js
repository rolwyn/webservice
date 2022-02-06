import app from './api/app.js'

const port = process.env.PORT || 4300

app.listen(port, () => {
  console.log(`Web app listening at http://localhost:${port}`)
})