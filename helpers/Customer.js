/**
 * 
 */
var user;
var server;
window.onload = ()=>{
	user = JSON.parse(localStorage.getItem("user"));
	server = localStorage.getItem("server");
	buildAccountTable();
	setupForm();
	buildTransferTable();
	showAccounts();
}

window.setInterval(updateUser, 30000);

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
	view("pending");
	updateUser();
}

function submitAccount(){
	var output = document.querySelector("select[name=type]").value;
	output = {
		ownerIDs:[user.userID],
		type:output,
		balance:document.querySelector("[name=balance]").value
	};
	
	output = JSON.stringify(output);
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = applyComplete;
    xhr.open("POST",server+"/customer/apply", true);
    xhr.setRequestHeader("content-type","application/json");
	xhr.send(output);

	function applyComplete(){
		if(xhr.readyState==4&&xhr.status==200){
			updateUser();
		}
	}
}

function selectTransfer(row){
	var cbox = row.querySelector(".transfer-selection");
	var incoming = row.classList.contains("incoming")
	if(cbox.checked){
		cbox.checked=false;
		row.classList.remove("selected");
	}else{
		cbox.checked=true;
		row.classList.add("selected");
		var sels = document.querySelectorAll(".selected");
		sels.forEach((el)=>{
			if(el.classList.contains("incoming")!=incoming){
				el.classList.remove("selected");
				el.querySelector(".transfer-selection").checked=false;
			}
		});
	}
	document.querySelectorAll(".transfer-button").forEach((el)=>{
		if(el.classList.contains("into")!=incoming){
			el.style.display="none";
		}else{
			el.style.display="";
		}
	});
}

function doTransaction(){
	var output ="";
	switch(document.getElementsByName("transaction-type")[0].value){
		case "deposit": output = deposit();
			break;
		case "withdraw": output = withdraw();
			break;
		case "transfer": output = transfer();
			break;	
		default:
	}
	output = JSON.stringify(output);
	console.log(output);
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = transactionComplete;
    xhr.open("POST",server+"/transaction/send", true);
    xhr.setRequestHeader("content-type","application/json");
	xhr.send(output);

	function transactionComplete(){
		if(xhr.readyState==4&&xhr.status==200){
			updateUser();
		}
	}
}

function updateUser(){
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = refreshUser;
	xhr.open("POST",server+"/customer/read", true);
	xhr.setRequestHeader("content-type","application/json");
	xhr.send(localStorage.getItem("user"));

	function refreshUser(){
		console.log(xhr.readyState);
		if(xhr.readyState==4&&xhr.status==200){
			user = JSON.parse(xhr.responseText);
			console.log(user);
			buildAccountTable();
			setupForm();
			buildPendingTable();
			buildTransferTable();
		}
	}
}

function decision(decision){
	var output = [];
	document.querySelectorAll(".selected").forEach((s)=>{
		var temp = {
			transactionID:s.querySelector(".transfer-selection").value,
			toUser:user.userID,
			pending:decision
		};
		output.push(temp);
	});
	output = JSON.stringify(output);
	console.log(output);
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = transactionComplete;
    xhr.open("POST",server+"/transaction/decisions", true);
    xhr.setRequestHeader("content-type","application/json");
	xhr.send(output);
	function transactionComplete(){
		if(xhr.readyState==4&&xhr.status==200){
			updateUser();
		}
	}
}

function deposit(){
	return {
		fromAccount:0,
		fromUser:0,
		toAccount:document.getElementsByName("to-account")[0].value,
		toUser:user.userID,
		amount:document.getElementsByName("amount")[0].value
	}
}

function withdraw(){
	return {
		fromAccount:document.getElementsByName("from-account")[0].value,
		fromUser:user.userID,
		toAccount:0,
		toUser:0,
		amount:document.getElementsByName("amount")[0].value
	}
}

function transfer(){
	return {
		fromAccount:document.getElementsByName("from-account")[0].value,
		fromUser:user.userID,
		toAccount:document.getElementsByName("transfer-to")[0].value,
		toUser:0,
		amount:document.getElementsByName("amount")[0].value,
		pending:false
	}
}

function showAccounts(){
	view("accounts");
}

function showTransfers(){
	view("transfers");
}

function logout(){
	localStorage.removeItem("user");
	localStorage.removeItem("server");
	window.location.href="../pages/bank.html";
}

function switchTransaction(){
	var type = document.querySelector("select[name=transaction-type]").value;
	var els = document.querySelector(".form.accounts").children;
	for(i=0; i<els.length; i++){
		if(els[i].classList.contains(type)){
			els[i].style.display="block";
		}else{
			els[i].style.display="none";
		}
	}
	document.querySelector("button[name=doTransaction]").innerText=type;
}

function toggleHistory(event){
	var history =event.target.parentNode.lastChild;
	if(history.style.display ==="none"){
		history.style.display = "block";
	} else{
		history.style.display = "none";
	}
}

function buildAccountTable(){
	var accounts = user.accounts;
	var accountsTable = document.querySelector(".div-table.accounts");
	while(accountsTable.firstChild){
		accountsTable.removeChild(accountsTable.firstChild);
	}
	var accountRow = document.querySelector(".sample.account-row").cloneNode(true);
	accountRow.classList.remove("sample");
	accountRow.classList.remove(".account-row")
	accountRow.classList.add("account-header");
	accountsTable.appendChild(accountRow);
	var rowIndex = 0;
	for(indexA=0;indexA<accounts.length;indexA++){
		var accountInfo = accounts[indexA];
		if(accountInfo.accepted){
			accountRow = addAccount(accountInfo);
			if(rowIndex%2===0){
				accountRow.classList.add("account-row-one");
			}else{
				accountRow.classList.add("account-row-two");
			}
			accountsTable.appendChild(accountRow);
			rowIndex++;
		}
	}
}

function addAccount(info){
	var newRow = document.querySelector(".sample.account-row").cloneNode(true);
	newRow.classList.remove("sample");
	newRow.querySelector(".account").innerText=info.accountID;
	newRow.querySelector(".type").innerText=info.type;
	newRow.querySelector(".balance").innerText=info.balance.toLocaleString('us-US', { style: 'currency', currency: 'USD' });
	newRow.onclick=toggleHistory;
	var historyTable = buildHistoryTable(info.accountID);
	newRow.appendChild(historyTable);
	return newRow;		
}

function buildHistoryTable(aid){
	var newTable = document.querySelector(".sample.history-table").cloneNode(true);
	newTable.classList.remove("sample");
	newTable.style.display="none";
	for(i=0;i<user.transactions.length;i++){
		var t = user.transactions[i];
		if(t.pending && (t.fromAccount==aid || t.toAccount==aid)){
			var newRow = addHistory(t);
			newTable.appendChild(newRow);
		}				
	}
	return newTable;
}

function addHistory(info){
	var newRow = document.querySelector(".sample.history-row").cloneNode(true);
	newRow.classList.remove("sample");
	var d="";
	if(info.fromAccount=="0"){
		newRow.classList.add("history-deposit");
		d=`Deposit into ${info.toAccount}`;	
	}else if(info.toAccount=="0"){
		newRow.classList.add("history-withdraw");
		d=`Withdrawal from ${info.fromAccount}`;
	} else{
		newRow.classList.add("history-transfer");
		d=`Transfer from ${info.fromAccount} to ${info.toAccount}`;
	}
	var ndate = new Date();
	ndate.setTime(info.timestamp*1);
	newRow.querySelector(".timestamp").innerText=`${ndate.getMonth()}/${ndate.getDay()}/${ndate.getUTCFullYear()}`;
	newRow.querySelector(".description").innerText=d;
	newRow.querySelector(".amount").innerText=info.amount.toLocaleString('us-US', { style: 'currency', currency: 'USD' });
	newRow.querySelector(".previousbalance").innerText="undefined";
	return newRow
}

function buildPendingTable(){
	var pendingTable = document.querySelector(".div-table.pending");
	while(pendingTable.firstChild){
		pendingTable.removeChild(pendingTable.firstChild);
	}
	var pendingRow = document.querySelector(".sample.pending-row").cloneNode(true);
	pendingRow.classList.remove("sample");
	pendingRow.classList.remove(".pending-row")
	pendingRow.classList.add("pending-header");
	pendingTable.appendChild(pendingRow);
	var rowIndex = 0;
	for(indexA=0;indexA<user.accounts.length;indexA++){
		var info = user.accounts[indexA];
		if(!info.accepted){
			pendingRow = addPendingAccount(info);
			if(rowIndex%2===0){
				pendingRow.classList.add("account-row-one");
			}else{
				pendingRow.classList.add("account-row-two");
			}
			pendingTable.appendChild(pendingRow);
			rowIndex++;
		}
    }
}

function addPendingAccount(info){
	var newRow = document.querySelector(".sample.pending-row").cloneNode(true);
    newRow.classList.remove("sample");
    newRow.querySelector(".account").innerText=info.accountID;
    newRow.querySelector(".type").innerText=info.type;
    newRow.querySelector(".balance").innerText=info.balance.toLocaleString('us-US', { style: 'currency', currency: 'USD' });
    return newRow;	
}

function setupForm(){
	var fromA = document.querySelector("select[name=from-account]");
	var toA = document.querySelector("select[name=to-account]");
	while(fromA.firstChild!=fromA.lastChild){
		fromA.removeChild(fromA.lastChild);
	}
	while(toA.firstChild!=toA.lastChild){
		toA.removeChild(toA.lastChild);
	}
	for(index in user.accounts){
		var option = document.createElement("option");
		option.value=user.accounts[index].accountID;
		option.innerText=user.accounts[index].type+" "+user.accounts[index].accountID;
		fromA.appendChild(option);
		toA.appendChild(option.cloneNode(true));
	}
	switchTransaction();
}

function buildTransferTable(){
	var tTable = document.querySelector(".transfers.div-table");
	while(tTable.firstChild){
		tTable.removeChild(tTable.firstChild);
	}
	var nRow = document.querySelector(".sample.transfer-header").cloneNode(true);
	console.log(nRow);
	nRow.classList.remove("sample");
	tTable.appendChild(nRow);
	var ids = getAccountIDs(true);
	for(i=0;i<user.transactions.length;i++){
		var t = user.transactions[i];
		if(!t.accepted&&t.fromAccount!=0&&t.toAccount!=0){
			nRow = addTransfer(t, ids);
			tTable.appendChild(nRow);
		}
	}
}

function addTransfer(info, ids){
	nRow = document.querySelector(".sample.transfer-row").cloneNode(true);
	nRow.classList.remove("sample");
	var d="";
	if((ids.includes(info.toAccount))){
		d=`Transfer into ${info.toAccount} from user:${info.fromUser}`;
		nRow.classList.add("incoming");
	} else{
		d=`Transfer from ${info.fromAccount} to account ${info.toAccount}`;
		nRow.classList.add("outgoing");
	}
	var ndate = new Date();
	ndate.setTime(info.timestamp*1);
	nRow.querySelector(".inner").innerText=`${ndate.getMonth()}/${ndate.getDay()}/${ndate.getUTCFullYear()}`;
	nRow.querySelector(".transfer-selection").value=info.transactionID;
	nRow.querySelector(".transfer-selection").classList.add("sample");
	nRow.querySelector(".description").innerText=d;
	nRow.querySelector(".amount").innerText=info.amount.toLocaleString('us-US', { style: 'currency', currency: 'USD' });
	return nRow;
}

function getAccountIDs(accepted){
	var list = [];
	for(i=0;i<user.accounts.length;i++){
		console.log(accepted+":"+user.accounts[i].accepted)
		if(accepted==null || user.accounts[i].accepted==accepted){
			list.push(user.accounts[i].accountID);
		}	
	}
	return list;
}