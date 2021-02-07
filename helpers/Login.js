/**
 * 
 */
function submit() {
    var type = document.getElementsByClassName("option");
    var xhr = new XMLHttpRequest();

    var callback;
    if (type.value = "login") {
        callback = login;
    } else {
        callback = register;
    }
    var un = document.getElementById("username").value;
    var ps = document.getElementById("password").value;
    let data = { username: un, password: ps };
    data = JSON.stringify(data);
    xhr.onreadystatechange = callback;
    xhr.open("POST","http://localhost:8080/Banking/rest/user/login", true);
    xhr.setRequestHeader("content-type","application/json");
    xhr.send(data);

    function login() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            localStorage.setItem("user",xhr.responseText);
            var user = JSON.parse(xhr.responseText);
            if(typeof user.accounts !== 'undefined') {
                window.location.href = "../pages/customer.html";
            }else if(typeof user.userID!== 'undefined'){
                window.location.href = "../pages/employee.html";
            }else{
                alert("The login credentials do not match any known user.\nDid you mean to register a new account?");
            }
        }
    }
    function register() {

    }
}