const fs = require('fs');
const path = '../discord/database';



module.exports = {
    
    createJsonFile: (path,name, data = '') =>  {

        let task1Template = [{
            author: "317332505168707594",
            name: "Tarea1",
            description: "Example of a Task",
            startDate: "10/4/2021",
            endDate: "17/4/2021"
        }];

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
    getTasks: (nameFile) => {
        fs.readFile(`${path}/${name}.json`, 'utf8', (err, jsonString) => {
            if (err) {
                console.log("File read failed:", err)
                return
            }

            return JSON.parse(jsonString);
            
        })
    }
    
};

