import { createReducer, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import axios from "../axiosURL";

export const updateAuth = createAction("auth/updateAuth");
export const checkAuth = createAsyncThunk("auth/loadAuth", async () => {
    const res = await axios.get("/checkAuth",{withCredentials:true});
    return res.data.user;
});

const initState = {
    isLoggedIn: false,
    user: null
};

const authReducer = createReducer(initState, (builder) => {
    builder.addCase(checkAuth.fulfilled, (state, action) => {
        return {
            ...state,
            isLoggedIn: true,
            user: action.payload
        };
    }).addCase(updateAuth, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
        state.user = action.payload.userData;
    });
});

export default authReducer;