import {body} from 'express-validator'

export const registerValidations = [ //валидация данных для регистрации
    body('email', 'Недействительный адресс электронной почты').isEmail(),
    body('password', 'Пароль должен состоять как минимум из 6 символов').isLength({min: 6}),
    body('fullName', 'Имя должно состоять как минимум из 2 символов').isLength({min: 2}),
    body('avatarUrl','Недействительная ссылка на фото').optional().isURL()
]