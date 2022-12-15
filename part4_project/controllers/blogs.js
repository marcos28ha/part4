const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')
const User = require('../models/user')


blogRouter.get('/', async(request, response) => {

    const res = await Blog.find({}).populate('user', {username: 1, name: 1})
    response.json(res)
})
  
blogRouter.post('/', async(request, response) => {
  const blog = request.body
  const token = request.token
  if(!request.token.id){
    return response.status(401).json({ error: 'token missing or invalid'})
  }

  const user = request.user

  if(!blog.title | !blog.url){
    response.status(400).end()
  }
  blog.likes = blog.likes | 0
  blog.user = user._id
  const newBlog = new Blog(blog)
  

  const savedBlog = await newBlog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async(request, response) => {
  const id = request.params.id
  const token = request.token
  if(!request.token.id){
    return response.status(401).json({ error: 'token missing or invalid'})
  }

  const user = request.user
  const blogToDelete = await Blog.findById(id)
  const blogToDeleteId = blogToDelete.user.toString()
  const userId = user.id.toString()

  if(!(blogToDeleteId == userId)){
    return response.status(401).json({ error: "this user doesn't have access to this blog"})
  }

  const deletedBlog = await Blog.findByIdAndRemove(id)
  response.status(203).json(deletedBlog)
})

blogRouter.put('/:id', async(request, response) => {
  const id = request.params.id
  const newBlog = request.body  

  const updatedBlog = await Blog.findByIdAndUpdate(id, newBlog, {new: true})
  response.status(201).json(updatedBlog)

})

module.exports = blogRouter