const fs = require('fs');
const { resolve } = require('path');
const { REPLServer } = require('repl');
const path = '../discord/database';
const errorMessage = require('../extras/replyMessages.js');
const dayjs = require('dayjs');


async function fileExists (path) {  
    let myPromise = new Promise(function(result) {
        fs.access(path, (err) => {
            if (err) {
             
              result(false);
            }
            result(true);
        });
    });
    return await myPromise;
} 
//make a promise to use the readFile
async function readFilePromise (name = "path"){
    let myPromise = new Promise(function(result) {
        fs.readFile(`${path}/${name}.json`,'utf8',(err, data)=>{     
            if(err){throw new Error(errorMessage.UserHaveNotTask)}   
            result(data);  
        });
    });
    return await myPromise;
};

//Parse json file content to objects
async function getTasks (id){ 
    return JSON.parse(await readFilePromise(id)); 
};

async function createJsonFile (name, data) {
    let myPromise = new Promise(function(result) {
    fs.writeFile(`${path}/${name}.json`, data, function(err, data) {
        if(err) console.log('error', err);
        result(true)
        });
    });
    return myPromise;
}

async function noExistCreate (userId, task = ' ')
{
    let flag1 = await fileExists(`${path}/${userId}.json`);
    if(!flag1)
    {
        let task1 = {
            author: userId,
            name: "SampleTask",
            description: "Delete it with !rtask Sample Task",
            status: false,
            startDate: new Date(),
            endDate: new Date()
        };
        console.log("No existing file for " +userId+ " creating a new one");
        
        let jsonFormated = task == ' '? JSON.stringify([task1], undefined, 4): JSON.stringify(task, undefined, 4); 
        //console.log(jsonFormated);
        await createJsonFile(userId,jsonFormated);
        //console.log("wtf");
        return true;
    }
    return false;
}

async function getTaskByName (userId, name) {
    let flag = await noExistCreate(userId);
    if(flag)throw new Error(errorMessage.UserHaveNotTask());

    var task = null;
    let dbTasks = await getTasks(userId);
    dbTasks.forEach(x => {
        if(x.name.toLowerCase() == name.toLowerCase()) 
        {
            task = x;}
    });
    
    flag1 = task == null ? false : true
    if(flag1)return task
    else throw new Error(errorMessage.NoExistingTask(name));

}

//Json Database commands
module.exports = {
    
    //creates a new json documents
    createJsonFile,
    //pull a task object to the json document
    pullDBJsonTask: async (task)=>{

        let tasks1 = [task];
        let flag = await noExistCreate(task.author,  tasks1);
        if(flag)return;

            let tasks = await getTasks(task.author);
            tasks.forEach(x => {
                //check if db contains the task already
             if(x.name == task.name) 
            {   
                throw new Error(errorMessage.ExistingTask(task.name));                
            }      
           });
            //add task and write it
           tasks.push(task);
           fs.writeFile(`${path}/${task.author}.json`,  JSON.stringify(tasks, undefined, 4), function(err, result) {
                  if(err) console.log('error', err);        
                  console.log("Saved Task");
              });  
            
    },
    //get all tasks from a user by them id
    getUserTasksById: async (userId) => 
    {
        let flag = await noExistCreate(userId);
        if(flag)throw new Error(errorMessage.UserHaveNotTask());
        return getTasks(userId);
    }, 

    getTaskByName,
    removeTask: async (userId, name)=>{
        let flag = await noExistCreate(userId);
        if(flag)throw new Error(errorMessage.UserHaveNotTask(name));

   
            await getTaskByName(userId, name);
            

        var tasks = await getTasks(userId);

        for (let index = 0; index < tasks.length; index++) {
            if(tasks[index].name.toLowerCase() == name.toLowerCase())
            {
                tasks.splice(index,1);
            }
            
        } 

        fs.writeFile(`${path}/${userId}.json`,  JSON.stringify(tasks, undefined, 4), function(err, result) {
               if(err) console.log('error', err);        
               console.log("Saved Task");
           }); 
  
    },
    getTasksUnderAWeekDate: async () =>
    {   
        
        const users =  fs.readdirSync('./database',()=>{}).filter(file => file.endsWith('.json'));
        let taskNExpired = [];
 
                for (let x of users) {

                    let tasks = await getTasks(x.substring(0, x.length-5));
                    
                    for (const task of tasks) {     
                       
                        if(dayjs(task.endDate).diff(dayjs(), 'day') <= 7 || dayjs(task.endDate) < dayjs())
                        {                 
                            taskNExpired.push(task);                    
                        }
                    }                
                }
                
               


        return await taskNExpired;
    },
    getTasks
    
};
