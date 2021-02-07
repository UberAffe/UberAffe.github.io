/**
 * 
 */
var user;
window.onload = ()=>{
	user = JSON.parse(localStorage.getItem("user"));
	setupAccounts();
	setupForm();
	setupTransfers();
	showAccounts();
}

function selectTransfer(row){
	var cbox = row.querySelector(".transfer-selection");
	if(cbox.checked){
		cbox.checked=false;
		row.classList.remove("selected");
	}else{
		cbox.checked=true;
		row.classList.add("selected");
	}
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
    xhr.open("POST","http://66.41.241.124:8080/Banking/rest/transaction/send", true);
    xhr.setRequestHeader("content-type","application/json");
	xhr.send(output);

	function transactionComplete(){
		if(xhr.readyState==4&&xhr.status==200){
			if(JSON.parse(xhr.responseText)){
				xhr.onreadystatechange = updateUser;
				xhr.open("POST","http://66.41.241.124:8080/Banking/rest/customer/read", true);
				xhr.setRequestHeader("content-type","application/json");
				xhr.send(localStorage.getItem("user"));
			}
		}
	}

	function updateUser(){
		if(xhr.readyState==4&&xhr.status==200){
			localStorage.setItem("user",xhr.responseText);
			user = JSON.parse(xhr.responseText);
			console.log(user);
			setupAccounts();
			setupForm();
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
		toAccount:document.getElementsByName("to-account")[0].value,
		toUser:0,
		amount:document.getElementsByName("amount")[0].value,
		accepted:false
	}
}

function showAccounts(){
	var els =document.getElementsByClassName("accounts");
	for(i=0; i<els.length;i++){
		els[i].style.display="block";
	}
	els = document.getElementsByClassName("transfers");
	for(i=0; i<els.length;i++){
		els[i].style.display="none";
	}
}

function showTransfers(){
	var els = document.getElementsByClassName("accounts");
	for(i=0; i<els.length;i++){
		els[i].style.display="none";
	}
	els = document.getElementsByClassName("transfers");
	for(i=0; i<els.length;i++){
		els[i].style.display="block";
	}
}

function logout(){
	localStorage.removeItem("user");
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

function setupAccounts(){
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
	for(indexA=0;indexA<accounts.length;indexA++){
		var accountInfo = accounts[indexA];
		accountRow = addAccount(accountInfo);
		if(indexA%2===0){
			accountRow.classList.add("account-row-one");
		}else{
			accountRow.classList.add("account-row-two");
		}
		accountsTable.appendChild(accountRow);
		var historyTable = addHistory(accountInfo.accountID,user.transactions);
		accountRow.appendChild(historyTable);
	}
	function addAccount(info){
		var newRow = document.querySelector(".sample.account-row").cloneNode(true);
		newRow.classList.remove("sample");
		newRow.querySelector(".account").innerText=info.accountID;
		newRow.querySelector(".type").innerText=info.type;
		newRow.querySelector(".balance").innerText=info.balance.toLocaleString('us-US', { style: 'currency', currency: 'USD' });
		newRow.onclick=toggleHistory;
		return newRow;		
	}
	function addHistory(aid, transactions){
		var newTable = document.querySelector(".sample.history-table").cloneNode(true);
		newTable.classList.remove("sample");
		newTable.style.display="none";
		for(i=0;i<transactions.length;i++){
			var t = transactions[i];
			if(t.pending && (t.fromAccount==aid || t.toAccount==aid)){
				var newRow = document.querySelector(".sample.history-row").cloneNode(true);
				newRow.classList.remove("sample");
				var d="";
				if(t.fromAccount=="0"){
					newRow.classList.add("history-deposit");
					d=`Deposit into ${t.toAccount}`;	
				}else if(t.toAccount=="0"){
					newRow.classList.add("history-withdraw");
					d=`Withdrawal from ${t.fromAccount}`;
				} else{
					newRow.classList.add("history-transfer");
					d=`Transfer from ${t.fromAccount} to ${t.toAccount}`;
				}
				var ndate = new Date();
				ndate.setTime(t.timestamp*1);
				newRow.querySelector(".timestamp").innerText=`${ndate.getMonth()}/${ndate.getDay()}/${ndate.getUTCFullYear()}`;
				newRow.querySelector(".description").innerText=d;
				newRow.querySelector(".amount").innerText=t.amount.toLocaleString('us-US', { style: 'currency', currency: 'USD' });
				newRow.querySelector(".previousbalance").innerText="undefined";
				newTable.appendChild(newRow);
			}				
		}
		return newTable;
	}
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

function setupTransfers(){
	var tTable = document.querySelector(".transfers.div-table");
	while(tTable.firstChild){
		tTable.removeChild(tTable.firstChild);
	}
	var nRow = document.querySelector(".sample.transfer-header");
	nRow.classList.remove("sample");
	tTable.appendChild(nRow);
	var ids = getAccountIDs();
	for(i=0;i<user.transactions.length;i++){
		var t = user.transactions[i];
		if(!t.accepted&&t.fromAccount!=0&&t.toAccount!=0){
			nRow = document.querySelector(".sample.transfer-row").cloneNode(true);
			nRow.classList.remove("sample");
			var d="";
			if(t.toAccount in ids){
				d=`Transfer into ${t.toAccount} from user:${t.fromUser}`;
				nRow.classList.add("incoming");
			} else{
				d=`Transfer from ${t.fromAccount} to account ${t.toAccount}`;
				nRow.classList.add("outgoing");
			}
			var ndate = new Date();
			ndate.setTime(t.timestamp*1);
			nRow.querySelector(".inner").innerText=`${ndate.getMonth()}/${ndate.getDay()}/${ndate.getUTCFullYear()}`;
			nRow.querySelector(".transfer-selection").value=t.transactionID;
			nRow.querySelector(".transfer-selection").classList.add("sample");
			nRow.querySelector(".description").innerText=d;
			nRow.querySelector(".amount").innerText=t.amount.toLocaleString('us-US', { style: 'currency', currency: 'USD' });
			tTable.appendChild(nRow);
		}
	}
}

function getAccountIDs(){
	var list = [];
	for(i=0;i<user.accounts.length;i++){
		list.push(user.accounts[i].accountID);
	}
	return list;
}