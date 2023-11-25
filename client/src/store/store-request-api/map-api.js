import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'https://mapstudio.azurewebsites.net/map',
})

export const createMap = (author, title, description) => {
    return api.post(`/${author}`, {
        author: author,
        title: title,
        description: description
    })
}
export const getMaps = () => api.get(`/allmaps`)
export const updateMapById = (id, map) => {
    return api.put(`/${id}`, {
        map : map
    })
}
export const getMapById = (id) => {
    return api.get(`/${id}`)
}
export const getMapsByUser = (id) => {
    return api.get(`/user/${id}`)
}

const apis = {
    createMap,
    getMaps,
    updateMapById,
    getMapById,
    getMapsByUser
}

export default apis