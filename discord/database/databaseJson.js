const { throws } = require('assert');
const { error } = require('console');
const fs = require('fs');
const path = '../discord/database';
const errorMessage = require('../extras/replyMessages.js');

let name = 'dbdTasks'
 
async function readFilePromise (){
    let myPromise = new Promise(function(result) {
        fs.readFile(`${path}/${name}.json`,'utf8',(err, data)=>{
            if(err)throw err;            
            result(data);  
        });
    });
    return await myPromise;
};
async function getTasks  (){

    return await  JSON.parse(readFilePromise());
    
};

module.exports = {
    
    createJsonFile: (path,name, data = '') =>  {
        this.name = name;
       
        fs.writeFile(`${path}/${name}.json`, data, function(err, result) {
            if(err) console.log('error', err);
        });
    },
    pullDBJsonTask: async (task) =>{
        
        await readFilePromise().then((data)=>
        {
            let tasks = JSON.parse(data);
            let flag1 = true;
            tasks.forEach(x => {

             if(x.name == task.name) 
            {   
                throw new Error(errorMessage.ExistingTask(task.name));                
            }      
           });

           if(flag1){
           tasks.push(task);
           fs.writeFile(`${path}/${name}.json`,  JSON.stringify(tasks, undefined, 4), function(err, result) {
                  if(err) console.log('error', err);        
                  console.log("Saved Task");
              });  
            } 
        });
            
    },
    getUserTaskById: (userId) => {

        let dbTasks = JSON.parse(getTasks());
        let userTasks = [];
        dbTasks.forEach(x => {
            if(x.author == userId) userTasks.push(x);
        });
        return userTasks;
    }, 
    getTasks
    
};
