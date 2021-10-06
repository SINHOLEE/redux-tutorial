import {createStore} from "redux";

const reducer = (state = [], action) => {
    switch (action.type) {
        case  'ADD':
            return [...state,{id:action.todo.id,txt:action.todo.txt}]
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
})