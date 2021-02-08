/**
 * 
 */
window.onload=()=>{
    localStorage.setItem("server","http://66.41.241.124:8080/Banking/rest")
    server=localStorage.getItem("server");
};
var server;
function submit() {
    var type = document.querySelector(".option");
    var xhr = new XMLHttpRequest();
    var url = "";
    var callback;
    if (type.value == "login") {
        callback = login;
        url =server+"/user/login"
    } else {
        callback = register;
        url = server+"/user/register"
    }
    var un = document.getElementById("username").value;
    var ps = document.getElementById("password").value;
    let data = { username: un, password: ps };
    data = JSON.stringify(data);
    xhr.onreadystatechange = callback;
    xhr.open("POST",url, true);
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
        if (xhr.readyState == 4 && xhr.status == 200) {
            var rs = JSON.parse(xhr.responseText);
            console.log(rs);
            if(rs) {
                alert("Your account has been created.");
            }else{
                alert("This account already exists");
            }
        }
    }
}

function swap(){
    var type = document.querySelector(".option");
    if(type.value=="login"){
        document.querySelector("button").innerText="Login"
    } else{
        document.querySelector("button").innerText="Register"
    }
}