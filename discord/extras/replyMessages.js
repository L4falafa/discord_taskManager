const BadSyntax = (command)=> `Use **!help ${command}** to see the correct`;
const ExistingTask = (name)=> `There is already a existing task with the name **${name}**, you can delete it`;
const SuccessfulyAddTask = (name, date) => `Successfuly added the task ${name}, End Date: ${date}`;
module.exports = {
    BadSyntax,
    ExistingTask,
    SuccessfulyAddTask
}