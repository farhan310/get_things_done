const showFormButton = document.querySelector('#show-form');
const modal = document.querySelector('dialog');
const tasksList = document.querySelector('#tasks-list');
const form = document.querySelector('form');
const statusSelect = document.querySelector('#status');
const searchInput = document.querySelector('#search');

let tasks = [];

const openModal = () => {
  modal.open = true;
  form.description.focus();
};

const handleModalClick = event => {
  const wasTheClickOutsideTheForm = !event.target.closest('form');
  if (wasTheClickOutsideTheForm) {
    modal.open = false;
  }
};

const handleKeyUp = event => {
  if (event.key === 'Escape') {
    modal.open = false;
  }
};

const updateFilters = () => {
  const selectedStatus = statusSelect.value.toLowerCase();
  const searchTerm = searchInput.value.toLowerCase();
  const filteredTasks = tasks.filter(task => {
    const doesTheSearchTermMatch = task.description
      .toLowerCase()
      .includes(searchTerm);
    const isTheSelectedStatusAll = selectedStatus === 'all';
    const isTheSelectedStatusCompletedAndTheTaskIsCompleted =
      selectedStatus === 'completed' && task.completed;
    const isTheSelectedStatusIncompleteAndTheTaskIsIncomplete =
      selectedStatus === 'incomplete' && !task.completed;
    const doesTheStatusFilterMatch =
      isTheSelectedStatusAll ||
      isTheSelectedStatusCompletedAndTheTaskIsCompleted ||
      isTheSelectedStatusIncompleteAndTheTaskIsIncomplete;
    return doesTheSearchTermMatch && doesTheStatusFilterMatch;
  });

  const fragments = filteredTasks.map(renderTask);
  tasksList.innerHTML = '';
  tasksList.prepend(...fragments);
};

const handleFormSubmit = async event => {
  event.preventDefault();
  const url = `/tasks`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ description: form.description.value }),
  });
  const newTask = await response.json();
  tasks.unshift(newTask);
  updateFilters();
  form.reset();
  modal.open = false;
};

const deleteTask = async event => {
  const didConfirm = window.confirm('Are you sure?');
  if (didConfirm) {
    const theListItemToDelete = event.currentTarget.closest('li');
    const theIdOfTheListItemToDelete = Number(theListItemToDelete.dataset.task);
    const url = `/tasks/${theIdOfTheListItemToDelete}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    if (response.ok) {
      const indexOfTaskToDelete = tasks.findIndex(
        task => task.id === theIdOfTheListItemToDelete
      );
      tasks.splice(indexOfTaskToDelete, 1);
      updateFilters();
    }
  }
};

const handleCheckboxClick = event => {
  const theCheckboxThatGotClicked = event.currentTarget;
  const theClosestLi = event.currentTarget.closest('li');
  const theIdOfTheTaskToUpdate = Number(theClosestLi.dataset.task);
  const body = { completed: theCheckboxThatGotClicked.checked };
  const url = `/tasks/${theIdOfTheTaskToUpdate}`;
  fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });
  const taskToUpdate = tasks.find(task => task.id === theIdOfTheTaskToUpdate);
  taskToUpdate.completed = theCheckboxThatGotClicked.checked;
  updateFilters();
};

const handleDescriptionChange = event => {
  const theInputThatChanged = event.currentTarget;
  const whatTheUserTyped = theInputThatChanged.value;
  const theClosestLi = theInputThatChanged.closest('li');
  const theIdOfTheTaskToUpdate = Number(theClosestLi.dataset.task);
  const body = { description: whatTheUserTyped };
  const url = `/tasks/${theIdOfTheTaskToUpdate}`;
  fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });
  const taskToUpdate = tasks.find(task => task.id === theIdOfTheTaskToUpdate);
  taskToUpdate.description = whatTheUserTyped;
  updateFilters();
};

function renderTask(task) {
  const html = `
  <li data-task="${task.id}">
    <input type="checkbox" ${task.completed ? 'checked' : ''}/>
    <input type="text" value="${task.description}">
    <button class="delete-task">&times;</button>
  </li>`;
  const fragment = document.createRange().createContextualFragment(html);
  const button = fragment.querySelector('button');
  const checkbox = fragment.querySelector('input[type="checkbox"]');
  const textInput = fragment.querySelector('input[type="text"]');
  button.addEventListener('click', deleteTask);
  checkbox.addEventListener('click', handleCheckboxClick);
  textInput.addEventListener('change', handleDescriptionChange);
  return fragment;
}

const fetchTasks = async () => {
  const url = `/tasks`;
  const response = await fetch(url);
  tasks = await response.json();
  const fragments = tasks.map(renderTask);
  tasksList.prepend(...fragments);
};

showFormButton.addEventListener('click', openModal);
modal.addEventListener('click', handleModalClick);
window.addEventListener('keyup', handleKeyUp);
form.addEventListener('submit', handleFormSubmit);
statusSelect.addEventListener('change', updateFilters);
searchInput.addEventListener('input', updateFilters);

fetchTasks();
