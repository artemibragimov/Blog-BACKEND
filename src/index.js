import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import {registerValidations} from "./validations/auth.js";
import {validationResult} from 'express-validator'
import UserModel from './models/User.js'

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

app.post('/auth/reg', registerValidations, async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json(errors.array())
        }

        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const doc = new UserModel({
            fullName: req.body.fullName,
            email: req.body.email,
            passwordHash: hash,
            avatar: req.body.avatar
        })

        const user = await doc.save()

        const token = jwt.sign({
                _id: user._id
            },
            'secret123',
            {
                expiresIn: '30d'
            })

        const {passwordHash, ...userData} = user._doc

        res.json({
            ...userData,
            token
        })
    } catch (err) {
        res.status(500).json({
            message: 'Не удалось зарегестрироваться'
        })
    }
})

app.listen(port, () => {
    console.log(`Server OK`)
})