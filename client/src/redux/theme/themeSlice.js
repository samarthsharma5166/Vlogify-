import {createSlice} from '@reduxjs/toolkit'
import secureLocalStorage from 'react-secure-storage';

const initialState = {
    theme : secureLocalStorage.getItem('theme') ||'light',
}

const themeSlice = createSlice({
    name:"theme",
    initialState,
    reducers:{
        toggleTheme:(state)=>{
            state.theme = state.theme === 'light' ? 'dark':'light';
            secureLocalStorage.setItem('theme',state.theme);
        }
    }
})

export const {toggleTheme} = themeSlice.actions;

export default themeSlice.reducer;