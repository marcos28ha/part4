const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./blogtest_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const blog = require('../models/blog')

beforeEach(async() => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('blogs are returned as a json', async() => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async() => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('the unique identifier of the blogs is id', async() => {
    const response = await api.get('/api/blogs')

    expect(response.body[0].id).toBeDefined()
})

test('post request successfully create new blogs', async() => {
    const newBlog = {
        title: "blog",
        author: "marcos",
        url: "www.upv.es",
        likes: 8
    }

    const result = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    expect(result.body.title).toBe('blog')
    expect(result.body.author).toBe('marcos')
    const previousBlogs = await helper.blogsInDb()
    expect(previousBlogs.length).toBe(helper.initialBlogs.length + 1)
})

test('If likes is missing, it will default to 0', async() => {
    const newBlog = {
        title: "blog",
        author: "marcos",
        url: "www.upv.es",
    }

    const result = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    expect(result.body.likes).toBe(0)
})

test('If title or url are missing server responds with 400 status', async() => {
    const newBlog = {
        author: "Gandalf",
        likes: 6,
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
})

test('A test from the database is deleted', async() => {
    const blogs = await helper.blogsInDb()
    const blogToDelete = blogs.find(p => p.title === "React patterns")
    const id = blogToDelete.id
    await api
        .delete(`/api/blogs/${id}`)

    const previousBlogs = await helper.blogsInDb()
    expect(previousBlogs.length).toBe(helper.initialBlogs.length - 1)
})

test('Likes are updated correctly', async() => {
    const blogs = await helper.blogsInDb()
    const blogToUpdate = blogs.find(p => p.title === "React patterns")
    const id = blogToUpdate.id
    const newBlog = {...blogToUpdate, likes: 50}

    await api
        .put(`/api/blogs/${id}`)
        .send(newBlog)

    const updatedBlog = await Blog.findById(id)
    expect(updatedBlog.likes).toBe(50)
})



afterAll(() => {
    mongoose.connection.close()
}) 


