function Task(props) {
    const StatusClick = () => {
        const id = props.task.id;
        props.onStatusChange(id);
        }

    const RemoveClick = () => {
        const id = props.task.id;
        props.onTaskRemove(id);
    }
            
    return (
    <div>
        <hr />
        <h3>{props.task.description}</h3>
        <div>ID: {props.task.id}</div>
        <div> Status: {props.task.done ? 'Completed' : 'Open'} </div>
        <button onClick={StatusClick}>Status Change</button>
        <button onClick={RemoveClick}>Remove Task</button>
    </div>
    
    );
    }
    export default Task;