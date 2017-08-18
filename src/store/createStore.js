import { createStore , applyMiddleware, compose} from 'redux';
import thunk from "redux-thunk"
import logger from 'redux-logger'



const reducer = (state = {} , action) => {
    switch (action.type) {
        case 'SET_NAME':
            return {
                ...state,
                name: action.name
            }
        default:
            return state;
    }
};

export default (InitState) => {
    return createStore(reducer, InitState, applyMiddleware(...[ thunk, logger ]))
}