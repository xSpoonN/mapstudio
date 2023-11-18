import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'https://mapstudio.azurewebsites.net/auth',
})

export const getLoggedIn = () => api.get(`/loggedIn/`);
export const loginUser = (username, password) => {
    return api.post(`/login/`, {
        username : username,
        password : password
    })
}
export const logoutUser = () => api.get(`/logout/`)
export const registerUser = (username, email, password) => {
    return api.post(`/register/`, {
        username : username,
        email : email,
        password : password
    })
}

export const forgotPassword = (email, username) => {
    return api.post(`/forgotPassword/`, {
        email : email,
        username : username
    })
}
const apis = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword
}

export default apis