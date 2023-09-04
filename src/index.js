import express from 'express'
import mongoose from 'mongoose'
import {loginValidations, postCreateValidations, registerValidations} from "./validations/validations.js"
import checkAuth from "./utils/checkAuth.js"
import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";

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

app.post('/auth/login', loginValidations, UserController.login)
app.post('/auth/register', registerValidations, UserController.register)
app.get('/auth/me', checkAuth, UserController.me)

app.get('/posts', checkAuth, PostController.getAll)
app.get('/posts/:id', checkAuth, PostController.getOne)
app.post('/posts', checkAuth, postCreateValidations, PostController.createPost)
//app.delete('/posts',checkAuth, PostController.remove)
//app.path('/posts', PostController.update)

app.listen(port, () => {
    console.log(`Server OK`)
})