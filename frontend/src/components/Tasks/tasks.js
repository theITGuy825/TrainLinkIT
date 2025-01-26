import {useState} from 'react';
import uuid from 'react-uuid'
import Task from './Task/task'

function Tasks(){
    const [tasks, setTasks]=useState(
        [
            {
                id: uuid(),
                description: "Replace Batteries in TV Remote",
                done: false,
            },
            {
                id: uuid(),
                description: "DO JS4 Lab 2",
                done: false,
            },
            {
                id: uuid(),
                description: "Start BUSI-3040 Lab 2",
                done: false,
            }
        ]
    );
    const ClearTasks = () => {
        setTasks([]);
        }
        
    const StatusChange = (id) => {
        setTasks(tasks.map(task =>
        task.id === id ? { ...task, done: !task.done } : task));
        };

    const TaskRemove = (id) => {
        const filteredTasks = tasks.filter(
        (task) => task.id !== id
        );
            setTasks(filteredTasks);
        }

    return (
        <>
        <h2>My Tasks</h2>
        {tasks.map(//Populates tasks based from task.js format
            (task, index) => (
                <Task
                    key={index}
                    task={task}
                    onStatusChange={StatusChange}
                    onTaskRemove={TaskRemove}
                />
                )
            )}
            <hr />
            <button onClick={ClearTasks}>Clear Tasks</button>
        </>
    );
}

export default Tasks;