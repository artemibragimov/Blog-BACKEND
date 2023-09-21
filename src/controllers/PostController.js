import PostModel from "../models/Post.js";
import CommentModel from "../models/Comment.js"

export const createPost = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text123: req.body.text123,
            tags: req.body.tags.split(','),
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

        if (req.query.sort === 'true') {
            let sortPosts = posts.sort((a, b) => b.viewsCount - a.viewsCount)
            return res.json(sortPosts)
        }

        res.json(posts.reverse())
    } catch (err) {
        return res.status(500).json({
            message: 'Не удалось загрузить статьи'
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const post = await PostModel.findOneAndUpdate(
            {_id: req.params.id},
            {$inc: {viewsCount: 1}},
            {new: true}
        ).populate('user').exec()
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
        const post = await PostModel.findOne({_id: req.params.id})
        if (!post) {
            return res.status(404).json({
                message: 'Статья не найдена'
            })
        }
        await PostModel.findOneAndRemove({_id: req.params.id})
        res.json({
            message: 'Статья успешно удалена'
         })
    } catch (err) {
        return res.status(500).json({
            message: 'Не удалось удалить статью'
        })
    }
}
export const update = async (req, res) => {
    try {
        const post = await PostModel.findOneAndUpdate(
            {
                _id: req.params.id
            },
            {
                title: req.body.title,
                text123: req.body.text123,
                tags: req.body.tags.split(','),
                user: req.userId,
                imageUrl: req.body.imageUrl
            }
        )
        if (!post) {
            return res.status(404).json({
                message: 'Статья не найдена'
            })
        }
        res.json({
            message: 'Статья успешно обновлена'
        })
    } catch (err) {
        return res.status(500).json({
            message: 'Не удалось обновить статью'
        })
    }
}

export const addComment = async (req, res) => {
    try {
        const doc = new CommentModel({
            postId: req.params.id,
            user: req.userId,
            text: req.body.text
        })

        const Comment = await doc.save()

        await PostModel.findOneAndUpdate(
            {_id: req.params.id},
            {$inc: {commentsCount: 1}},
            {new: true}
        )

        res.json(Comment)
    } catch (err) {
        res.status(500).json({
            message: 'Не удалось создать коментарий'
        })
    }
}

export const getComment = async (req, res) => {
    try {
        const comments = await CommentModel.find({postId: req.params.id}).populate('user').exec() //добавление связи id пользователя с постами

        if (comments.length === 0) {
            return res.status(500).json({
                message: 'Не удалось загрузить комментарии'
            })
        }

        const commentsData = comments.map(a => ({
                fullName: a.user.fullName,
                avatarUrl: a.avatarUrl,
                text: a.text
            })
        );
        res.json(commentsData)
    } catch (err) {
        return res.status(500).json({
            message: 'Не удалось загрузить комментарии'
        })
    }
}