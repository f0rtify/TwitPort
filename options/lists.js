(function(){

function setURL(){
	chrome.storage.sync.set({targetlist: document.querySelector('input').value},function(){
		document.body.innerHTML += "Url: " + document.querySelector('input').value + " has been saved. Now click on the add-on icon and \"NUKE INCOMING""
	});
}

function setAnonHashUser(){
	var hashAnonUser = ""
for(var i = 0; i < 10; i++)
{
  hashAnonUser += String.fromCharCode(Math.floor(Math.random() * 255))
}
	return hashAnonUser
}

chrome.storage.sync.get('anonuser', function (res) {
		if(!res.anonuser){
			var anonhash = setAnonHashUser()
			chrome.storage.sync.set({'anonuser': anonhash}, function(){
				res.anonuser = anonhash
			})
		}
		document.querySelector('#username').textContent = res.anonuser
})

 document.querySelector('button').onclick = setURL
chrome.storage.sync.get('targetlist',function(res){
		document.querySelector('input').value = res.targetlist
	});
})();
