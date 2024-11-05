import {configureStore } from '@reduxjs/toolkit';
import ticTacToeReducer from './ticTacToeSlice.js';

export const store =configureStore({
  reducer:ticTacToeReducer,
});