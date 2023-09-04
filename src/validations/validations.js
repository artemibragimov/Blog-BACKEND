import {body} from 'express-validator'

export const registerValidations = [ //валидация данных для регистрации
    body('email', 'Недействительный адресс электронной почты').isEmail(),
    body('password', 'Пароль должен состоять как минимум из 6 символов').isLength({min: 6}),
    body('fullName', 'Имя должно состоять как минимум из 2 символов').isLength({min: 2}),
    body('avatarUrl','Недействительная ссылка на фото').optional().isURL()
]

export const loginValidations = [ //валидация данных для регистрации
    body('email', 'Недействительный адресс электронной почты').isEmail(),
    body('password', 'Пароль должен состоять как минимум из 6 символов').isLength({min: 6})
]

export const postCreateValidations = [ //валидация данных для регистрации
    body('title', 'Введите название поста').isLength({min: 3}).isString(),
    body('text123', 'Введите текст поста').isLength({min: 10}).isString(),
    body('tags', 'Неверный формат тэгов (укажите массив)').optional().isArray(),
    body('imageUrl','Недействительная ссылка на фото').optional().isURL()
]