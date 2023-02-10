const Cors = require('cors')
const Express = require('express')

const app = Express()

const PORT = process.env.PORT || 4343

app.use(Cors())

app.post('/', function (request, response) {
    return response.status(204).json([])
})

app.listen(PORT, () => {
    console.log(`Server running at: http://127.0.0.1:${PORT}`)
})
