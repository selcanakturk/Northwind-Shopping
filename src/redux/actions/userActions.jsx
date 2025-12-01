import * as actionTypes from "./actionTypes.jsx";
import alertify from "alertifyjs";

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

export function getUsersSuccess(users) {
    return { type: actionTypes.GET_USERS_SUCCESS, payload: users };
}

export function getUsers() {
    return (dispatch) => {
        const users = loadUsersFromStorage();
        dispatch(getUsersSuccess(users));
        return users;
    };
}

export function createUserSuccess(user) {
    return { type: actionTypes.CREATE_USER_SUCCESS, payload: user };
}

export function createUser(userData) {
    return (dispatch) => {
        const users = loadUsersFromStorage();

        const existingUser = users.find(
            (u) => u.username === userData.username || u.email === userData.email
        );

        if (existingUser) {
            alertify.error("Username or email already exists.");
            return Promise.reject(new Error("Username or email already exists"));
        }

        const newUser = {
            id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
            username: userData.username,
            email: userData.email,
            password: userData.password,
            role: userData.role || "user",
        };

        const updatedUsers = [...users, newUser];
        saveUsersToStorage(updatedUsers);
        dispatch(createUserSuccess(newUser));
        alertify.success("User created successfully!");
        return newUser;
    };
}

export function updateUserSuccess(user) {
    return { type: actionTypes.UPDATE_USER_SUCCESS, payload: user };
}

export function updateUser(userId, userData) {
    return (dispatch) => {
        const users = loadUsersFromStorage();
        const existingUser = users.find((u) => u.id === userId);

        if (!existingUser) {
            alertify.error("User not found.");
            return Promise.reject(new Error("User not found"));
        }

        const otherUsers = users.filter((u) => u.id !== userId);
        const duplicateUser = otherUsers.find(
            (u) => (userData.username && u.username === userData.username) ||
                (userData.email && u.email === userData.email)
        );

        if (duplicateUser) {
            alertify.error("Username or email already exists.");
            return Promise.reject(new Error("Username or email already exists"));
        }

        const updatedUser = {
            ...existingUser,
            ...userData,
            id: userId,
        };

        const updatedUsers = users.map((u) => (u.id === userId ? updatedUser : u));
        saveUsersToStorage(updatedUsers);
        dispatch(updateUserSuccess(updatedUser));
        alertify.success("User updated successfully!");
        return updatedUser;
    };
}

export function deleteUserSuccess(userId) {
    return { type: actionTypes.DELETE_USER_SUCCESS, payload: userId };
}

export function deleteUser(userId) {
    return (dispatch) => {
        const users = loadUsersFromStorage();
        const user = users.find((u) => u.id === userId);

        if (!user) {
            alertify.error("User not found.");
            return;
        }

        if (user.role === "admin") {
            alertify.error("Cannot delete admin user.");
            return;
        }

        const updatedUsers = users.filter((u) => u.id !== userId);
        saveUsersToStorage(updatedUsers);
        dispatch(deleteUserSuccess(userId));
        alertify.success(`User "${user.username}" deleted successfully.`);
    };
}

export function updateUserRoleSuccess(user) {
    return { type: actionTypes.UPDATE_USER_ROLE_SUCCESS, payload: user };
}

export function updateUserRole(userId, newRole) {
    return (dispatch) => {
        const users = loadUsersFromStorage();
        const user = users.find((u) => u.id === userId);

        if (!user) {
            alertify.error("User not found.");
            return;
        }

        if (user.role === "admin" && newRole !== "admin") {
            alertify.error("Cannot change admin user role.");
            return;
        }

        const updatedUser = { ...user, role: newRole };
        const updatedUsers = users.map((u) => (u.id === userId ? updatedUser : u));
        saveUsersToStorage(updatedUsers);
        dispatch(updateUserRoleSuccess(updatedUser));
        alertify.success(`User role updated to ${newRole}.`);
        return updatedUser;
    };
}

