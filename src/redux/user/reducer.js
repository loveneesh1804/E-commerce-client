import { LOGIN,LOGOUT } from "./action";

const initialState = {user : 0,isLoading : true};

export const userReducer=(state=initialState,action)=>{
    switch(action.type){
        case LOGIN :
            return {
                isLoading : false,
                user : action.payload
            };
        case LOGOUT : 
            return {
                user : 0
            };
        default :
            return state;
    }
};