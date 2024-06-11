export const ADDTOCART = "ADDTOCART";
export const REMOVE = "REMOVE";
export const QTY = "QTY";
export const RESET = "RESET";


export const addToCart=(payload)=>({
    type : ADDTOCART,
    payload
})

export const removeCart=(payload)=>({
    type : REMOVE,
    payload
})

export const cartQty=(payload)=>({
    type : QTY,
    payload
})

export const resetCart=(payload)=>({
    type : RESET,
    payload
})