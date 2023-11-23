import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'https://mapstudio.azurewebsites.net/discussion',
})

export const createPost = (username, title, content) => {
    return api.post(`/post`, {
        author: username,
        authorId: null,
        title: title,
        content: content,
        likes: 0,
        dislikes: 0
    })
}
export const getPosts = () => api.get(`/allposts`)
export const updatePostById = (id, post) => {
    return api.put(`/post/${id}`, {
        post : post
    })
}

const apis = {
    createPost,
    getPosts,
    updatePostById
}

export default apis