
import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'https://mapstudio.azurewebsites.net/comment',
})

export const createComment = (id, username, content) => {
    return api.post(`/post/${id}`, {
        author: username,
        authorId: null,
        content: content,
        likes: 0,
        dislikes: 0
    })
}
export const getComments = (commentIds) => {
    return api.post('/allcomments', {
        ids: commentIds
    })
}
export const updateCommentById = (id, comment) => {
    return api.put(`/updatecomment/${id}`, {
        comment : comment
    })
}

const apis = {
    createComment,
    getComments,
    updateCommentById
}

export default apis