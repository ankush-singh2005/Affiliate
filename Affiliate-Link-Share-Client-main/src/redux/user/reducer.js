import { CLEAR_USER, SET_USER } from "./actions";

const initialState = null;

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        // This case will help in setting new value of userDetails like after login
        case SET_USER:
            return action.payload;
        // This case will help in resetting userDetails like after logout
        case CLEAR_USER:
            return initialState;
        // This case ensures we're not updating userDetails if some other state
        // value gets changed
        default:
            return state;
    }
};