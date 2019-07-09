let STATE = { items: [], filter: ''    };
let lsState = localStorage.getItem('lcState') ? JSON.parse(localStorage.getItem('lcState')):null;
if(lsState){ STATE=lsState; }
function saveToLocalStorage(){
    localStorage.setItem('lcState',JSON.stringify(STATE));
}
function checkAllBtn(items) {
    if(!items.length){
        return;
    }
    for (i = 0; i < items.length; i++) {
        if (items[i].status==='active') {
            $('#checkAll').prop('checked', false);
            saveToLocalStorage();
            return;
        }
    }
    $('#checkAll').prop('checked', true);
    saveToLocalStorage();
    
}
function checkBtnClk(item) {
    item.status=item.status==='completed'?'active':'completed';
    render(); saveToLocalStorage();
}
function closeBtnClk(index) {
    STATE.items.splice(index,1);
    render(); saveToLocalStorage();
}
function checkStatus(item,checkBtn,myNote) {
    if(item.status==='completed') {
        $(myNote).addClass('checked');
        $(checkBtn).prop('checked', true);
    }
    else if(item.status==='active'){
        $(myNote).removeClass('checked');
        $(checkBtn).prop('checked', false);
    }
}
function editOption(item,myInput) {
    item.editOption=true;
    let originalText=item.text;
    $(myInput).val(originalText);
    $(myInput).focus();
    $(myInput).keypress(function(event) {  
        let keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13') {
            let valueOf=event.target.value;
            if(valueOf!="") { 
                const letterNumber = /^[0-9a-zA-Z]+$/;
                if(valueOf.match(letterNumber)) {
                    item.text=valueOf;
                    render();
                    saveToLocalStorage();
                }
            }
            else {
                item.text=originalText;
            }    render();
        }  
    });
    $(myInput).keydown(function(e) { 
        if(e.which == 27){
            item.text=originalText;
            $(myInput).hide();
            render();
        }

    });
}
function createNote(item,index) {
    let timer = 0;
    const delay = 200;
    let prevent = false;
    let checkBtn=$('<input type="checkbox" class="checkBox"/><label for="checkBox"></label>');
    checkBtn.click(function() { checkBtnClk(item); });
    let textField=$('<span title='+item.text+'>'+item.text+'<span>');
    let closeBtn=$('<span id="cross"><strong>X</strong></span>');
    closeBtn.click(function() { closeBtnClk(index); });
    let myInput=$('<input type="text" id="editOp">');
    let myNote=$('<li></li>');
    $(myNote).append(checkBtn);
    $(myNote).append(textField);
    $(myNote).append(myInput);
    $(myNote).append(closeBtn);
    $(myInput).hide();
      $(myNote)
        .on("click", function() {
          timer = setTimeout(function() {
            if (!prevent) {
                checkBtnClk(item);
            }
            prevent = false;
          }, delay);
        })
        .on("dblclick", function() {
          clearTimeout(timer);
          prevent = true;
          $(textField).hide();
          $(myInput).show();
          editOption(item,myInput); 
        });
    checkStatus(item,checkBtn,myNote);
    return myNote;
}
function render(){
    $('#myList').html("");
    let i,filteredItems;
    if (!STATE.items.length){ $("button").hide(); $("#noOfItems").hide(); }
    else { $("button").show(); $("#noOfItems").show(); }
    if(!STATE.filter) { filteredItems=STATE.items; }
    else {
            filteredItems= STATE.items.filter(function(j) {
            return j.status===STATE.filter;
        });
    }
    checkAllBtn(filteredItems);
    for (i = 0; i < filteredItems.length; i++) {
        let item=filteredItems[i];
        let myNote=createNote(item,i);
        $("#myList").append(myNote);
    }
    $("#noOfItems").text(i+" item(s)");
}
function addNote(valueOf) {
    STATE.items.push({text:valueOf, addOption:false ,status:'active'});
    //STATE.filter=""; 
    render(); 
    $('#checkAll').prop('checked',false);
    saveToLocalStorage();
}
function callAll() {
    STATE.filter="";
    $("#all").addClass("selected"); $("#active").removeClass("selected"); $("#completed").removeClass("selected");
    render(); saveToLocalStorage();
}
function callAct() {
    STATE.filter='active';
    $("#active").addClass("selected"); $("#all").removeClass("selected"); $("#completed").removeClass("selected");
    render(); saveToLocalStorage();
}
function callCom() {
    STATE.filter='completed';
    $("#completed").addClass("selected"); $("#active").removeClass("selected"); $("#all").removeClass("selected");
    render(); saveToLocalStorage();
}
function checkFunc(count) {
    let i;
    if (count%2==1){
        for (i = 0; i < STATE.items.length; i++) {
            STATE.items[i].status='completed';
        }
    }
    else {
        for (i = 0; i < STATE.items.length; i++) {
            STATE.items[i].status='active';
        }  
    }
    STATE.filter='';
    render(); saveToLocalStorage();
}
function enterFunc(event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13') {
        let valueOf=event.target.value;
        if(valueOf!="") { 
            const letterNumber = /^[0-9a-zA-Z]+$/;
            if(valueOf.match(letterNumber)) {
                valueOf=valueOf;
                addNote(valueOf);
            }
        }
        $("#root").val("");
    }
}
function escFunc(e) {
    if(e.which == 27){ $("#root").val(""); }
}
function addBody() {
    let heading=$('<h1>todos</h1><br>');
    $('body').append(heading);
    let subHeading=$('<span></span>');
    let textHolder=$('<input type="text" id="root" placeholder="What needs to be done?" autofocus sytle="position: absolute"><br>');
    let mainCheckbox =$('<input id="checkAll" class="checkBox" type="checkbox">');
    $(subHeading).append(mainCheckbox);
    $(subHeading).append(textHolder);
    $('body').append(subHeading);
    let myList=$('<ul id="myList"></ul>');
    $('body').append(myList);
    let button1=$('<br><br><p id="noOfItems" style="cursor:initial"></p>');
    let button2=$('<button id="all"class="selected"onclick="callAll()">ALL</button>');
    let button3=$('<button id="active"onclick="callAct()">ACTIVE</button>');
    let button4=$('<button id="completed"onclick="callCom()">COMPLETED</button>');
    $('body').append(button1,button2,button3,button4);
}
function proceed() {
    let count=0;
    addBody();
    $("#root").keypress(function(event) {  enterFunc(event); });
    $("#root").keydown(function(e) { escFunc(e); });
    $("#checkAll").click(function() {
        count++;
        checkFunc(count);
    });
    render();
}
$(document).ready(function (){
    proceed();
});
