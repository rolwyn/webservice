import app from './api/app.js'

const port = process.env.PORT || 4200

app.listen(port, () => {
  console.log(`Web app listening at http://localhost:${port}`)
})