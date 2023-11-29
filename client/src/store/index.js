import { createContext, useState, useContext } from 'react'
import postAPI from './store-request-api/post-api'
import commentAPI from './store-request-api/comment-api'
import mapAPI from './store-request-api/map-api'
import AuthContext from '../auth'

export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");

export const GlobalStoreActionType = {
    CHANGE_CURRENT_SCREEN: "CHANGE_CURRENT_SCREEN",
    CLOSE_MODAL: "CLOSE_MODAL",
    OPEN_MODAL: "OPEN_MODAL",
    SET_CURRENT_POST: "SET_CURRENT_POST",
    SET_CURRENT_MAP: "SET_CURRENT_MAP",
    SET_CURRENT_COMMENTS: "SET_CURRENT_COMMENTS"
}

function GlobalStoreContextProvider(props) {
    const { auth } = useContext(AuthContext);
    const [store, setStore] = useState({
        currentScreen: 'landing',
        modal: null,
        discussionPosts: null,
        currentPost: null,
        currentMap: null,
        currentComments: [],
        currentFilter: ''
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
                    currentPost : payload.currentPost || null,
                    currentComments : payload.currentComments || [],
                    currentMap : payload.currentMapId,
                    currentFilter : payload.filter || ''
                });
            }
            case GlobalStoreActionType.CLOSE_MODAL: {
                return setStore({
                    currentScreen : store.currentScreen,
                    modal : null,
                    discussionPosts : store.discussionPosts,
                    currentPost : store.currentPost,
                    currentComments : store.currentComments,
                    currentMap : store.currentMap,
                    currentFilter : store.currentFilter
                });
            }
            case GlobalStoreActionType.OPEN_MODAL: {
                return setStore({
                    currentScreen : store.currentScreen,
                    modal : 1,
                    discussionPosts : store.discussionPosts,
                    currentPost : store.currentPost,
                    currentComments : store.currentComments,
                    currentMap : store.currentMap,
                    currentFilter : store.currentFilter
                });
            }
            case GlobalStoreActionType.SET_CURRENT_POST: {
                return setStore({
                    currentScreen : store.currentScreen,
                    modal : null,
                    discussionPosts : store.discussionPosts,
                    currentPost : payload.currentPost,
                    currentComments : store.currentComments,
                    currentMap : store.currentMap,
                    currentFilter : store.currentFilter
                });
            }
            case GlobalStoreActionType.SET_CURRENT_MAP: {
                return setStore({
                    currentScreen : store.currentScreen,
                    modal : null,
                    discussionPosts : store.discussionPosts,
                    currentPost : store.currentPost,
                    currentComments : store.currentComments,
                    currentMap : payload.currentMapId,
                    currentFilter : store.currentFilter
                });
            }
            case GlobalStoreActionType.SET_CURRENT_COMMENTS: {
                return setStore({
                    currentScreen : store.currentScreen,
                    modal : null,
                    discussionPosts : store.discussionPosts,
                    currentPost : store.currentPost,
                    currentComments : payload.currentComments,
                    currentMap : store.currentMap,
                    currentFilter : store.currentFilter
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

    store.changeToDiscussionHome = async function(filter) {
        let res = await store.getAllPosts()
        console.log(res.data.posts)
        storeReducer({
            type: GlobalStoreActionType.CHANGE_CURRENT_SCREEN,
            payload: {
                screen: 'discussionHome',
                discussionPosts: res.data.posts,
                filter: filter
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

    store.changeToDiscussionPost = async function(post) {
        let res = await store.getAllComments(post)
        console.log(res.data.comments)
        storeReducer({
            type: GlobalStoreActionType.CHANGE_CURRENT_SCREEN,
            payload: {
                screen: 'discussionPost',
                currentPost: post,
                currentComments : res.data.comments
            }
        });
    }

    store.changeToMapView = async function(mapID) {
        storeReducer({
            type: GlobalStoreActionType.CHANGE_CURRENT_SCREEN,
            payload: {
                screen: 'mapView',
                currentMapId: mapID
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

    // Map Actions
    store.createNewMap = async function(author, title, description) {
        try {
            let response = await mapAPI.createMap(author, title, description);
            console.log("createNewMap response: " + JSON.stringify(response));
            if (response.status === 201) {
                if (response.data.success) {
                    console.log("createNewMap response: " + response.data.id);
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_MAP,
                        payload: {
                            currentMapId : response.data.id
                        }
                    });
                }
                store.changeToEditMap();
            }
        } catch (error) {
            console.log("Create New Map error")
        }
    }

    //Community Post Actions

    store.createNewPost = async function(title, content) {
        try {
            let response = await postAPI.createPost(auth.user.username, title, content);
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
            let posts = await postAPI.getPosts();
            return posts
        } catch (error) {
            console.log("Failed getting posts")
        }
    }

    store.likePost = function() {
        let newPost = store.currentPost
        if(!newPost.likeUsers.includes(auth.user.username)) {
            newPost.likes++;
            newPost.likeUsers.push(auth.user.username)
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
            newPost.dislikeUsers.push(auth.user.username)
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
            const response = await postAPI.updatePostById(newPost._id, newPost);
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

    store.getPost = async function(id) {
        try{
            const response = await postAPI.getPostById(id);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_POST,
                    payload: {
                        currentPost : response.data.post
                    }
                });
            }
        } catch (error) {
            console.log("Failed getting post")
        }
    }

    //Comment actions
    store.createNewComment = async function(content) {
        try {
            let response = await commentAPI.createComment(store.currentPost._id, auth.user.username, content);
            console.log("createNewComment response: " + response);
            if (response.status === 200) {
                response = await postAPI.getPostById(store.currentPost._id);
                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_POST,
                        payload: {
                            currentPost : response.data.post
                        }
                    });
                    response = await store.getAllComments(response.data.post)
                    if (response.data.success) {
                        storeReducer({
                            type: GlobalStoreActionType.SET_CURRENT_COMMENTS,
                            payload: {
                                currentComments : response.data.comments
                            }
                        });
                    }
                }
            }
        } catch (error) {
            console.log("Create New Comment error")
        }
    }

    store.createMapComment = async function(content, mapid) {
        try {
            let response = await commentAPI.createComment(mapid, auth.user.username, content);
            console.log("createNewComment response: " + response);
            if (response.status === 200) {
                response = await mapAPI.getMapById(mapid);
                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_MAP,
                        payload: {
                            currentMap : response.data.map._id
                        }
                    });
                }
            }
        } catch (error) {
            console.log("Create New Comment error")
        }
    }

    store.likeMap = async function(map) {
        let newMap = map
        if(!newMap.likeUsers.includes(auth.user.username)) {
            newMap.likes++;
            newMap.likeUsers.push(auth.user.username)
            if(newMap.dislikeUsers.includes(auth.user.username)) {
                newMap.dislikes--;
                newMap.dislikeUsers.splice(newMap.dislikeUsers.indexOf(auth.user.username),1)
            }
        } else {
            newMap.likes--;
            newMap.likeUsers.splice(newMap.likeUsers.indexOf(auth.user.username),1)
        }
        const resp = await store.updateMap(newMap);
        /* console.log(resp); */
        return resp;
    }

    store.dislikeMap = async function(map) {
        let newMap = map
        if(!newMap.dislikeUsers.includes(auth.user.username)) {
            newMap.dislikes++;
            newMap.dislikeUsers.push(auth.user.username)
            if(newMap.likeUsers.includes(auth.user.username)) {
                newMap.likes--;
                newMap.likeUsers.splice(newMap.likeUsers.indexOf(auth.user.username),1)
            }
        } else {
            newMap.dislikes--;
            newMap.dislikeUsers.splice(newMap.dislikeUsers.indexOf(auth.user.username),1)
        }
        const resp = await store.updateMap(newMap);
        /* console.log(resp); */
        return resp;
    }

    store.updateMap = async function(newMap) {
        try{
            const response = await mapAPI.updateMapById(newMap._id, newMap);
            /* console.log(response) */
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_MAP,
                    payload: {
                        currentMap : response.data.map
                    }
                });
                return response.data.map;
            }
        } catch (error) {
            console.log("Failed updating map: " + error)
        }
    }

    store.getAllComments = async function(post) {
        try {
            let comments = await commentAPI.getComments(post.comments);
            return comments
        } catch (error) {
            console.log("Failed getting comments")
        }
    }

    store.getMapComments = async function(map) {
        try {
            let comments = await commentAPI.getComments(map.comments);
            return comments
        } catch (error) {
            console.log("Failed getting comments")
        }
    }
    
    store.updateComment = async function(newComment) {
        try{
            const response = await commentAPI.updateCommentById(newComment._id, newComment);
            if (response.data.success) {
                let updatedComments = store.currentComments
                updatedComments = updatedComments.map(comment =>
                    comment._id === newComment._id ? response.data.comment : comment
                );
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_COMMENTS,
                    payload: {
                        currentComments : updatedComments
                    }
                });
            }
        } catch (error) {
            console.log("Failed updating post")
        }
    }

    store.likeComment = function(comment) {
        let newComment = comment
        if(!newComment.likeUsers.includes(auth.user.username)) {
            newComment.likes++;
            newComment.likeUsers.push(auth.user.username)
            if(newComment.dislikeUsers.includes(auth.user.username)) {
                newComment.dislikes--;
                newComment.dislikeUsers.splice(newComment.dislikeUsers.indexOf(auth.user.username),1)
            }
        } else {
            newComment.likes--;
            newComment.likeUsers.splice(newComment.likeUsers.indexOf(auth.user.username),1)
        }
        store.updateComment(newComment);
    }

    store.dislikeComment = function(comment) {
        let newComment = comment
        if(!newComment.dislikeUsers.includes(auth.user.username)) {
            newComment.dislikes++;
            newComment.dislikeUsers.push(auth.user.username)
            if(newComment.likeUsers.includes(auth.user.username)) {
                newComment.likes--;
                newComment.likeUsers.splice(newComment.likeUsers.indexOf(auth.user.username),1)
            }
        } else {
            newComment.dislikes--;
            newComment.dislikeUsers.splice(newComment.dislikeUsers.indexOf(auth.user.username),1)
        }
        store.updateComment(newComment);
    }

    //Profile Actions
    store.getPostsData = async function(user) {
        try{
            const response = await postAPI.getPostsByUser(user._id);
            if (response.data.success) {
                return response.data.posts
            }
        } catch (error) {
            console.log("Failed getting posts")
        }
    }

    store.getMapsData = async function(user) {
        try{
            const response = await mapAPI.getMapsByUser(user._id);
            if (response.data.success) {
                return response.data.maps
            }
        } catch (error) {
            console.log("Failed getting maps")
        }
    }

    //Map Actions
    store.getMap = async function(id) {
        try{
            const response = await mapAPI.getMapById(id);
            if (response.data.success) {
                return response.data.map
            }
        } catch (error) {
            console.log("Failed getting map" + JSON.stringify(error))
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