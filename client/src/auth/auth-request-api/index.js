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
export const verifyResetToken = (email, token) => {
    return api.post(`/verifyResetToken/`, {
        email: email,
        token: token
    })
}

export const resetPassword = (email, password) => {
    return api.post(`/resetPassword/`, {
        email: email,
        password: password
    })
}

export const setProfilePicture = (formData, email) => {
    return api.post(`/users/pfp/${email}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const setBio = (bio, email) => {
    return api.post(`/users/bio/${email}`, {
        bio: bio
    })
}

export const getUserData = (email) => {
    return api.get(`/users/${email}`)
}


const apis = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    verifyResetToken,
    resetPassword,
    setProfilePicture,
    setBio,
    getUserData
}

export default apis