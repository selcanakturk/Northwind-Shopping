import * as actionTypes from "../actions/actionTypes.jsx";
import initialState from "./initialState.jsx";

export default function categoryListReducer(state = initialState.categories, action) {
    switch (action.type) {
        case actionTypes.GET_CATEGORIES_SUCCESS:
            return action.payload
        default:
            return state;
    }
}