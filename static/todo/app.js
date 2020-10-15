const addTodoForm = document.querySelector('.add');
const todoList = document.querySelector('.todos');
const searchForm = document.querySelector('.search');
const search = document.querySelector('.search input');

const getTodos = (data) => {
	return new Promise((resolve, reject) => {
		const html = `
		<li class="list-group-item d-flex justify-content-between aligh-items-center" id=${data[0]}>
			<span>${data[1]}</span>
			<i class="fa fa-trash-alt delete"></i>
		</li>
		`

		todoList.innerHTML += html
		// console.log(todoList.children)
	})

	
}

addTodoForm.addEventListener('submit', e => {
	e.preventDefault();
	const todo = addTodoForm.todo.value.trim();
	if(todo.length > 5){
		addTodoForm.reset();
		id = new Date().getTime();
		firebase.database().ref(`todos/${firebase.auth().currentUser.uid}/`).push({
			body : todo
		}).then((data) => {
			getTodos([data.key, todo])
			document.querySelector('.notodo').classList.add('filtered');
		}).catch((error) => {
			swal({
				title: "Info",
				text: error.message,
				icon: "warning",
				buttons: false,
				dangerMode: true,
			});
		});
	}else{
		swal({
            title: "Info",
            text: "Todo length must be greater than 5",
            icon: "warning",
            buttons: false,
            dangerMode: true,
		});
	}
});

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        firebase.database().ref(`todos/${user.uid}/`).once('value', (snap) =>{
			let count = 0;
			snap.forEach(row => {
				// console.log(row.val())
				getTodos([row.key, row.val().body]);
				count += 1;
				
			});

			if(count <= 0){
				document.querySelector('.notodo').classList.remove('filtered');
			}else{
				console.log(count)
			}
			console.log('Here')
		});
    } else {
		// pass
    }
});

todoList.addEventListener('click', e => {
	if(e.target.tagName === 'I'){
		const parent = e.target.parentElement
		const key = parent.getAttribute('id');
		firebase.database().ref(`todos/${firebase.auth().currentUser.uid}/${key}/`).remove().catch(e => {
			console.log('error')
		});

		parent.remove();
		if(Array.from(todoList.children).length <= 0){
			document.querySelector('.notodo').classList.remove('filtered');
		}
	}
});


const filterTodos = term => {
	console.log(1)
	let items = Array.from(todoList.children)
	const filtered = items.filter(todo => !todo.textContent.toLowerCase().includes(term.toLowerCase()))
	const unfiltered = items.filter(todo => todo.textContent.toLowerCase().includes(term.toLowerCase()))

	filtered.forEach(element => {
		element.classList.add('filtered')
	});

	unfiltered.forEach(element => {
		element.classList.remove('filtered')
	});
};

searchForm.addEventListener('submit', e => {
	e.preventDefault();
});

search.addEventListener('keyup', e => {
	remains = filterTodos(e.target.value)
	
	if(remains == 0){
		document.querySelector('.notodo').classList.remove('filtered');
	}else{
		document.querySelector('.notodo').classList.add('filtered');
	}
	
});