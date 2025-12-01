import * as actionTypes from "../actions/actionTypes.jsx";

const loadUsersFromStorage = () => {
    try {
        const serializedUsers = localStorage.getItem("users");
        if (serializedUsers === null) {
            return [];
        }
        return JSON.parse(serializedUsers);
    } catch (err) {
        console.error("Users yüklenirken hata oluştu:", err);
        return [];
    }
};

export default function userReducer(state = { users: loadUsersFromStorage() }, action) {
    const currentUsers = state.users || loadUsersFromStorage();

    switch (action.type) {
        case actionTypes.GET_USERS_SUCCESS:
            return {
                ...state,
                users: action.payload,
            };
        case actionTypes.CREATE_USER_SUCCESS:
            const newUsersCreate = [...currentUsers, action.payload];
            localStorage.setItem("users", JSON.stringify(newUsersCreate));
            return {
                ...state,
                users: newUsersCreate,
            };
        case actionTypes.UPDATE_USER_SUCCESS:
        case actionTypes.UPDATE_USER_ROLE_SUCCESS:
            const newUsersUpdate = currentUsers.map((user) =>
                user.id === action.payload.id ? action.payload : user
            );
            localStorage.setItem("users", JSON.stringify(newUsersUpdate));
            return {
                ...state,
                users: newUsersUpdate,
            };
        case actionTypes.DELETE_USER_SUCCESS:
            const newUsersDelete = currentUsers.filter(
                (user) => user.id !== action.payload
            );
            localStorage.setItem("users", JSON.stringify(newUsersDelete));
            return {
                ...state,
                users: newUsersDelete,
            };
        default:
            return {
                ...state,
                users: currentUsers,
            };
    }
}

