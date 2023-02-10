const Z = require('zod')
const Fs = require('fs')
const Path = require('path')
const Axios = require('axios')
const Express = require('express')

const PORT = process.env.PORT || 4444

const app = Express()

app.use(Express.static('public'))
app.use(Express.urlencoded({ extended: true }))

const validator = Z.object({
    full_name: Z.string(),
    email: Z.string().email(),
    company: Z.string(),
    job_title: Z.string(),
    job_function: Z.string(),
    password: Z.string().min(8).max(12).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$/)
})

app.get('/success', function (request, response) {
    return response.sendFile(
        Path.resolve(__dirname, 'pages', 'success.html')
    )
})

app.get('/failure', function (request, response) {
    return response.sendFile(
        Path.resolve(__dirname, 'pages', 'failure.html')
    )
})

app.post('/customers', function (request, response) {
    const result = validator.safeParse(request.body)

    if (result.success === false) {
        return response.redirect('/failure')
    }

    // Validate POST data payload
    // Redirect to success or failure page based on results.
    return response.redirect('/success')
})

app.listen(PORT, () => {
    console.log(`Server started on http://127.0.0.1:${PORT}`)
})
