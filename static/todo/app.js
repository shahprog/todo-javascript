const addTodoForm = document.querySelector('.add');
const todoList = document.querySelector('.todos');
const searchForm = document.querySelector('.search');
const search = document.querySelector('.search input');

const getFirstTodos = (data) => {
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

const updateTodos = (data) => {
	return new Promise((resolve, reject) => {
		const html = `
		<li class="list-group-item d-flex justify-content-between aligh-items-center" id=${data[0]}>
			<span class='typed'></span>
			<i class="fa fa-trash-alt delete"></i>
		</li>
		`

		todoList.innerHTML += html
		typeIt(data[1]);
		// console.log(todoList.children)
	})
}

const typeIt = (msg) => {
	const typed = new Typed('.typed', {
		strings: [msg]
	});
	
	document.querySelector('.typed').classList.remove('typed');
}

addTodoForm.addEventListener('submit', e => {
	e.preventDefault();
	const todo = addTodoForm.todo.value.trim();
	if(todo.length > 5){
		addTodoForm.reset();
		firebase.database().ref(`todos/${firebase.auth().currentUser.uid}/`).push({
			body : todo
		}).then((data) => {
			updateTodos([data.key, todo])
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

const getTodos = (path) => {
	return new Promise((resolve, reject) => {
		firebase.database().ref(path).once('value', (snap) =>{
			resolve(snap);
		});
	});
};

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
		getTodos(`todos/${user.uid}/`).then((snap) => {
			let count = 0;
			snap.forEach(row => {
				getFirstTodos([row.key, row.val().body]);
				count += 1;
				
			});

			if(count <= 0){
				document.querySelector('.notodo').classList.remove('filtered');
			}else{
				console.log(count)
			}

			document.querySelector('.loading').style.display = 'none'
		}).catch((error) => {
			//
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
			console.log(e)
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