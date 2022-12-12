const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async(request, response) => {

    const res = await Blog.find({})
    response.json(res)
})
  
blogRouter.post('/', async(request, response) => {
  const blog = request.body
  if(!blog.title | !blog.url){
    response.status(400).end()
  }
  blog.likes = blog.likes | 0
  const newBlog = new Blog(blog)
  

  const savedBlog = await newBlog.save()
  response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async(request, response) => {
  const id = request.params.id
  const res = await Blog.findByIdAndRemove(id)
  response.status(201).json(res)
})

blogRouter.put('/:id', async(request, response) => {
  const id = request.params.id
  const newBlog = request.body

  await Blog.findByIdAndUpdate(id, newBlog, {new: true})
  response.status(201).json(updatedNote)

})

module.exports = blogRouter