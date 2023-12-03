import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'https://mapstudio.azurewebsites.net/map',
    // baseURL: 'http://localhost:8080/map',
})

export const createMap = (author, title, description) => {
    return api.post(`/maps`, {
        author: author,
        title: title,
        description: description
    })
}
export const getMaps = () => api.get(`/allmaps`)

export const updateMapFileById = (id, geojsonData) => {
    // the geojson data is too large to upload to the database
    // need to upload it to the server's file system
    // and then store the url of the file in the database
    // but azure cannot GET the /mapsfile/id
    // how to solve this?

    return api.put(`/maps/${id}`, {
        mapFile : geojsonData
    })
}
export const getMapById = (id) => {
    return api.get(`/maps/${id}`)
}
export const getMapsByUser = (id) => {
    return api.get(`/user/${id}`)
}
export const getPublishedMaps = () => api.get('/publishedmaps')
export const getLandingMaps = (id) => {
    return api.get(`/landing/${id}`)
}

const apis = {
    createMap,
    getMaps,
    updateMapFileById,
    getMapById,
    getMapsByUser,
    getPublishedMaps,
    getLandingMaps
}

export default apis