const fs = require('fs');
const path = '../discord/database';
let name = 'dbdTasks'
 

async function getTasks  (){

    let myPromise = new Promise(function(result) {
        fs.readFile(`${path}/${name}.json`,'utf8',(err, data)=>{
            if(err)throw err;
            datan = JSON.parse(data);
            result(datan);  
        });
    });
    return await myPromise;
    
};

module.exports = {
    
    createJsonFile: (path,name, data = '') =>  {
        this.name = name;
       
        fs.writeFile(`${path}/${name}.json`, data, function(err, result) {
            if(err) console.log('error', err);
        });
    },
    pullDBJsonTask: (task) =>{

        tasks = JSON.parse(fs.readFileSync(`${path}/${name}.json`));
         
        tasks.push(task);
        fs.writeFile(`${path}/${name}.json`,  JSON.stringify(tasks, undefined, 4), function(err, result) {
            if(err) console.log('error', err);
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
