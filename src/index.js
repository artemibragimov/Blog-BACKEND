import express from 'express'
import mongoose from 'mongoose'
import {registerValidations} from "./validations/auth.js"
import checkAuth from "./utils/checkAuth.js"
import * as UserController from "./controllers/UserController.js";

mongoose.connect('mongodb+srv://aribragimov:17052002Artem@cluster0.9ivw93j.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => {
        console.log('DB OK')
    })
    .catch((err) => {
        console.log('DB error', err)
    })

const app = express()
const port = 3000
app.use(express.json())

app.post('/auth/login', UserController.login)
app.post('/auth/register', registerValidations, UserController.register)
app.get('/auth/me', checkAuth, UserController.me)

app.listen(port, () => {
    console.log(`Server OK`)
})