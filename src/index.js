import express from 'express'
// import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import {registerValidations} from "./validations/auth.js";
import {validationResult} from 'express-validator'
import UserModel from './models/User.js'

mongoose.connect('mongodb+srv://aribragimov17:17052002Artem@cluster0.cc0jbed.mongodb.net/?retryWrites=true&w=majority')
    .then(() => {
        console.log('DB OK')
    })
    .catch((err) => {
        console.log('DB error', err)
    })

const app = express()
const port = 3000
app.use(express.json())

app.post('/auth/reg',registerValidations, async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        res.status(400).json(errors.array())
    }

    const password = req.body.password
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    const doc = new UserModel({
        fullName: req.body.fullName,
        email: req.body.email,
        passwordHash,
        avatar: req.body.avatar
    })

    const user = await doc.save()

    res.json(user)
})

app.listen(port, () => {
    console.log(`Server OK`)
})