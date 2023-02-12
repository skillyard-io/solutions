const Z = require('zod')
const Fs = require('fs')
const Path = require('path')
const Axios = require('axios')
const Express = require('express')

const PORT = process.env.PORT || 4444
const PLACEHOLDER_ORIGIN_URL = 'PLACEHOLDER_ORIGIN_URL'

function getPage(name) {
    return Fs.readFileSync(
        Path.resolve(__dirname, 'pages', `${name}.html`)
    ).toString()
}

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
    let content = getPage('success')

    content = content.replace(PLACEHOLDER_ORIGIN_URL, request.query.to)

    return response.send(content)
})

app.get('/:social/login', function (request, response) {
    const failureRedirectPath = `/failure?to=${request.headers['origin']}`
    const successRedirectPath = `/success?to=${request.headers['origin']}`

    return response.redirect(successRedirectPath)
})

app.get('/failure', function (request, response) {
    
    let content = getPage('failure')

    content = content.replace(PLACEHOLDER_ORIGIN_URL, request.query.to)

    return response.send(content)
})

app.post('/customers', async function (request, response) {
    const failureRedirectPath = `/failure?to=${request.headers['origin']}`
    const successRedirectPath = `/success?to=${request.headers['origin']}`

    const result = validator.safeParse(request.body)

    if (result.success === false) {
        return response.redirect(failureRedirectPath)
    }

    try {
        await Axios.post('https://contentful-customers-store.up.railway.app/', result.data)
    } catch (e) {
        return response.redirect(failureRedirectPath)
    }

    return response.redirect(successRedirectPath)
})

app.listen(PORT, () => {
    console.log(`Server started on http://127.0.0.1:${PORT}`)
})
