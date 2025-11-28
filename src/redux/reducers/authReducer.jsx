import * as actionTypes from "../actions/actionTypes.jsx";
import initialState from "./initialState.jsx";

const loadAuthFromStorage = () => {
  try {
    const token = localStorage.getItem("authToken");
    const userStr = localStorage.getItem("currentUser");

    if (token && userStr) {
      return {
        isAuthenticated: true,
        user: JSON.parse(userStr),
        token,
        error: null,
      };
    }
  } catch (err) {
    console.error("Auth yüklenirken hata oluştu:", err);
  }

  return {
    isAuthenticated: false,
    user: null,
    token: null,
    error: null,
  };
};

export default function authReducer(
  state = loadAuthFromStorage(),
  action
) {
  switch (action.type) {
    case actionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        token: action.payload.token,
        error: null,
      };

    case actionTypes.LOGIN_ERROR:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload,
      };

    case actionTypes.REGISTER_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        token: action.payload.token,
        error: null,
      };

    case actionTypes.REGISTER_ERROR:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload,
      };

    case actionTypes.LOGOUT:
      return {
        isAuthenticated: false,
        user: null,
        token: null,
        error: null,
      };

    default:
      return state;
  }
}

