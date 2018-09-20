//по загрузке:
$('#logout-button').hide(); //скрываем кнопку разлогинивания
setColorInput("password", $('#password-text')); //устанавливаем цвет для валидации
setColorInput("login", $('#password-text')); //устанавливаем цвет для валидации
SetErrorViewer(); //выводим дефолтное сообщение

//по готовности страницы
$( document ).ready(function()
{
    LogIn();
    //обработчик нажатий на enter
    document.addEventListener("keydown", function(event)
    {
        if(event.which === 13)
        {
            if($('.new-todo').is(":focus") && $('.new-todo').val().length > 0)
                AddNewTodoListItem($('.new-todo').val());

            if($('.edit').is(":focus") && $('.edit').val().length > 0)
                Update($('.edit').val());
        }
    });


    $("button#des2.destroy").click(function()
    {
        alert();
    });

    //валидатор ввода пароля
    $('#password-text').on("input",function() { setColorInput("password", $('#password-text')); });

    //валидатор ввода логина
    $('#login-text').on("input",function() { setColorInput("login", $('#login-text')); });

    //обработчик нажатия на кнопку логина
    $('#login-button').click(function() { LogIn($('#login-text').val(), md5($('#password-text').val())); });

    //обработчик нажатия на кнопку логина
    $('#logout-button').click(function() { LogOut(); });

    //обработчик нажатия на кнопку логина
    $('#register-button').click(function() { Register($('#login-text').val(), md5($('#password-text').val())); });

    //обработчик клика на подсказку/ошибку
    $('#error-viewer').click(function() { $(this).hide(400); });

    //фильтр all
    $(".filters li a#all").click(function()
    {
        $(".todo-list li").show(300);
        $(".filters li a").removeClass("selected");
        $(".filters li a#all").addClass("selected");
    });

    //фильтр active
    $(".filters li a#active").click(function()
    {
        $(".todo-list li").show(300); // показываем все
        $(".todo-list li.completed").hide(300); // скрываем ненужные

        $(".filters li a").removeClass("selected"); // удаляем подсветку выделенного из всех
        $(".filters li a#active").addClass("selected"); // добавляем подсветку на нужную
    });

    //фильтр completed
    $(".filters li a#completed").click(function()
    {
        $(".todo-list li").show(300);
        $(".todo-list li").not(".completed").hide(300);

        $(".filters li a").removeClass("selected");
        $(".filters li a#completed").addClass("selected");
    });

    //обработчик кнопки выделения всех элементов
    $(".toggle-all").click(function() { CheckAll($(".toggle-all").prop('checked')); });

    //обработчик кнопки очистки выполненного
    $('.clear-completed').click(function() { ClearComplited();});

    //обработчик кнопки удаления
    $(document).on('click', '.destroy', function() { DeleteOne($(this).attr('id').split('destroy_id')[1]); });

    //обработчик кнопки переключения
    $(document).on('click', '.toggle', function(){ SetChecked($(this).attr('id').split('toggle_id')[1], $(this).prop('checked')); });

    //обработчик кнопки
    $(document).on('dblclick', '.view label', function()
    {
        $('#edit_id'.concat($(this).attr('id').split('label_id')[1]))[0].css("display","inline");
        $('#edit_id'.concat($(this).attr('id').split('label_id')[1]))[0].css("width","fit-content");
    });
});


//////////////////////////////////////////////////////////////////////////////////////////////////обработчики

function CheckAll(status)
{
    $.ajax({
        type: "POST",
        url: "backend/Controllers/TodoListsItem/SetAllCheck.php",
        data: {login: get_cookie("login"), password: get_cookie("password"), status: status}
    }).done(function (result)
    {
        ShowItems();
    });
}

//обработчик добавления нового элемента в список
function AddNewTodoListItem(text)
{
    $.ajax({
        type: "POST",
        url: "backend/Controllers/TodoListsItem/Create.php",
        data: {login: get_cookie("login"), password: get_cookie("password"), text: text}
    }).done(function (result)
    {
        $('.new-todo').val("");
        ShowItems();
    });
}

//обработчик цвета поля при валидации
function setColorInput(_type, _input)
{
    var isValid = false; //флаг для валидации
    var color = "#f44336"; //red - по умолчанию задаём негативный цвет
    switch (_type)
    {
        case "login": isValid = IsValidLogin(_input.val()); break;
        case "password": isValid = IsValidPassword(_input.val()); break;
    }
    if(isValid) color = "#4CAF50";//green
    _input.css("border-color",color);

    //а дальше ещё проверяем валидацию и блокируем/разблокируем кнопку логина
    if(IsValidPassword($('#password-text').val()) && IsValidLogin($('#login-text').val()))
        $('#login-button').show(100);
    else
        $('#login-button').hide(100);
}

//обработчик ошибок
function SetErrorViewer(text, type, timeout)
{
    //параметры по умолчанию
    text = (typeof text !== 'undefined') ? text : "FIRST: <b>log in</b> or <b>register</b>";
    type = (typeof type !== 'undefined') ? type : "info";
    timeout = (typeof timeout !== 'undefined') ? timeout : 2000;

    if(text == "hide")
    {
        setTimeout(function(){$('#error-viewer').hide(400);},timeout);
        return;
    }
    else $('#error-viewer').show(400);

    var color = "";
    switch (type)
    {
        case "error": color = "#f44336"; break; // red
        case "info": color = "#008CBA"; break; // blue
        case "help": color = "#4CAF50"; break; // green
        default: color = "#4CAF50"; // blue
    }
    $('#error-viewer').html(text);
    $('#error-viewer').css("background-color",color);
    setTimeout(function(){$('#error-viewer').hide(400);},timeout);
}

//валидатор логина
function IsValidLogin(login)
{
    return login.match(new RegExp(/^[a-z0-9_-]{3,16}$/)) == null ? false : true;
}

//валидатор пароля
function IsValidPassword(password)
{
    return password.match(new RegExp(/^[a-z0-9_-]{8,16}$/)) == null ? false : true;
}

//обработчик регистрации
function Register(login, password)
{
    $.ajax({
        type: "POST",
        url: "backend/Controllers/Auth/Register.php",
        data: {login: login, password:password}
    }).done(function (result)
    {
        if(result == "FAIL") SetErrorViewer("FAIL REGISTRING");
        else
        {
            LogIn(login, password);
            SetErrorViewer("Hello, " + login + ", now you're registered!", "help");
            $('#login-area').hide(300);
        }
    });
}

//обработчик залогинивания
function LogIn(login, password)
{
    login = (typeof login !== 'undefined') ? login : get_cookie("login");
    password = (typeof password !== 'undefined') ? password : get_cookie("password");

    $.ajax({
        type: "POST",
        url: "backend/Controllers/Auth/LogIn.php",
        data: { login: login, password:password }
    }).done(function (result)
    {
        if(result == "FAIL") //если логин зафакаплен
        {
            SetErrorViewer("PLEASE LOG IN", "info");
            $('#login-area').show(300);
            $('.todoapp').hide();
        }
        else //если логин прошёл
        {
            SetErrorViewer("Nice to see you again, " + login, "help");
            $('#login-area').hide(300);
            $('#logout-button').show();
            $('.todoapp').show();
            ShowItems();
        }
    });
}

//обработчик залогинивания
function LogOut()
{
    $.ajax({
        type: "POST",
        url: "backend/Controllers/Auth/LogOut.php"
    }).done(function (result)
    {
        LogIn();
        $('#logout-button').hide();
    });
}

//получить печеньку по имени
function get_cookie ( cookie_name )
{
    var results = document.cookie.match ( '(^|;) ?' + cookie_name + '=([^;]*)(;|$)' );

    if ( results )
        return ( unescape ( results[2] ) );
    else
        return null;
}

function ShowItems()
{
    $.ajax({
        type: "POST",
        url: "backend/Controllers/TodoListsItem/Read.php",
        data: {login: get_cookie("login"), password: get_cookie("password")}
    }).done(function (result)
    {
        //парсим json с бэка и формируем списочек
        FormatList(JSON.parse(result));
    });
}

//формируем списочек
function FormatList(array)
{
    $('.todo-list').html(""); // обнуляем начинку списка
    var leftCounter = 0;
    $.each(array, function (i) // бежим по полученному из ShowItems() массиву элементов
    {
        var node = document.createElement("LI"); // создаём li
        var id = "id"+array[i]['Id']; // выделяем id для идентификации чего изменять или удалять
        node.id = id; // присваиваем его

        var isChecked = array[i]['IsChecked'] == 1; // создаём полезный флаг для экономии кода
        var checked = isChecked ? "checked" : ""; // текстовая версия для чек-боксов
        var text = array[i]['Text']; // вываливаем в переменную текст элемента списка

        if(isChecked) {$(node).addClass("completed");}else leftCounter++;

        var html =
            "<div class='view'>" +
                "<input id='toggle_" + id + "' class='toggle' type='checkbox'" + checked + ">" +
                "<label id='label_" + id + "' >" + text + "</label>" +
                "<button id='destroy_" + id + "' class='destroy'></button>" +
            "</div>" +
            "<input id='edit_" + id + "' class='edit' value='" + text + "'>";

        node.innerHTML = html;
        $('.todo-list')[0].appendChild(node);
    });
    $(".todo-count strong").html(leftCounter); // длина списка
}

//кликаем по глобальному чек-боксу
function SetChecked(id, status)
{
    $.ajax({
        type: "POST",
        url: "backend/Controllers/TodoListsItem/SetOneCheck.php",
        data: {login: get_cookie("login"), password: get_cookie("password"), id: id, status: status}
    }).done(function (result)
    {
        ShowItems();
    });
}

function ClearComplited()
{
    $.ajax({
        type: "POST",
        url: "backend/Controllers/TodoListsItem/DeleteAllChecked.php",
        data: {login: get_cookie("login"), password: get_cookie("password")}
    }).done(function (result)
    {
        ShowItems();
    });
}

function DeleteOne(id)
{
    $.ajax({
        type: "POST",
        url: "backend/Controllers/TodoListsItem/Delete.php",
        data: {login: get_cookie("login"), password: get_cookie("password"), id: id}
    }).done(function (result)
    {
        ShowItems();
    });
}

function Update(id, text)
{
    $.ajax({
        type: "POST",
        url: "backend/Controllers/TodoListsItem/Update.php",
        data: {login: get_cookie("login"), password: get_cookie("password"), id: id, text: text}
    }).done(function (result)
    {
        SetErrorViewer(result);
        ShowItems();
    });
}

/*
<li [[class="completed" | ]]>
    <div class="view">
        <input class="toggle" type="checkbox" [[checked | ]]>
        <label>value</label>
        <button class="destroy"></button>
    </div>
    <input class="edit" value="[[value]]">
</li>
 */