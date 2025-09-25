import express from 'express'
const app = express()
const port = 3000

app.get('/', (req, res) => {
  const status = {
    Status: 'Running',
    message: 'Server is up and running',
  }
  res.send(status)
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
