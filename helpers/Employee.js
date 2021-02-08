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
            setupPending(rs);
        }
    }
}

function setupPending(accounts){
    console.log(accounts);
}

function showPendingUsers(){
    view("pending-users");
}

function showUserAccounts(){
    view("user-accounts");
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
            setupTransactions(rs);
        }
    }
}

function setupAccounts(){
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

function setupTransactions(transactions){
    var tt = document.querySelector(".transactions.div-table");
    while(tt.firstChild){
        tt.removeChild(tt.firstChild);
    }
    var newRow = document.querySelector(".sample.transaction-row").cloneNode(true);
    newRow.classList.remove("sample");
    tt.appendChild(newRow);
    for(i=0;i<transactions.length;i++){
        var t = transactions[i];
         newRow = document.querySelector(".sample.transaction-row").cloneNode(true);
        newRow.classList.remove("sample");
        if(i%2==0){
            newRow.classList.add("row-one");
        }else{
            newRow.classList.add("row-two");
        }
        var d=`ID:${t.transactionID}, `;
        if(t.fromAccount=="0"){
            newRow.classList.add("transaction-deposit");
            d+=`Deposit into ${t.toAccount}`;	
        }else if(t.toAccount=="0"){
            newRow.classList.add("transaction-withdraw");
            d+=`Withdrawal from ${t.fromAccount}`;
        } else{
            newRow.classList.add("transaction-transfer");
            d+=`Transfer from ${t.fromAccount} to ${t.toAccount}, accepted:${typeof t.pending ==undefined?"undecided":t.pending}`;
        }
        var ndate = new Date(t.timestamp);
        newRow.querySelector(".timestamp").innerText=ndate.toLocaleDateString();
        newRow.querySelector(".description").innerText=d;
        newRow.querySelector(".amount").innerText=t.amount.toLocaleString('us-US', { style: 'currency', currency: 'USD' });
        newRow.querySelector(".previousbalance").innerText="undefined";
        tt.appendChild(newRow);		
    }
}

function logout(){
    localStorage.removeItem("user");
    localStorage.removeItem("server");
    window.location.href="../pages/bank.html";
}