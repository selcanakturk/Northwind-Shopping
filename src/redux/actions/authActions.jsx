import * as actionTypes from "./actionTypes.jsx";

const loadUsersFromStorage = () => {
  try {
    const serializedUsers = localStorage.getItem("users");
    if (serializedUsers === null) {
      const defaultUsers = [
        {
          id: 1,
          username: "admin",
          email: "admin@northwind.com",
          password: "admin123",
          role: "admin",
        },
        {
          id: 2,
          username: "user",
          email: "user@northwind.com",
          password: "user123",
          role: "user",
        },
      ];
      localStorage.setItem("users", JSON.stringify(defaultUsers));
      return defaultUsers;
    }
    return JSON.parse(serializedUsers);
  } catch (err) {
    console.error("Users yüklenirken hata oluştu:", err);
    return [];
  }
};

const saveUsersToStorage = (users) => {
  try {
    localStorage.setItem("users", JSON.stringify(users));
  } catch (err) {
    console.error("Users kaydedilirken hata oluştu:", err);
  }
};

export function login(username, password) {
  return (dispatch) => {
    const users = loadUsersFromStorage();
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      const token = `token_${Date.now()}_${Math.random()}`;
      const userData = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        token,
      };

      localStorage.setItem("authToken", token);
      localStorage.setItem("currentUser", JSON.stringify(userData));

      dispatch({
        type: actionTypes.LOGIN_SUCCESS,
        payload: userData,
      });

      return Promise.resolve(userData);
    } else {
      dispatch({
        type: actionTypes.LOGIN_ERROR,
        payload: "Invalid username or password",
      });
      return Promise.reject(new Error("Invalid username or password"));
    }
  };
}

export function register(username, email, password) {
  return (dispatch) => {
    const users = loadUsersFromStorage();
    const existingUser = users.find(
      (u) => u.username === username || u.email === email
    );

    if (existingUser) {
      dispatch({
        type: actionTypes.REGISTER_ERROR,
        payload: "Username or email already exists",
      });
      return Promise.reject(new Error("Username or email already exists"));
    }

    const newUser = {
      id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
      username,
      email,
      password,
      role: "user",
    };

    const updatedUsers = [...users, newUser];
    saveUsersToStorage(updatedUsers);

    const token = `token_${Date.now()}_${Math.random()}`;
    const userData = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      token,
    };

    localStorage.setItem("authToken", token);
    localStorage.setItem("currentUser", JSON.stringify(userData));

    dispatch({
      type: actionTypes.REGISTER_SUCCESS,
      payload: userData,
    });

    return Promise.resolve(userData);
  };
}

export function logout() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("currentUser");

  return {
    type: actionTypes.LOGOUT,
  };
}

export function checkAuth() {
  return (dispatch) => {
    const token = localStorage.getItem("authToken");
    const userStr = localStorage.getItem("currentUser");

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        dispatch({
          type: actionTypes.LOGIN_SUCCESS,
          payload: user,
        });
      } catch (err) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("currentUser");
        dispatch({
          type: actionTypes.LOGOUT,
        });
      }
    } else {
      dispatch({
        type: actionTypes.LOGOUT,
      });
    }
  };
}

