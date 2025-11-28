import * as actionTypes from "../actions/actionTypes.jsx";
import initialState from "./initialState.jsx";

const loadFavoritesFromStorage = () => {
    try {
        const serializedFavorites = localStorage.getItem("favorites");
        if (serializedFavorites === null) {
            return [];
        }
        return JSON.parse(serializedFavorites);
    } catch (err) {
        console.error("Favorites yüklenirken hata oluştu:", err);
        return [];
    }
};

const saveFavoritesToStorage = (favorites) => {
    try {
        const serializedFavorites = JSON.stringify(favorites);
        localStorage.setItem("favorites", serializedFavorites);
    } catch (err) {
        console.error("Favorites kaydedilirken hata oluştu:", err);
    }
};

export default function favoriteReducer(
    state = loadFavoritesFromStorage(),
    action
) {
    let newState;
    switch (action.type) {
        case actionTypes.ADD_TO_FAVORITES:
            const existingFavorite = state.find(
                (item) => item.id === action.payload.id
            );
            if (existingFavorite) {
                return state;
            }
            newState = [...state, action.payload];
            saveFavoritesToStorage(newState);
            return newState;

        case actionTypes.REMOVE_FROM_FAVORITES:
            newState = state.filter((item) => item.id !== action.payload);
            saveFavoritesToStorage(newState);
            return newState;

        default:
            return state;
    }
}

