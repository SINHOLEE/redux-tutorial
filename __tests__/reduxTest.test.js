import {createStore} from "redux";

const reducer = (state = [], action) => {
    switch (action.type) {
        case  'ADD':
            return [...state, {id: action.todo.id, txt: action.todo.txt}]
        default:
            return [...state]
    }
};

describe('redux', () => {
    test('기본 테스트', () => {
        expect(1).toBe(1)
    })
    test('빈 스토어를 만들면, 빈 리스트를 반환한다.', () => {
        const store = createStore(reducer)
        expect(store.getState()).toEqual([]);
    })
    test('addTodo action에 {id:1,text:"ggg"}를 입력하면 store.getState()는 [id:1,text:"ggg"]를 반환한다.', () => {
        const newItem = {id: 1, txt: 'ggg'};
        const store = createStore(reducer);

        const addTodo = (todo) => {
            return {type: 'ADD', todo};
        }
        const dispatchAddTodo = (todo) => {
            store.dispatch(addTodo(todo))
        }
        dispatchAddTodo(newItem)
        expect(store.getState()).toEqual([{...newItem}])
    })
    test('target++ 콜백을 subscribe 하면, dispatch가 호출 된 뒤에는 let target =1 => target=2로 바뀐다.', () => {
        let target = 1;
        const store = createStore(() => {
        })

        store.dispatch((() => ({type: ''}))());

        store.subscribe(() => {
            target++
        })
        store.dispatch((() => ({type: ''}))());

        expect(target).toBe(2)

    })
    test('subscribe 하기 전에는 dispatch를 아무리 호출해도 사이드 이팩트가 발생하지 않는다.(target이 변하지 않는다.)', () => {
        let target = 1;
        const store = createStore(() => {
        })

        store.dispatch((() => ({type: ''}))());

        store.dispatch((() => ({type: ''}))());
        store.subscribe(() => {
            target++
        })

        expect(target).toBe(1)

    })
    test('', () => {
        const store = createStore((state = []) => {
            return state
        })
        let state = store.getState()
        expect(state).toEqual([])
        expect(store.getState()).toEqual([])

    })

    test('[replaceReducer 실험] tasts를 추가하는 reducer와 리셋하는 reducer를 분할해서 관리한다.', () => {
        const initState = {tasks: []}
        const addReducer = (state = initState, action) => {
            switch (action.type) {
                case "ADD_TASK":
                    return {
                        ...state,
                        tasks: state.tasks.concat([action.payload.task])
                    }
                default:
                    return state
            }
        }
        const resetReducer = (state = initState, action) => {
            switch (action.type) {
                case "RESET_TASK":
                    return {...state, tasks: []}
                default:
                    return state
            }
        }
        const newTask = {
            id: 1,
            text: '할일일'
        }
        const store = createStore(addReducer)
        const addTask = (task) => {
            return {
                type: 'ADD_TASK',
                payload: {
                    task: newTask
                }
            }
        }
        store.dispatch(addTask(newTask))
        expect(store.getState().tasks).toEqual([{...newTask}])
        store.replaceReducer(resetReducer)
        const resetTask = () => ({
            type: 'RESET_TASK'
        })
        store.dispatch(resetTask())

        expect(store.getState().tasks).toEqual([])

        // 영향없다.
        store.dispatch(addTask(newTask))
        expect(store.getState().tasks).toEqual([])


    })

    test('action 안에 dispatch쓰기', () => {
        const initState = {todos: [{id: 1, text: '123'}], numberOfCallAddTodo: 0}

        const beforeAddTodo = () => {
            return {
                type: 'BEFORE_ADD_TODO',
            }
        }


        const addTodo = (todo) => {
            return {
                type: 'ADD_TODO',
                payload: {todo},
            }
        }


        const reducer = (state = initState, action) => {
            switch (action.type) {
                case 'BEFORE_ADD_TODO':
                    return {...state, numberOfCallAddTodo: state.numberOfCallAddTodo+1};
                case 'ADD_TODO':
                    return {...state, todos: [...state.todos, action.payload.todo]}
                default:
                    return state
            }
        }

        const store = createStore(reducer, initState)
        const { dispatch } = store;

        dispatch(beforeAddTodo())
        dispatch(addTodo({id: 2, text: '333'}))

        expect(store.getState()).toEqual({todos: [{id: 1, text: '123'}, {id: 2, text: '333'}], numberOfCallAddTodo: 1})
    })

    test('action 함수가 planObject가 아니면(ex.promise 객체) dispatch에서 에러를 반환한다.',()=>{
        const getPromiseTodos = ()=>{
            return new Promise((resolve,reject)=>{
                setTimeout(()=>{resolve([{id: 1, text: '123'}, {id: 2, text: '333'}])},1000)
            })
        }

        const getTodos = async ()=>{
            const res =  await getPromiseTodos()
            return res
        }
        const initStoreForTodosAction = async ()=>{
            return {
                type:'INIT_TODOS',payload:{todos:await getTodos()}
            }
        }


        const store = createStore((state=[],action)=>{switch (action.type){
            case 'INIT_TODOS':
                return {...state,todos:action.payload.todos}
            default:
                return state
        }})

        expect(()=>store.dispatch(initStoreForTodosAction())).toThrow(Error)

    })
})