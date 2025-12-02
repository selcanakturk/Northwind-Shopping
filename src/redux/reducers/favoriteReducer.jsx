import * as actionTypes from "../actions/actionTypes.jsx";
import initialState from "./initialState.jsx";

const getUserId = () => {
    try {
        const userStr = localStorage.getItem("currentUser");
        if (userStr) {
            const user = JSON.parse(userStr);
            return user?.id || null;
        }
    } catch (err) {
        console.error("User ID yüklenirken hata oluştu:", err);
    }
    return null;
};

const loadFavoritesFromStorage = (userId = null) => {
    try {
        const currentUserId = userId || getUserId();
        if (!currentUserId) {
            return [];
        }
        const key = `favorites_${currentUserId}`;
        const serializedFavorites = localStorage.getItem(key);
        if (serializedFavorites === null) {
            return [];
        }
        return JSON.parse(serializedFavorites);
    } catch (err) {
        console.error("Favorites yüklenirken hata oluştu:", err);
        return [];
    }
};

const saveFavoritesToStorage = (favorites, userId = null) => {
    try {
        const currentUserId = userId || getUserId();
        if (!currentUserId) {
            return;
        }
        const key = `favorites_${currentUserId}`;
        localStorage.setItem(key, JSON.stringify(favorites));
    } catch (err) {
        console.error("Favorites kaydedilirken hata oluştu:", err);
    }
};

export default function favoriteReducer(
    state = loadFavoritesFromStorage(),
    action
) {
    const userId = getUserId();
    let newState;
    switch (action.type) {
        case actionTypes.ADD_TO_FAVORITES:
            if (!userId) {
                return state;
            }
            const existingFavorite = state.find(
                (item) => item.id === action.payload.id
            );
            if (existingFavorite) {
                return state;
            }
            newState = [...state, action.payload];
            saveFavoritesToStorage(newState, userId);
            return newState;

        case actionTypes.REMOVE_FROM_FAVORITES:
            if (!userId) {
                return state;
            }
            newState = state.filter((item) => item.id !== action.payload);
            saveFavoritesToStorage(newState, userId);
            return newState;

        case actionTypes.LOGIN_SUCCESS:
        case actionTypes.REGISTER_SUCCESS:
            if (action.payload?.id) {
                return loadFavoritesFromStorage(action.payload.id);
            }
            return [];

        case actionTypes.LOGOUT:
            return [];

        default:
            return state;
    }
}
