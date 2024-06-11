import { userReducer } from "./user/reducer";
import {combineReducers, legacy_createStore as createStore} from "redux";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { cartReducer } from "./cart/reducer";
import { orderReducer } from "./order/reducer";


const persistConfig = {
    key: 'root',
    storage,
  }

const rootReducer = combineReducers({user : userReducer,cart : cartReducer,order : orderReducer})

const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = createStore(persistedReducer,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
export const persistor = persistStore(store);