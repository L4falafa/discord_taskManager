const BadSyntax = (command)=> `Use **!help ${command}** to see the correct syntax`;
const ExistingTask = (name)=> `There is already a existing task with the name **${name}**, you can delete it`;
const SuccessfulyAddTask = (name, date) => `Successfuly added the task **${name}**, End Date: **${date}**`;
const UserHaveNotTask = (xd) => `You don´t have any task, create a new one! with **!ctask**`;
const NoExistingTask = (name) => `There is´t any task named ${name}, check your tasks with !gtasks`;
const SuccessfulyDeletedTask = (name) => `Successfuly deleted the task **${name}**`;

module.exports = {
    BadSyntax,
    ExistingTask,
    SuccessfulyAddTask,
    UserHaveNotTask,
    NoExistingTask,
    SuccessfulyDeletedTask
}