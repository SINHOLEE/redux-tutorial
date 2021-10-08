import {combineReducers, createStore} from "redux";
const todosReducer = (todos=[],action)=>{
    switch (action.type){
        case 'ADD_TODO':
            return [...todos,action.todo]
        default:
            return todos
    }
}
const counterReducer = (counter=0,action)=>{
    switch (action.type){
        case 'INCREMENT':
            return counter+1
        case "DECREMENT":
            return counter-1
        default:
            return counter
    }
}

const addTodo = (todo)=>{
    return{
        type:'ADD_TODO',
        todo
    }
}

const increaseCounter = ()=>{
    return {
        type:'INCREMENT'
    }
}

const decreaseCounter = ()=>{
    return{
        type:'DECREMENT'
    }
}
describe('combineReducers test',()=>{
    let store
    let dispatch
    // given
    beforeEach(()=>{

        store = createStore(combineReducers({todos1:todosReducer,counter2:counterReducer}))
        dispatch = store.dispatch
    })
    it(`
    combineReducers를 통해서 store를 생성하면  //when
    {todos1:[],counter2:0} 값이 초기값으로 관리된다.  //then
    `,()=>{
        // then
         expect(store.getState()).toEqual({todos1:[],counter2:0})
    })
    it(`
    addTodo({id:1,text:'123'})를 dispatch 하면  //when
    store.getState()는 {todos1:[{id:1,text:'123'}],counter2:0}를 반환한다. //then
    `,()=>{
        // when
        dispatch(addTodo({id:1,text:'123'}))

        //then
        expect(store.getState()).toEqual({todos1:[{id:1,text:'123'}],counter2:0})

    })
    // given+@
    describe('history를 저장하는 sideEffect를 subscribe하여 매 dispatch 후의 결과물을 저장한다.',()=>{
       let history
        beforeEach(()=>{
            history = [];
            const pushHistory = ()=>{
                history.push(store.getState())
            }
            store.subscribe(()=>pushHistory())
        })
        test(`
        increaseCounter 액션함수를 dispatch하면 //when
        history에 [{todos1:[],counter2:1}] 가 담긴다. // then
        `,()=>{
            // when
            dispatch(increaseCounter())

            // then
            expect(store.getState()).toEqual({todos1:[],counter2:1})
            // 변경된 후의 상태가 들어와야 한다.
            expect(history).toEqual([{todos1:[],counter2:1}])
        })
        test(`
        increaseCounter,decreaseCounter 액션함수를 dispatch하면 //when
        history에 [{todos1:[],counter2:1},{todos1:[],counter2:0}] 가 담긴다. //then
        `,()=>{
            // when
            dispatch(increaseCounter())
            dispatch(decreaseCounter())

            // then
            expect(history).toEqual([{todos1:[],counter2:1},{todos1:[],counter2:0}])
        })
        test(`
        increaseCounter,addTodo({id:1,text:'123'}),decreaseCounter 액션함수를 차례대로 dispatch하면 //when
        history에 [{todos1:[],counter2:1},{todos1:[{id:1,text:'123'}],counter2:1},{todos1:[],counter2:0}] 가 담긴다.  //then
        `,()=>{
            // when
            dispatch(increaseCounter())
            dispatch(addTodo({id:1,text:'123'}))
            dispatch(decreaseCounter())

            // then
            expect(history).toEqual([{todos1:[],counter2:1},{todos1:[{id:1,text:'123'}],counter2:1},{todos1:[{id:1,text:'123'}],counter2:0}])
        })
    })
})