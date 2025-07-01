import { createAction,createReducer, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axiosURL"

export const loadCars = createAsyncThunk("carrental/loadCars",async ()=>{
    const res = await axios.get("/carrental/cars",{withCredentials:true})
    return res.data;
});

export const updateCarSearch = createAction("carrental/updateCarSearch");
export const loadCarSeach = createAsyncThunk("carrental/loadCarSeach",async (searchParams)=>{
    const res = await axios.get("/carrental/search", {
        params: searchParams,
        withCredentials: true
    });
    return res.data;
});

const initState = {
    cars:[],
    searchResults:[]
}

const carrentalReducer = createReducer(initState,(builder) =>{
    builder.addCase(loadCars.fulfilled,(state,action)=>{
        return {
            ...state,
            cars:action.payload
        }
    }).addCase(loadCarSeach.fulfilled, (state, action) => {
        return {
            ...state,
            searchResults:action.payload
        }
    }).addCase(updateCarSearch, (state, action) => {
        return {
            ...state,
            searchResults: action.payload.car,
            startDate: action.payload.startDate,
            endDate: action.payload.endDate
        };
    });
})

export default carrentalReducer;