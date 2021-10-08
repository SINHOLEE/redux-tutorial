export const addTodo = (todo)=>{
    return {
        type:'ADD_TODO',
        payload:{todo}
    }
}


export default  function ( state=[],action){
    switch (action.type){
        case 'ADD_TODO':
            return [...state, action.payload.todo]
        default:
            return state
    }
}