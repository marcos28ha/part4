const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./user_helper')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')

beforeEach(async() => {
    await User.deleteMany({})

    const userObjects = helper.initialUsers
        .map(user => new User(user))
    const promiseArray = userObjects.map(user => user.save())
    await Promise.all(promiseArray)
})

describe("User creation", () => {
    test("Users are created correctly", async() => {

        const newUser = {
            username: "marcos28_ha",
            name: "Marcos Herrero",
            password: "Contraseña"
        }

        const user = new User(newUser)
        const savedUser = await user.save()
        const currentItems = await helper.usersInDb()
        expect(savedUser.username).toBe("marcos28_ha")
        expect(helper.initialUsers.length + 1).toBe(currentItems.length)
    })
})


afterAll(() => {
    mongoose.connection.close()
}) 