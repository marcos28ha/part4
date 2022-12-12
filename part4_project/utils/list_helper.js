const dummy = (blogs) => {
    return 1
}

const totalLikes = (listOfBlogs) => {

    const reducer = (sum, item) => {
        return sum + item.likes
    }
    
    return listOfBlogs.reduce(reducer, 0)
}

const favoriteBlog = (listOfBlogs) => {
    if(listOfBlogs.length === 0){return 0}
    let numberOfLikes = listOfBlogs.map(blog => blog.likes)
    let indexOfFavourite = numberOfLikes.indexOf(Math.max(...numberOfLikes))

    return {
        title: listOfBlogs[indexOfFavourite].title,
        author: listOfBlogs[indexOfFavourite].author,
        likes: listOfBlogs[indexOfFavourite].likes,
    }
}
  
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}