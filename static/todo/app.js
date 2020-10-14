const addform = document.querySelector('.add');
const list = document.querySelector('.todos');
const search = document.querySelector('.search input');

const getenrateItem = todo => {
	const html = `
		<li class="list-group-item d-flex justify-content-between aligh-items-center ">
			<span>${todo}</span>
			<i class="fa fa-trash-alt delete"></i>
		</li>
	`
	if(todo.length > 10){
		list.innerHTML += html
		addform.reset();
		document.querySelector('.notodo').classList.add('filtered');
	}
}
addform.addEventListener('submit', e => {
	e.preventDefault();
	const todo = addform.add.value.trim();
	getenrateItem(todo)
});

addform.add.addEventListener('keyup', e =>{
	if(e.target.value.length < 10){
		e.target.classList.add('is-invalid')
	}else{
		e.target.classList.remove('is-invalid')
	}
});

addform.add.addEventListener('focusout', e =>{
	if(e.target.value.length < 10 && e.target.value.length > 0){
		e.target.classList.add('is-invalid')
	}else{
		e.target.classList.remove('is-invalid')
	}
});

list.addEventListener('click', e => {
	if (e.target.tagName == 'I'){
		e.target.parentElement.remove();

		if(document.querySelector('.todos').children.length == 0){
			document.querySelector('.notodo').classList.remove('filtered');
		}else{
			document.querySelector('.notodo').classList.add('filtered');
		}
	}
});

const filterTodos = term => {
	let items = Array.from(list.children)
	const filtered = items.filter(todo => !todo.textContent.toLowerCase().includes(term.toLowerCase()))
	const unfiltered = items.filter(todo => todo.textContent.toLowerCase().includes(term.toLowerCase()))
		
	filtered.forEach(todo => {
			todo.classList.add('filtered')
		});
	
	unfiltered.filter(todo => todo.textContent.toLowerCase().includes(term.toLowerCase()))
		.forEach(todo => {
			todo.classList.remove('filtered')
		});
	
	return unfiltered.length
};

search.addEventListener('keyup', e => {
	remains = filterTodos(e.target.value)

	if(remains == 0){
		document.querySelector('.notodo').classList.remove('filtered');
	}else{
		document.querySelector('.notodo').classList.add('filtered');
	}
});

search.addEventListener('submit', e => {
	e.preventDefault();
});