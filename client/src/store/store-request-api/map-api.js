import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'https://mapstudio.azurewebsites.net/map',
})

export const getMapById = (id) => {
    return api.get(`/maps/${id}`)
}

const apis = {
    getMapById
}

export default apis