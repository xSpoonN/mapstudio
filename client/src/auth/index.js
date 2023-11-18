import React, { createContext, useEffect, useState } from "react";
import api from './auth-request-api'

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    LOGIN_USER: "LOGIN_USER",
    LOGOUT_USER: "LOGOUT_USER",
    REGISTER_USER: "REGISTER_USER",
    ACCOUNT_ERROR: "ACCOUNT_ERROR"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        error: null
    });

    useEffect(() => {
        auth.getLoggedIn();
    }, [auth]);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    error: null
                });
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    error: null
                })
            }
            case AuthActionType.LOGOUT_USER: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    error: null
                })
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    error: null
                })
            }
            case AuthActionType.ACCOUNT_ERROR: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    error: payload.error
                })
            }
            default:
                return auth;
        }
    }

    auth.getLoggedIn = async function () {
        const response = await api.getLoggedIn();
        if (response.status === 200) {
            if (response.data.loggedIn !== auth.loggedIn || (response.data.user !== null && (response.data.user.email !== auth.user.email || response.data.user.username !== auth.user.username))) {
                authReducer({
                    type: AuthActionType.GET_LOGGED_IN,
                    payload: {
                        loggedIn: response.data.loggedIn,
                        user: response.data.user
                    }
                });
            }
        }
    }

    auth.registerUser = async function(username, email, password) {
        try {  
            const response = await api.registerUser(username, email, password);      
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: {
                        user: response.data.user
                    }
                })
            }
        } catch(error) {
            let message = error.response.data.errorMessage;
            authReducer({
                type: AuthActionType.ACCOUNT_ERROR,
                payload: {
                    error: message
                }
            })
        }
    }

    auth.loginUser = async function(username, password) {
        try {
            const response = await api.loginUser(username, password);
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.LOGIN_USER,
                    payload: {
                        user: response.data.user
                    }
                })
            }
        } catch(error) {
            let message = error.response.data.errorMessage;
            authReducer({
                type: AuthActionType.ACCOUNT_ERROR,
                payload: {
                    error: message
                }
            })
        }
    }

    auth.guest = function() {
        authReducer({
            type: AuthActionType.LOGIN_USER,
            payload: {
                user: "GUEST"
            }
        })
    }

    auth.logoutUser = async function() {
        const response = await api.logoutUser();
        if (response.status === 200) {
            authReducer( {
                type: AuthActionType.LOGOUT_USER,
                payload: null
            })
        }
    }

    auth.getUserInitials = function() {
        let initials = "";
        if (auth.user && auth.user === "GUEST") {
            initials = "G"
        } else if (auth.user) {
            initials += auth.user.username.charAt(0);
        }
        console.log("user initials: " + initials);
        return initials;
    }

    auth.forgotPassword = async function(email, username) {
        try {
            const response = await api.forgotPassword(email, username);
            if (response.status === 200) {
                return { success: true, obj: response.data }
            }
        } catch(error) {
            return { success: false, message: error }
        }
    }

    auth.closeErrorModal = function() {
        authReducer({
            type: AuthActionType.ACCOUNT_ERROR,
            payload: {
                error: null
            }
        })
    }

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };