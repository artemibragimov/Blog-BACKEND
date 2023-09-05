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

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id
        const post = await PostModel.findOneAndUpdate(
            {_id: postId},
            {$inc: {viewsCount: 1}},
            {new: true}
        )
        if (!post) {
            return res.status(404).json({
                message: 'Статья не найдена'
            })
        }
        res.json(post)
    } catch (err) {
        return res.status(500).json({
            message: 'Не удалось загрузить статью'
        })
    }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id
         await PostModel.findOneAndRemove({_id: postId}).then((err, doc) => {
            if (err) {
                return res.status(5000).json({
                    message: 'Не удалось удалить статью'
                })
            }

            res.json({
                message: 'Статья успешно удалена'
            })
        })
    } catch (err) {
        return res.status(500).json({
            message: 'Не удалось удалить статью'
        })
    }
}