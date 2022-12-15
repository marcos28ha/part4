const User = require('../models/user')

const initialUsers = [
    {
        username: "Nick",
        name: "Nombre",
        password: "Password"
    },
    {
        username: "marcos28_ha",
        name: "Marcos Herrero",
        password: "Contraseña"
    },
]

const usersInDb = async() => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = {
    usersInDb,
    initialUsers,
}