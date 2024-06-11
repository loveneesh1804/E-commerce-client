import { CHECKOUT,PAYMENT, RESET } from "./action";

const initialState = {
    discount : 0,
    shipping : 0,
    total : 0,
    subtotal : 0,
    orderInfo : [],
    tax : 0
}

export const orderReducer=(state=initialState,action)=>{
    switch(action.type){
        case CHECKOUT : 
            return {
                ...state,
                discount : action.payload.discount,
                total : action.payload.total,
                shipping : action.payload.shipping,
                subtotal : action.payload.subtotal,
                tax : action.payload.tax,
                orderInfo : action.payload.orderInfo
            };
        case PAYMENT :
            return {
                ...state,
                shippingInfo : action.payload.shippingInfo,
                user : action.payload.user,
                name : action.payload.name
            }
        case RESET : 
            return initialState;
        default : 
            return state;
    }
}