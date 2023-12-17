import { createContext, useState, useContext } from 'react'
import postAPI from './store-request-api/post-api'
import commentAPI from './store-request-api/comment-api'
import mapAPI from './store-request-api/map-api'
import AuthContext from '../auth'
// import { map } from 'leaflet'

export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");

export const GlobalStoreActionType = {
    CHANGE_CURRENT_SCREEN: "CHANGE_CURRENT_SCREEN",
    CLOSE_MODAL: "CLOSE_MODAL",
    OPEN_MODAL: "OPEN_MODAL",
    SET_CURRENT_POST: "SET_CURRENT_POST",
    SET_CURRENT_MAP: "SET_CURRENT_MAP",
    SET_CURRENT_COMMENTS: "SET_CURRENT_COMMENTS",
    SET_FEATURE_DATA: "SET_FEATURE_DATA",
    SET_SCHEMA_DATA: "SET_SCHEMA_DATA",
    SET_MAP_DATA: "SET_MAP_DATA",
    SET_MAP_EDIT_MODE: "SET_MAP_EDIT_MODE"
}

class TransactionHandler {
    constructor() {
        this.transactions = [];
        this.maxTransactions = 30;
        this.currentTransaction = -1; // Will increment to 0 on first fetch from server
        this.redoQueue = [];
    }

    addTransaction(transaction) {
        if (this.transactions.length >= this.maxTransactions) {
            this.transactions.shift();
            this.currentTransaction--;
        }
        this.transactions.push(transaction);
        this.currentTransaction++;

        if (this.redoQueue.length) this.redoQueue = []; // Clear redo queue
    }

    undo() {
        if (this.currentTransaction > 0) {
            const undoed = this.transactions.pop();
            this.currentTransaction--;
            this.redoQueue.push(undoed);
            return undoed;
        }
    }

    redo() {
        if (this.redoQueue.length) {
            const redone = this.redoQueue.pop();
            this.transactions.push(redone);
            this.currentTransaction = Math.min(this.currentTransaction + 1, 30);
            return redone;
        }
    }

    getCurrent() {
        return this.transactions[this.currentTransaction];
    }

    getLength() {
        return this.transactions.length;
    }

    clear() {
        this.transactions = [];
        this.currentTransaction = -1;
        this.redoQueue = [];
    }
}

const txnHandler = new TransactionHandler();

function GlobalStoreContextProvider(props) {
    const { auth } = useContext(AuthContext);
    const [store, setStore] = useState({
        currentScreen: 'landing',
        modal: null,
        discussionPosts: null,
        currentPost: null,
        currentMap: null, // Only the map ID is stored here.
        currentComments: [],
        currentFilter: '',
        searchTerm: '',
        schemaData: null, // Used for storing our JSON schema map data.
        featureData: null, // Used for switching sidebars to a certain feature.
        mapData: null, // Used for storing our map data during editing.
        mapEditMode: 'None', // Add Point, Edit Point, Add subdivisions to bins/gradients
        currentProfile: null
    });

    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            //Change screen
            case GlobalStoreActionType.CHANGE_CURRENT_SCREEN: {
                return setStore({
                    ...store,
                    currentScreen : payload.screen,
                    modal: null,
                    discussionPosts : payload.discussionPosts,
                    currentPost : payload.currentPost || null,
                    currentComments : payload.currentComments || [],
                    currentMap : payload.currentMapId,
                    currentFilter : payload.filter || '',
                    searchTerm : payload.searchTerm || '',
                    currentProfile: payload.profile
                });
            }
            case GlobalStoreActionType.CLOSE_MODAL: {
                return setStore({
                    ...store,
                    modal : null
                });
            }
            case GlobalStoreActionType.OPEN_MODAL: {
                return setStore({
                    ...store,
                    modal : 1
                });
            }
            case GlobalStoreActionType.SET_CURRENT_POST: {
                return setStore({
                    ...store,
                    modal : null,
                    currentPost : payload.currentPost
                });
            }
            case GlobalStoreActionType.SET_CURRENT_MAP: {
                return setStore({
                    ...store,
                    modal : null,
                    currentMap : payload.currentMapId
                });
            }
            case GlobalStoreActionType.SET_CURRENT_COMMENTS: {
                return setStore({
                    ...store,
                    modal : null,
                    currentComments : payload.currentComments
                });
            }
            case GlobalStoreActionType.SET_FEATURE_DATA: {
                console.log(payload);
                return setStore({
                    ...store,
                    modal : null,
                    featureData : payload.featureData
                });
            }
            case GlobalStoreActionType.SET_SCHEMA_DATA: {
                return setStore({
                    ...store,
                    modal : null,
                    schemaData : payload.schemaData
                });
            }
            case GlobalStoreActionType.SET_MAP_DATA: {
                return setStore({
                    ...store,
                    modal : null,
                    mapData : payload.mapData
                });
            }
            case GlobalStoreActionType.SET_MAP_EDIT_MODE: {
                return setStore({
                    ...store,
                    mapEditMode : payload.mapEditMode
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

    store.changeToSearch = function(search) {
        storeReducer({
            type: GlobalStoreActionType.CHANGE_CURRENT_SCREEN,
            payload: {
                screen: 'search',
                discussionPosts: store.discussionPosts,
                searchTerm: search
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
    
    store.changeToProfile = function(user) {
        storeReducer({
            type: GlobalStoreActionType.CHANGE_CURRENT_SCREEN,
            payload: {
                screen: 'profile',
                discussionPosts: store.discussionPosts,
                profile: user
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

    store.changeToEditMap = async function(mapID) {
        storeReducer({
            type: GlobalStoreActionType.CHANGE_CURRENT_SCREEN,
            payload: {
                screen: 'editMap',
                currentMapId: mapID
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
                return response.data.id;
            }
        } catch (error) {
            console.log("Create New Map error")
        }
    }

    store.deleteMap = async function(mapid) {
        try {
            let response = await mapAPI.deleteMap(mapid);
            console.log("deleteMap response: " + JSON.stringify(response));
            if (response.status === 200) {
                if (response.data.success) {
                    console.log("deleteMap response: " + response.data.id);
                    store.changeToProfile();
                }
            }
        } catch (error) {
            console.log("deleteMap error")
        }
    }

    // update map geojson data in database
    store.updateMapFile = async function(id, geojsonData) {
        try {
            let response = await mapAPI.updateMapFileById(id, geojsonData);
            console.log("updateMapFile response: " + JSON.stringify(response));
            if (response.status === 200) {
                if (response.data.success) {
                    console.log("updateMapFile response: " + response.data.id);
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_MAP,
                        payload: {
                            currentMapId : response.data.id
                        }
                    });
                    //store.changeToEditMap(response.data.id);
                }
            }
        } catch (error) {
            console.log("updateMapFile error")
        }
    }

    store.updateMapSchema = async function(id, mapSchema){
        txnHandler.addTransaction(mapSchema);
        console.log("============== UPDATE SCHEMA ==============");
        console.log(mapSchema);
        console.log("--------------------------------------------");
        storeReducer({ // This is a hacky way to force a rerender
            type: GlobalStoreActionType.SET_SCHEMA_DATA,
            payload: {
                schemaData : mapSchema
            }
        });
    }

    store.saveMapSchema = async function(id, mapSchema) {
        console.log("============== SAVE SCHEMA ==============");
        console.log(txnHandler.getCurrent());
        console.log("--------------------------------------------");
        try {  
            let response = await mapAPI.updateMapSchema(id, txnHandler.getCurrent());
            /* console.log("updateMapSchema response: " + JSON.stringify(response)); */
            if (response.status === 200) {
                if (response.data.success) {
                    /* console.log("updateMapSchema response: " + response.data.id); */
                    storeReducer({
                        type: GlobalStoreActionType.SET_SCHEMA_DATA,
                        payload: {
                            schemaData : mapSchema
                        }
                    });
                }
            }
        } catch (error) {
            console.log("updateMapSchema error", error)
        }
    }

    store.clearHistory = function() {
        txnHandler.clear();
    }

    store.undo = function() {
        let newSchema = txnHandler.undo();
        if (newSchema) {
            storeReducer({ // This is a hacky way to force a rerender
                type: GlobalStoreActionType.SET_SCHEMA_DATA,
                payload: {
                    schemaData : newSchema
                }
            });
        }
    }

    store.redo = function() {
        let newSchema = txnHandler.redo();
        if (newSchema) {
            storeReducer({ // This is a hacky way to force a rerender
                type: GlobalStoreActionType.SET_SCHEMA_DATA,
                payload: {
                    schemaData : newSchema
                }
            });
        }
    }

    store.getSchema = async function(id, edit) {
        if(edit) {
            if (txnHandler.getLength() === 0) {
                let schema = await store.getSchemaFromServer(id);
                if(schema === undefined || schema === null) {
                    schema = {
                        "type": "none",
                        "bins": [],
                        "subdivisions": [],
                        "points": [],
                        "gradients": [],
                        "showSatellite": false
                    }
                }
                txnHandler.addTransaction(schema);
            }
            return txnHandler.getCurrent();
        }
        let schema = await store.getSchemaFromServer(id);
        return schema
    }

    store.getSchemaFromServer = async function(id) {
        try {
            let response = await mapAPI.getMapSchema(id);
            /* console.log("getSchema response: " + JSON.stringify(response)); */
            if (response.status === 200) {
                if (response.data.success) {
                    /* console.log("getSchema response: " + response.data.schema); */
                    return response.data.schema;
                }
            }
        } catch (error) {
            console.log("getSchema error")
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
                            currentMapId : response.data.map._id
                        }
                    });
                    response = await store.getAllComments(response.data.map._id)
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

    store.likeMap = function(map) {
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
        store.updateMapInfo(newMap);
    }

    store.dislikeMap = function(map) {
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
        store.updateMapInfo(newMap);
    }

    store.updateMapInfo = async function(newMap) {
        try{
            const response = await mapAPI.updateMapInfoById(newMap._id, newMap);
            console.log(response) 
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_MAP,
                    payload: {
                        currentMapId : response.data.map._id
                    }
                });
                return response.data.map._id;
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

    store.getPublishedMaps = async function () {
        try{
            const response = await mapAPI.getPublishedMaps();
            if (response.data.success) {
                return response.data
            }
        } catch (error) {
            console.log("Failed getting published maps" + JSON.stringify(error))
        }
    }

    store.publishMap = async function(map, mapid) {
        console.log(map)
        let newMap = map
        newMap.isPublished = true
        newMap.publishedDate = Date.now()
        await store.updateMapInfo(newMap);
        store.changeToMapView(mapid)
    }

    store.getLandingMaps = async function(id) {
        try{
            const response = await mapAPI.getLandingMaps(id);
            if (response.data.success) {
                console.log(response.data)
                return response.data
            }
        } catch (error) {
            console.log("Failed getting published maps" + JSON.stringify(error))
        }
    }

    store.setCurrentFeature = function(feature) {
        console.log(feature);
        storeReducer({
            type: GlobalStoreActionType.SET_FEATURE_DATA,
            payload: {
                featureData : feature.name
            }
        });
    }

    store.setMapEditMode = function(mode) {
        storeReducer({
            type: GlobalStoreActionType.SET_MAP_EDIT_MODE,
            payload: {
                mapEditMode : mode
            }
        });
    }

    store.setSchemaData = function(schema) {
        storeReducer({
            type: GlobalStoreActionType.SET_SCHEMA_DATA,
            payload: {
                schemaData : schema
            }
        });
    }

    store.setMapData = function(mapData) {
        storeReducer({
            type: GlobalStoreActionType.SET_MAP_DATA,
            payload: {
                mapData : mapData
            }
        });
    }

    store.forkMap = async function(map, mapJSON, mapSchema) {
        //Create new map
        const authReq = await auth.getUserData(auth.user.email);
        const newMapId = await store.createNewMap(authReq.user._id, 'New Map', 'Description');
        //Overwrite relevant fields
        let forkedMap = map
        forkedMap.author = authReq.user._id
        forkedMap.isPublished = false
        forkedMap.title = forkedMap.title + " (copy)"
        forkedMap.likes = 0
        forkedMap.dislikes = 0
        forkedMap.likeUsers = []
        forkedMap.dislikeUsers = []
        forkedMap.comments = []
        forkedMap.publishedDate = null
        const response = await mapAPI.updateMapInfoById(newMapId, forkedMap);
        //Copy the map file and schema file
        if(mapJSON !== null) {
            await store.updateMapFile(newMapId, mapJSON)
        }
        if(mapSchema !== null) {
            await store.updateMapSchema(newMapId, mapSchema);
        }
        return response.data.map._id
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