const { Console } = require('console');
const fs = require('fs');
const task = require('../commands/task');
const path = '../discord/database';
let name = 'dbdTasks'


module.exports = {
    
    createJsonFile: (path,name, data = '') =>  {

  
        this.name = name;
       
        fs.writeFile(`${path}/${name}.json`, data, function(err, result) {
            if(err) console.log('error', err);
        });
    },
    pullDBJsonTask: (task) =>{
        let tasks = this.getTasks('dbdTasks');
     
        tasks.push(task);
        fs.writeFile(`${path}/${name}.json`, tasks, function(err, result) {
            if(err) console.log('error', err);
        });
    },
    getTasks: () => {
        fs.read(`${path}/${name}.json`, 'utf8', (err, jsonString) => {
            if (err) {
                console.log("File read failed:", err)
                return
            }
            let tasks = JSON.parse(jsonString);
           // console.log("xd");
            // console.log(tasks)
            return tasks;
            
        }).then(x => {
            console.log(x);
        });
      
    }
    
};

