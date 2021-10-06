import {createStore} from "redux"
console.log((createStore))
let testObj;
const reducer = (state=[],action)=>{
    switch (action.type){
        default:
            testObj=state;
            return [...state]
    }
};

const store = createStore(reducer);

console.log(store.getState());
console.log(store.getState()===testObj)