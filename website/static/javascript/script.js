const minTodoLen = 5;
const maxTodoLen = 200;

const todo_sound_dir = "static/sounds/todo";

const deleteTodoSound = new Audio(`${todo_sound_dir}/delete.wav`);
const completeTodoSound = new Audio(`${todo_sound_dir}/complete.wav`);

// Add Todo in SQL database
const addTodo = () => {
    let todoText = document.getElementById("todo").value;
    let length = todoText.length;
    if (length >= minTodoLen && length <= maxTodoLen) {
        fetch("/add_todo", {
            method: "POST",
            body: JSON.stringify({ todoText: todoText })
        }).then((_res) => {
            $( "#todo-section" ).load(window.location.href + " #todo-section ");
        });
    }
    else if (length < minTodoLen) {
        document.getElementById("todo").value = "";
        $.alert({
            title: "Invalid Todo Length ✍",
            content: `Minimum Characters: ${minTodoLen}`,
        });
    }
    else {
        document.getElementById("todo").value = "";
        $.alert({
            title: "Invalid Todo Length ✍",
            content: `Maximum Characters: ${maxTodoLen}`,
        });
    }
}

// Delete Todo in SQL database
const deleteTodo = (todoId) => {
    fetch("/delete_todo", {
        method: "POST",
        body: JSON.stringify({ todoId: todoId })
    }).then((_res) => {
        deleteTodoSound.play();
        $( "#todo-section" ).load(window.location.href + " #todo-section ");
    });
}

// Mark Todo as Completed in SQL database
const completeTodo = (todoId) => {
    fetch("/complete_todo", {
        method: "POST",
        body: JSON.stringify({ todoId: todoId })
    }).then((_res) => {
        completeTodoSound.play();
        $( "#todo-section" ).load(window.location.href + " #todo-section ");
    });
}

// Delete Completed Todo in SQL database
const deleteCompleted = (todoId) => {
    fetch("delete_completed", {
        method: "POST",
        body: JSON.stringify({ todoId: todoId })
    }).then((_res) => {
        window.location.href = "/completions";
    });
}

// Store current route
let path = window.location.pathname;

// Auto-Close Bootstrap Alert
$(document).ready(() => {
    const alertDuration = () => path === "/" ? 1000 : 1500;
    window.setTimeout(function() {
        $(".alert").fadeTo(1000, 0).slideUp(1000, function(){
            $(this).remove(); 
        });
    }, alertDuration());
});

// Auto-Change Active Navbar Link
$(document).ready(() => {
    $("a").removeClass("active");
    $(path != "/" ? `#${path.substring(1)}` : "#home").addClass("active");
});
