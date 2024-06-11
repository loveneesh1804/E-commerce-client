export const CHECKOUT = "CHECKOUT";
export const PAYMENT = "PAYMENT";
export const RESET = "RESET";

export const checkout=(payload)=>({
    type : CHECKOUT,
    payload
});

export const payment=(payload)=>({
    type : PAYMENT,
    payload
})

export const reset=(payload)=>({
    type : RESET,
    payload
})