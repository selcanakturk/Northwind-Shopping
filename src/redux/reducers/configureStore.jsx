import { configureStore as createConfigureStore } from "@reduxjs/toolkit";
import rootReducer from ".";

export default function configureStore() {
    return createConfigureStore({
        reducer: rootReducer
    });
}
