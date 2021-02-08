var user;
var server;
window.onload=()=>{
    user = JSON.parse(localStorage.getItem("user"));
    server= localStorage.getItem("server");
    view();
};

function view(classtype){
    document.querySelectorAll(".base").forEach((e)=>{
        if(classtype && e.classList.contains(classtype)){
            e.style.display="block";
        }else{
            e.style.display="none";
        }
    });
}

function showPendingUsers(){
    view("pending-users");
    var xhr = new XMLHttpRequest();
    xhr.open("POST",server+"/employee/pendingusers");
    xhr.setRequestHeader("content-type","application/json");
    xhr.onreadystatechange=sr;
    xhr.send();
    function sr(){
        if(xhr.readyState==4&&xhr.status==200){
            var rs = JSON.parse(xhr.responseText);
            buildPendingUserTable(rs);
        }
    }
}

function buildPendingUserTable(users){
    var usersTable = document.querySelector(".div-table.pending-users");
	while(usersTable.firstChild){
		usersTable.removeChild(usersTable.firstChild);
	}
	var userRow = document.querySelector(".sample.pending-user-row").cloneNode(true);
	userRow.classList.remove("sample");
	userRow.classList.remove(".pending-user-row")
	userRow.classList.add("header");
	usersTable.appendChild(userRow);
	for(indexA=0;indexA<users.length;indexA++){
		var accountInfo = users[indexA];
		userRow = addPendingUser(accountInfo);
		if(indexA%2===0){
			userRow.classList.add("user-row-one");
		}else{
			userRow.classList.add("user-row-two");
		}
        usersTable.appendChild(userRow);
    }
}

function addPendingUser(info){
    var newRow = document.querySelector(".sample.pending-user-row").cloneNode(true);
    newRow.classList.remove("sample");
    newRow.querySelector(".userid").innerText=info.userID;
    newRow.querySelector(".username").innerText=info.username;
    return newRow;		
}

function pendingUserChecked(el){
    var cl = el.classList;
    if(!cl.contains("header")){
        if(cl.contains("selected")){
            cl.remove("selected");
        } else{
            cl.add("selected");
        }
    }
}

function userApproval(decision){
    var users = [];
    document.querySelectorAll(".pending-user-row.selected").forEach((e)=>{
        users.push({
            userID:e.querySelector(".userid").innerText,
            approved:decision
        });
    });
    users = JSON.stringify(users);
    var xhr = new XMLHttpRequest();
    xhr.open("POST",server+"/user/decisions");
    xhr.onreadystatechange= update;
    xhr.setRequestHeader("content-type","application/json");
    xhr.send(users);

    function update(){
        if(xhr.readyState==4&&xhr.status==200){
            alert(xhr.responseText);
        }
    }
}

function showPendingAccounts(){
    view("pending-accounts");
    var xhr = new XMLHttpRequest();
    xhr.open("POST",server+"/employee/pendingaccounts");
    xhr.setRequestHeader("content-type","application/json");
    xhr.onreadystatechange=sr;
    xhr.send();

    function sr(){
        if(xhr.readyState==4&&xhr.status==200){
            var rs = JSON.parse(xhr.responseText);
            buildPendingTable(rs);
        }
    }
}

function buildPendingTable(accounts){
    var accountsTable = document.querySelector(".div-table.pending-accounts");
	while(accountsTable.firstChild){
		accountsTable.removeChild(accountsTable.firstChild);
	}
	var accountRow = document.querySelector(".sample.pending-account-row").cloneNode(true);
	accountRow.classList.remove("sample");
	accountRow.classList.remove(".pending-account-row")
	accountRow.classList.add("header");
	accountsTable.appendChild(accountRow);
	for(indexA=0;indexA<accounts.length;indexA++){
		var accountInfo = accounts[indexA];
		accountRow = addPendingAccount(accountInfo);
		if(indexA%2===0){
			accountRow.classList.add("account-row-one");
		}else{
			accountRow.classList.add("account-row-two");
		}
        accountsTable.appendChild(accountRow);
    }
}

function addPendingAccount(info){
    var newRow = document.querySelector(".sample.pending-account-row").cloneNode(true);
    newRow.classList.remove("sample");
    newRow.querySelector(".userid").innerText=info.ownerIDs;
    newRow.querySelector(".account").innerText=info.accountID;
    newRow.querySelector(".type").innerText=info.type;
    newRow.querySelector(".balance").innerText=info.balance.toLocaleString('us-US', { style: 'currency', currency: 'USD' });
    return newRow;		
}

function pendingAccountChecked(el){
    var cl = el.classList;
    if(!cl.contains("header")){
        if(cl.contains("selected")){
            cl.remove("selected");
        } else{
            cl.add("selected");
        }
    }
}

function accountApproval(decision){
    var accounts = [];
    document.querySelectorAll(".pending-account-row.selected").forEach((e)=>{
        var temp = {
            accountID:e.querySelector(".account").innerText,
            accepted:decision
        }
        accounts.push(temp);
    });
    console.log(accounts);
    var json = JSON.stringify(accounts);
    console.log(json);
    var xhr = new XMLHttpRequest();
    xhr.open("POST",server+"/account/decisions");
    xhr.onreadystatechange= update;
    xhr.setRequestHeader("content-type","application/json");
    xhr.send(json);

    function update(){
        if(xhr.readyState==4&&xhr.status==200){
            alert(xhr.responseText);
        }
    }
}

function viewAllTransactions(){
    var output = JSON.stringify(user);
    var xhr = new XMLHttpRequest();
    xhr.open("POST",server+"/transaction/all");
    xhr.setRequestHeader("content-type","application/json");
    xhr.onreadystatechange=sr;
    xhr.send(output);
    view("transactions");
    function sr(){
        if(xhr.readyState==4&&xhr.status==200){
            var rs = JSON.parse(xhr.responseText);
            buildTransactionTable(rs);
        }
    }
}

function buildTransactionTable(transactions){
    var tt = document.querySelector(".transactions.div-table");
    while(tt.firstChild){
        tt.removeChild(tt.firstChild);
    }
    var newRow = document.querySelector(".sample.transaction-row").cloneNode(true);
    newRow.classList.remove("sample");
    tt.appendChild(newRow);
    for(i=0;i<transactions.length;i++){
        var t = transactions[i];
        newRow = addTransaction(t); 
        if(i%2==0){
            newRow.classList.add("row-one");
        }else{
            newRow.classList.add("row-two");
        }
        tt.appendChild(newRow);		
    }
}

function addTransaction(info){
    var newRow = document.querySelector(".sample.transaction-row").cloneNode(true);
    newRow.classList.remove("sample");
    var d=`ID:${info.transactionID}, `;
    if(info.fromAccount=="0"){
        newRow.classList.add("transaction-deposit");
        d+=`Deposit into ${info.toAccount}`;	
    }else if(info.toAccount=="0"){
        newRow.classList.add("transaction-withdraw");
        d+=`Withdrawal from ${info.fromAccount}`;
    } else{
        newRow.classList.add("transaction-transfer");
        d+=`Transfer from ${info.fromAccount} to ${info.toAccount}, accepted:${typeof info.pending ==undefined?"undecided":info.pending}`;
    }
    var ndate = new Date(info.timestamp);
    newRow.querySelector(".timestamp").innerText=ndate.toLocaleDateString();
    newRow.querySelector(".description").innerText=d;
    newRow.querySelector(".amount").innerText=info.amount.toLocaleString('us-US', { style: 'currency', currency: 'USD' });
    newRow.querySelector(".previousbalance").innerText="undefined";
    return newRow;
}

function showUserAccounts(){
    view("user-accounts");
}

function getAccounts(){
    var output = JSON.stringify({userID:document.querySelector("[name=userid]").value});
    var xhr = new XMLHttpRequest();
    xhr.open("POST",server+"/employee/useraccounts");
    xhr.setRequestHeader("content-type","application/json");
    xhr.onreadystatechange=sr;
    xhr.send(output);
    view("user-accounts");
    function sr(){
        if(xhr.readyState==4&&xhr.status==200){
            console.log(xhr.responseText);
            var rs = JSON.parse(xhr.responseText);
            buildAccountTable(rs);
        }
    }
}

function buildAccountTable(accounts){
    var accountsTable = document.querySelector(".div-table.user-accounts");
	while(accountsTable.firstChild){
		accountsTable.removeChild(accountsTable.firstChild);
	}
	var accountRow = document.querySelector(".sample.account-row").cloneNode(true);
	accountRow.classList.remove("sample");
	accountRow.classList.remove(".account-row")
	accountRow.classList.add("account-header");
	accountsTable.appendChild(accountRow);
	for(indexA=0;indexA<accounts.length;indexA++){
		var accountInfo = accounts[indexA];
		accountRow = addAccount(accountInfo);
		if(indexA%2===0){
			accountRow.classList.add("account-row-one");
		}else{
			accountRow.classList.add("account-row-two");
		}
        accountsTable.appendChild(accountRow);
    }
}

function addAccount(info){
    var newRow = document.querySelector(".sample.account-row").cloneNode(true);
    newRow.classList.remove("sample");
    newRow.querySelector(".account").innerText=info.accountID;
    newRow.querySelector(".type").innerText=info.type;
    newRow.querySelector(".balance").innerText=info.balance.toLocaleString('us-US', { style: 'currency', currency: 'USD' });
    return newRow;		
}

function logout(){
    localStorage.removeItem("user");
    localStorage.removeItem("server");
    window.location.href="../pages/bank.html";
}