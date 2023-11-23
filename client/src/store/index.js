import { createContext, useState, useContext } from 'react'
import post from './store-request-api/post-api'
import AuthContext from '../auth'

export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");

export const GlobalStoreActionType = {
    CHANGE_CURRENT_SCREEN: "CHANGE_CURRENT_SCREEN",
    CLOSE_MODAL: "CLOSE_MODAL",
    OPEN_MODAL: "OPEN_MODAL",
    SET_CURRENT_POST: "SET_CURRENT_POST"
}

function GlobalStoreContextProvider(props) {
    const { auth } = useContext(AuthContext);
    const [store, setStore] = useState({
        currentScreen: 'landing',
        modal: null,
        discussionPosts: null,
        currentPost: null
    });

    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            //Change screen
            case GlobalStoreActionType.CHANGE_CURRENT_SCREEN: {
                return setStore({
                    currentScreen : payload.screen,
                    modal: null,
                    discussionPosts : payload.discussionPosts,
                    currentPost : payload.currentPost || null
                });
            }
            case GlobalStoreActionType.CLOSE_MODAL: {
                return setStore({
                    currentScreen : store.currentScreen,
                    modal : null,
                    discussionPosts : store.discussionPosts,
                    currentPost : store.currentPost 
                });
            }
            case GlobalStoreActionType.OPEN_MODAL: {
                return setStore({
                    currentScreen : store.currentScreen,
                    modal : 1,
                    discussionPosts : store.discussionPosts,
                    currentPost : store.currentPost 
                });
            }
            case GlobalStoreActionType.SET_CURRENT_POST: {
                return setStore({
                    currentScreen : store.currentScreen,
                    modal : null,
                    discussionPosts : store.discussionPosts,
                    currentPost : payload.currentPost 
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
                screen: 'landing',
                discussionPosts: store.discussionPosts
            }
        });
    }

    store.changeToLogin = function() {
        storeReducer({
            type: GlobalStoreActionType.CHANGE_CURRENT_SCREEN,
            payload: {
                screen: 'login',
                discussionPosts: store.discussionPosts
            }
        });
    }

    store.changeToRegister = function() {
        storeReducer({
            type: GlobalStoreActionType.CHANGE_CURRENT_SCREEN,
            payload: {
                screen: 'register',
                discussionPosts: store.discussionPosts
            }
        });
    }

    store.changeToForgot = function() {
        storeReducer({
            type: GlobalStoreActionType.CHANGE_CURRENT_SCREEN,
            payload: {
                screen: 'forgot',
                discussionPosts: store.discussionPosts
            }
        });
    }

    store.changeToRecover = function() {
        storeReducer({
            type: GlobalStoreActionType.CHANGE_CURRENT_SCREEN,
            payload: {
                screen: 'recover',
                discussionPosts: store.discussionPosts
            }
        });
    }

    store.changeToSearch = function() {
        storeReducer({
            type: GlobalStoreActionType.CHANGE_CURRENT_SCREEN,
            payload: {
                screen: 'search',
                discussionPosts: store.discussionPosts
            }
        });
    }

    store.changeToPersonal = function() {
        storeReducer({
            type: GlobalStoreActionType.CHANGE_CURRENT_SCREEN,
            payload: {
                screen: 'personal',
                discussionPosts: store.discussionPosts
            }
        });
    }
    
    store.changeToProfile = function() {
        storeReducer({
            type: GlobalStoreActionType.CHANGE_CURRENT_SCREEN,
            payload: {
                screen: 'profile',
                discussionPosts: store.discussionPosts
            }
        });
    }

    store.changeToDiscussionHome = async function() {
        let res = await store.getAllPosts()
        console.log(res.data.posts)
        storeReducer({
            type: GlobalStoreActionType.CHANGE_CURRENT_SCREEN,
            payload: {
                screen: 'discussionHome',
                discussionPosts: res.data.posts
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

    store.changeToDiscussionPost = function(post) {
        storeReducer({
            type: GlobalStoreActionType.CHANGE_CURRENT_SCREEN,
            payload: {
                screen: 'discussionPost',
                currentPost: post
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

    //Community Post Actions

    store.createNewPost = async function(title, content) {
        try {
            let response = await post.createPost(auth.user.username, title, content);
            console.log("createNewPost response: " + response);
            if (response.status === 201) {
                store.changeToDiscussionPost(response.data.post);
            }
        } catch (error) {
            if(error.response.data.error === "Blank") {
                console.log("Blank")
            }
        }
    }

    store.getAllPosts = async function() {
        try {
            let posts = await post.getPosts();
            return posts
        } catch (error) {
            console.log("Failed getting posts")
        }
    }

    store.likePost = function() {
        let newPost = store.currentPost
        if(!newPost.likeUsers.includes(auth.user.username)) {
            newPost.likes++;
            newPost.likeUsers.push(auth.user.email)
            if(newPost.dislikeUsers.includes(auth.user.username)) {
                newPost.dislikes--;
                newPost.dislikeUsers.splice(newPost.dislikeUsers.indexOf(auth.user.username),1)
            }
        } else {
            newPost.likes--;
            newPost.likeUsers.splice(newPost.likeUsers.indexOf(auth.user.username),1)
        }
        store.updatePost(newPost);
    }

    store.dislikePost = function() {
        let newPost = store.currentPost
        if(!newPost.dislikeUsers.includes(auth.user.username)) {
            newPost.dislikes++;
            newPost.dislikeUsers.push(auth.user.email)
            if(newPost.likeUsers.includes(auth.user.username)) {
                newPost.likes--;
                newPost.likeUsers.splice(newPost.likeUsers.indexOf(auth.user.username),1)
            }
        } else {
            newPost.dislikes--;
            newPost.dislikeUsers.splice(newPost.dislikeUsers.indexOf(auth.user.username),1)
        }
        store.updatePost(newPost);
    }
    
    store.updatePost = async function(newPost) {
        try{
            const response = await post.updatePostById(newPost._id, newPost);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_POST,
                    payload: {
                        currentPost : response.data.post
                    }
                });
            }
        } catch (error) {
            console.log("Failed updating post")
        }
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