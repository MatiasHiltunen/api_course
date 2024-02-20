import test from "node:test";
import { read, save,  } from "../../src/database/jsonDb";



test('IO-operations read', async (t)=>{

 

        console.time('read')
        
        for(let i = 0; i< 100; i++){
            await read('dogs')
        }
        
        console.timeEnd('read')
        


})

test('IO-operations write', async ()=>{
    console.time('read')
        
    for(let i = 0; i< 100; i++){
        await save('dogs', `{"38bc4913-6fbf-4e09-aea4-d4045bab46f4":{"name":"Pepi","age":"123","image":"https://images.dog.ceo/breeds/mountain-bernese/n02107683_997.jpg","id":"38bc4913-6fbf-4e09-aea4-d4045bab46f4"}}`)
    }
    
    console.timeEnd('read')
})