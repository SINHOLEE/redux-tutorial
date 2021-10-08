

describe('applyMiddleWare test',()=>{
    describe('로거 미들웨어가 주어진다., 로거의 역할은 미들웨어에서 로거로 잘 들어왔나 체크하기 위함',()=>{
        let consoleHistory=[];
        const loggerMiddleware = ({getState})=>next=>action=>{
            consoleHistory.push(action);
            console.log({action})
            console.log({next})
            console.log({getState})
            console.log('state: ',getState())
            const res = next(action)
            console.log({res})

            return res

        }
        beforeEach(()=>{
            consoleHistory = [];


        })

         test('', () => {

             expect(1).toBe(1)
         })
    })
})