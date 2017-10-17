
var module = (function () {
  return {
    init: function (holderClassName) {


      var TODO_HOLDER = document.getElementsByClassName(holderClassName)[0]

    // INITIAL TODO-LIST END

    // CREATE INITIAL LAYOUT

    var filterButtonsTemplates = [
      'all',
      'done',
      'active',
      'today',
      'week'
    ];



    var todoWrapper = document.createElement('div');
    todoWrapper.classList.add('todo-wrapper');


    var filtersWrapper = document.createElement('div');
    filtersWrapper.classList.add('filters-wrapper');

    for (var i = 0; i < filterButtonsTemplates.length; i++) {
      var tempButton = document.createElement('button');
      tempButton.classList.add('filter-button');
      tempButton.setAttribute('filter', filterButtonsTemplates[i]);
      tempButton.innerHTML = filterButtonsTemplates[i];
      filtersWrapper.appendChild(tempButton);
    }


  // create form start
    var formHtmlGenerated = document.createElement('form');
    formHtmlGenerated.setAttribute('id', 'todo-add-form');
    // create form controls
    var inputTextHtmlGenerated = document.createElement('input');
    inputTextHtmlGenerated.setAttribute('type', 'text');
    inputTextHtmlGenerated.setAttribute('name', 'title');
    inputTextHtmlGenerated.setAttribute('placeholder', 'add todo');

    var inputDateHtmlGenerated = document.createElement('input');
    inputDateHtmlGenerated.setAttribute('type', 'date');
    inputDateHtmlGenerated.setAttribute('name', 'deadline');

    var buttonSubmitHtmlGenerated = document.createElement('button');
    buttonSubmitHtmlGenerated.setAttribute('type', 'submit');
    buttonSubmitHtmlGenerated.innerHTML = 'submit';

    var buttonResetHtmlGenerated = document.createElement('button');
    buttonResetHtmlGenerated.setAttribute('type', 'reset');
    buttonResetHtmlGenerated.innerHTML = 'reset';


    formHtmlGenerated.appendChild(inputTextHtmlGenerated);
    formHtmlGenerated.appendChild(inputDateHtmlGenerated);
    formHtmlGenerated.appendChild(buttonSubmitHtmlGenerated);
    formHtmlGenerated.appendChild(buttonResetHtmlGenerated);

    // create form end
    var ulHTMLGenerated = document.createElement('ul');
    ulHTMLGenerated.setAttribute('id', 'todos-list-output');

    todoWrapper.appendChild(filtersWrapper);
    todoWrapper.appendChild(formHtmlGenerated);
    todoWrapper.appendChild(ulHTMLGenerated);


    TODO_HOLDER.appendChild(todoWrapper);


  // CREATE INITIAL LAYOUT ENDED


  // INITIAL TODO-LIST START
  var dataTodosList = [
    // {
    //     "id": 8784,
    //     "title": "blabla",
    //     "isDone": false,
    //     "deadline": "data"
    //   },
    //   {
    //     "id": 1324,
    //     "title": "blabla1",
    //     "isDone": true,
    //     "deadline": "data"
    //   },
    //   {
    //     "id": 123144,
    //     "title": "blabla2",
    //     "isDone": true,
    //     "deadline": "data"
    //   }
  ];

    // INITIAL TODO-LIST END



  var filterBtns = document.getElementsByClassName('filter-button');

  for (var i = 0; i < filterBtns.length; i++) {
    filterBtns[i].addEventListener('click', filter.bind(null, filterBtns[i]))
  }

  var currentFilter = 'all';

  var todoAddForm  = document.getElementById('todo-add-form');
  todoAddForm.addEventListener('submit', addNewTodo);

  var todosListOutput  = document.getElementById('todos-list-output');

  function generateRandomId() {
    return parseInt(Math.random()*1000000);
  }


  // TODAY START
  var today = new Date();
  // NEXT WEEK
  var nextWeek = new Date(+new Date + 12096e5/2);


  // SET TODAY IN PLACEHOLDER
  function setToday () {
    var year = today.getUTCFullYear().toString();
    var day = today.getUTCDate().toString();
    var month = today.getUTCMonth() + 1;
    var defaultDateValue = '';
    month = month.toString();
    defaultDateValue = year + '-' + month + '-' + day;
    today = defaultDateValue;
    todoAddForm.elements.namedItem("deadline").value = defaultDateValue;
  }

  function addNewTodo(e) {
    e.preventDefault(e);
    var newTodo = {
      "id": 0,
      "title": "",
      "isDone": false,
      "deadline": ""
    }
    var title = todoAddForm.elements.namedItem("title").value;
    var deadline = todoAddForm.elements.namedItem("deadline").value;
    if (title && deadline) {
      todoAddForm.elements.namedItem("title").classList.remove('error-input');
      todoAddForm.elements.namedItem("deadline").classList.remove('error-input');
      newTodo['id'] = generateRandomId();
      newTodo['title'] = title;
      newTodo['deadline'] = new Date(deadline);
      todoAddForm.elements.namedItem("title").value = ''
      todoAddForm.elements.namedItem("deadline").value = '';
      var todNum = dataTodosList.length;
      dataTodosList.push(newTodo);
      if (currentFilter === 'all' || currentFilter === 'active' || currentFilter === 'today') {
        genereteHtmlSingleTodo(todNum ,newTodo['id'])
      }
    }
    else {
      console.log(todoAddForm.elements.namedItem("title").value === true);
      !todoAddForm.elements.namedItem("title").value ? todoAddForm.elements.namedItem("title").classList.add('error-input') : false;
      !todoAddForm.elements.namedItem("deadline").value ? todoAddForm.elements.namedItem("deadline").classList.add('error-input') : false;
    }
  }


  function genereteHtmlSingleTodo(todoNum, todoId, filter) {
      var newLi         = document.createElement('li');
      var todoTitle     = document.createElement('span');

      // TODO TOGGLER CONTROL
      var todoChekbox   = document.createElement('input');
      todoChekbox.type  = 'checkbox';
      todoChekbox.addEventListener('click', changeTodoStatus.bind(null, todoId));
      if (dataTodosList[todoNum]['isDone']) {
          todoTitle.classList.add('done');
          todoChekbox.checked = true;
      }

      // DELETE CONTROL
      var deleteBtn = document.createElement('span');
      deleteBtn.classList.add('deleteBtn')
      deleteBtn.innerHTML = '&times;';
      deleteBtn.addEventListener('click', deleteTodoItem.bind(null, todoId))
      newLi.appendChild(deleteBtn);

      // TITLE TODO
      todoTitle.classList.add('title');
      todoTitle.innerHTML = dataTodosList[todoNum]['title'];

      // todoLabel.appendChild(todoTitle);
      // todoLabel.appendChild(todoChekbox);

      newLi.appendChild(todoTitle);
      newLi.appendChild(todoChekbox);

      // newLi.appendChild(todoLabel);
      newLi.setAttribute('todoId', todoId);
      todosListOutput.appendChild(newLi);
  }

  function showTodosList(filterArg) {
    for (var i = 0; i < dataTodosList.length; i++ ) {
      if(filterArg === 'all') {
        genereteHtmlSingleTodo(i, dataTodosList[i]['id'])
      }
      else if(filterArg === 'done') {
        dataTodosList[i]['isDone'] ? genereteHtmlSingleTodo(i, dataTodosList[i]['id']) : false;
      }
      else if(filterArg === 'active') {
        dataTodosList[i]['isDone'] ?  false : genereteHtmlSingleTodo(i, dataTodosList[i]['id']);
      }
      else if(filterArg === 'week') {
        new Date(dataTodosList[i]['deadline']).getTime() >= new Date(today).getTime() && new Date(dataTodosList[i]['deadline']).getTime() <= new Date(nextWeek).getTime() ? genereteHtmlSingleTodo(i, dataTodosList[i]['id']) : false;
      }
      else if(filterArg === 'today') {
        new Date(dataTodosList[i]['deadline']).getTime() === new Date(today).getTime() ? genereteHtmlSingleTodo(i, dataTodosList[i]['id']) : false;
      }
    }
  }


  function changeTodoStatus(id) {
    var parentContainer = document.querySelectorAll('[todoid="' + id + '"]');
    var title = parentContainer[0].getElementsByClassName('title');
    dataTodosList =  dataTodosList.map( (todoItem) => { return todoItem['id'] === id ? Object.assign({}, todoItem, {'isDone': !todoItem['isDone']})  : todoItem })
    title[0].classList.toggle('done');
    if (currentFilter === 'active' || currentFilter === 'done') {
      todosListOutput.removeChild(parentContainer[0]);
    }
  }

  function deleteTodoItem(id) {
    var parentContainer = document.querySelectorAll('[todoid="' + id + '"]');
    dataTodosList = dataTodosList.filter((todoItem) => { return todoItem['id'] === id ?  false : true })
    todosListOutput.removeChild(parentContainer[0]);
  }



  function filter(button) {
    var filterType = button.getAttribute('filter');
    filterBtns = Array.prototype.slice.call(filterBtns);
    filterBtns.map( (filterBtn) => { filterBtn.getAttribute('filter') === filterType ? filterBtn.classList.add('filter-button-active') : filterBtn.classList.remove('filter-button-active')})
    while (todosListOutput.firstChild) {
      todosListOutput.removeChild(todosListOutput.firstChild);
      }
    currentFilter = filterType;
    showTodosList(filterType);
  }


  setToday();

  }
  }
})();
