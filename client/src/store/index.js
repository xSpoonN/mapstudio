import { createContext, useState } from 'react'

export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");

export const GlobalStoreActionType = {
    CHANGE_CURRENT_SCREEN: "CHANGE_CURRENT_SCREEN",
    CLOSE_MODAL: "CLOSE_MODAL",
    OPEN_MODAL: "OPEN_MODAL"
}

function GlobalStoreContextProvider(props) {
    const [store, setStore] = useState({
        currentScreen: 'landing',
        modal: null
    });

    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            //Change screen
            case GlobalStoreActionType.CHANGE_CURRENT_SCREEN: {
                return setStore({
                    currentScreen : payload.screen,
                    modal: null
                });
            }
            case GlobalStoreActionType.CLOSE_MODAL: {
                return setStore({
                    currentScreen : store.currentScreen,
                    modal : null,
                });
            }
            case GlobalStoreActionType.OPEN_MODAL: {
                return setStore({
                    currentScreen : store.currentScreen,
                    modal : 1,
                });
            }
            default:
                return store;
        }
    }

    store.changeToHome = function() {
        storeReducer({
            type: GlobalStoreActionType.CHANGE_CURRENT_SCREEN,
            payload: {
                screen: 'landing'
            }
        });
    }

    store.changeToLogin = function() {
        storeReducer({
            type: GlobalStoreActionType.CHANGE_CURRENT_SCREEN,
            payload: {
                screen: 'login'
            }
        });
    }

    store.changeToRegister = function() {
        storeReducer({
            type: GlobalStoreActionType.CHANGE_CURRENT_SCREEN,
            payload: {
                screen: 'register'
            }
        });
    }

    store.changeToForgot = function() {
        storeReducer({
            type: GlobalStoreActionType.CHANGE_CURRENT_SCREEN,
            payload: {
                screen: 'forgot'
            }
        });
    }

    store.changeToRecover = function() {
        storeReducer({
            type: GlobalStoreActionType.CHANGE_CURRENT_SCREEN,
            payload: {
                screen: 'recover'
            }
        });
    }

    store.changeToSearch = function() {
        storeReducer({
            type: GlobalStoreActionType.CHANGE_CURRENT_SCREEN,
            payload: {
                screen: 'search'
            }
        });
    }

    store.changeToPersonal = function() {
        storeReducer({
            type: GlobalStoreActionType.CHANGE_CURRENT_SCREEN,
            payload: {
                screen: 'personal'
            }
        });
    }
    
    store.changeToProfile = function() {
        storeReducer({
            type: GlobalStoreActionType.CHANGE_CURRENT_SCREEN,
            payload: {
                screen: 'profile'
            }
        });
    }

    store.changeToDiscussionHome = function() {
        storeReducer({
            type: GlobalStoreActionType.CHANGE_CURRENT_SCREEN,
            payload: {
                screen: 'discussionHome'
            }
        });
    }

    store.changeToDiscussionPostNew = function() {
        storeReducer({
            type: GlobalStoreActionType.CHANGE_CURRENT_SCREEN,
            payload: {
                screen: 'discussionPostNew'
            }
        });
    }

    store.changeToDiscussionPost = function() {
        storeReducer({
            type: GlobalStoreActionType.CHANGE_CURRENT_SCREEN,
            payload: {
                screen: 'discussionPost'
            }
        });
    }

    store.changeToMapView = function() {
        storeReducer({
            type: GlobalStoreActionType.CHANGE_CURRENT_SCREEN,
            payload: {
                screen: 'mapView'
            }
        });
    }

    store.changeToEditMap = function() {
        storeReducer({
            type: GlobalStoreActionType.CHANGE_CURRENT_SCREEN,
            payload: {
                screen: 'editMap'
            }
        });
    }

    store.closeModal = function() {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_MODAL
        });
    }

    store.openModal = function() {
        storeReducer({
            type: GlobalStoreActionType.OPEN_MODAL
        });
    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };