import express from 'express'
import multer from 'multer'
import mongoose from 'mongoose'
import {loginValidations, postCreateValidations, registerValidations} from "./validations/validations.js"
import checkAuth from "./utils/checkAuth.js"
import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";

const app = express()
const port = 3000
app.use(express.json())
app.use('/uploads', express.static('C:\\CODE\\Blog-BACKEND\\src\\uploads'))

mongoose.connect('mongodb+srv://aribragimov:17052002Artem@cluster0.9ivw93j.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => {
        console.log('DB OK')
    })
    .catch((err) => {
        console.log('DB error', err)
    })

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'C:\\CODE\\Blog-BACKEND\\src\\uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({storage: storage})


app.post('/auth/login', loginValidations, UserController.login)
app.post('/auth/register', registerValidations, UserController.register)
app.get('/auth/me', checkAuth, UserController.me)

app.post('/uploads', upload.single('image'), (req, res) => {
    res.json({
        success: true
    })
})

app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidations, PostController.createPost)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.put('/posts/:id', checkAuth, PostController.update)

app.listen(port, () => {
    console.log(`Server OK`)
})