import PostModel from "../models/Post.js";
import {validationResult} from "express-validator";

export const createPost = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json(errors.array())
        }

        const doc = new PostModel({
            title: req.body.title,
            text123: req.body.text123,
            tags: req.body.tags,
            user: req.userId,
            imageUrl: req.body.imageUrl
        })

        const Post = await doc.save()

        res.json(Post)
    } catch (err) {
        res.status(500).json({
            message: 'Не удалось создать запись'
        })
    }
}
export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec() //добавление связи id пользователя с постами

        if (!posts) {
            return res.status(500).json({
                message: 'Не удалось загрузить статьи'
            })
        }
        res.json(posts)
    } catch (err) {
        return res.status(500).json({
            message: 'Не удалось загрузить статьи'
        })
    }
}