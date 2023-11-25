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
export const getPostById = (id) => {
    return api.get(`/post/${id}`)
}
export const getPostsByUser = (id) => {
    return api.get(`/user/${id}`)
}

const apis = {
    createPost,
    getPosts,
    updatePostById,
    getPostById,
    getPostsByUser
}

export default apis