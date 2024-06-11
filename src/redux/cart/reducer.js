import { ADDTOCART,REMOVE,QTY, RESET } from "./action";

const initialState = [];

export const cartReducer = (state=initialState,action)=>{
    switch(action.type){
        case ADDTOCART :
            const {size,_id} = action.payload;
            var flag;
            state.forEach(el =>{
                if(el._id===_id && el.size===size){
                    if(el.quantity>=el.stock){
                        el.quantity = Number(el.stock);
                    }
                    else{
                        el.quantity++
                    }
                    if(el.quantity>5){
                        el.quantity = 5;
                    }
                    flag = true;
                }
            })
            if(!flag){
                return [
                    ...state
                    ,action.payload
                ];
            }else{
                return [...state]
            }
            
        case REMOVE :
            state.splice(action.payload,1);
            return [...state];
        
        case QTY :
            const {product,qty} = action.payload;
            state.forEach(el=> {
                if(el._id===product._id && el.size===product.size){
                    el.quantity = qty;
                }
            });
            return [...state];
        
        case RESET :
            return initialState;
        default : 
            return state;
    }
};