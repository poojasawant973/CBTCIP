import React, { useEffect, useState } from "react";

let Todo = () => {
    function getData() {
        const lists = localStorage.getItem("todolist");
        return JSON.parse(lists);
    }
    
    let [task, setTask] = useState("");
    let [items, setItems] = useState(getData() || []);
    let [toggleBtn, setToggleBtn] = useState(false);
    let [editIndex, setEditIndex] = useState();

    useEffect(() => {
        localStorage.setItem("todolist", JSON.stringify(items));
    }, [items]);

    function addItem() {
        if (!task) {
            alert("Empty Data");
        } else if (task && toggleBtn) {
            setItems(
                items.map((element) => {
                    if (element.id === editIndex) {
                        return { ...element, taskdata: task };
                    }
                    return element;
                })
            );
            setEditIndex(null);
            setToggleBtn(false);
            setTask(""); 
        } else {
            const mynewdata = {
                id: new Date().getTime().toString(),
                taskdata: task,
                completed: false, // Add completed property
                timestamp: new Date().toLocaleString() // Add timestamp
            };
            setItems([...items, mynewdata]);
            setTask("");
        }
    }

    function deleteItem(id) {
        const updatedList = items.filter((element) => {
            return element.id !== id;
        });
        setItems(updatedList);
    }

    function editItem(id) {
        const edited_item = items.find((element) => {
            return element.id === id;
        });
        setTask(edited_item.taskdata);
        setEditIndex(id);
        setToggleBtn(true);
    }

    function markComplete(id) {
        setItems(
            items.map((element) => {
                if (element.id === id) {
                    return { ...element, completed: true };
                }
                return element;
            })
        );
    }

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-md-4 mx-auto">
                        <h2>To-Do List</h2>
                        <br /><br />
                        <input className="form-control" placeholder="Add a new task" value={task} id="task" onChange={(e) => setTask(e.target.value)} style={{ width: '300px', padding: '10px' }} />
                        <i className={toggleBtn ? "bi bi-pencil" : "bi bi-plus-lg"} id="add-icon" onClick={addItem}></i>
                        <button className="btn btn-primary" id="add" onClick={addItem}>Add</button>
                        <ul id="task-list">
                            {
                                items.map((element) => (
                                    <li key={element.id}>
                                        {element.taskdata} 
                                        {!element.completed && (
                                            <>
                                                <i className="bi bi-pen-fill" id="edit-btn" onClick={() => editItem(element.id)}></i>
                                                <i className="bi bi-trash-fill" id="delete-btn" onClick={() => deleteItem(element.id)}></i>
                                            </>
                                        )}
                                        {element.completed && <span style={{ marginLeft: '10px', color: 'green' }}>(Completed on {element.timestamp})</span>}
                                        {!element.completed && (
                                            <button className="btn btn-success btn-sm" onClick={() => markComplete(element.id)}>Mark Complete</button>
                                        )}
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Todo;
