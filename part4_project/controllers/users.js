const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const Blog = require('../models/blog')

userRouter.post('/', async(request, response) => {
    const { username, name, password } = request.body

    if(!password | password.length < 3){
        return response.status(401).json({ error: 'Password must have 3 or more characters'})
    }

    const existingUser = await User.findOne({ username })
    if(existingUser){
        return response.status(401).json({ error: 'This username already exists'})
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash,
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)
})

userRouter.get('/', async(request, response) => {

    const users = await User.find({}).populate('blogs', {url: 1, title: 1, author: 1})
    response.status(201).json(users.map(user => user.toJSON()))
})

module.exports = userRouter