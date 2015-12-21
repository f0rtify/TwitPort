document.querySelector('.error-page h1').innerHTML = "Pleae wait, will report that this account is susupended and then will redirect to another target..."
chrome.storage.sync.get('targetlist', function (res0) {
	chrome.storage.sync.get('anonuser', function (res) {
		if(!res.anonuser){
			var anonhash = setAnonHashUser()
			chrome.storage.sync.set({'anonuser': anonhash}, function(){
				res.anonuser = anonhash
			})
		}
		if (res0.targetlist) {

			chrome.storage.sync.get('number', function (res1) {
				chrome.storage.sync.get('targetshtml', function (res2) {
					targets = res2.targetshtml.split("\n");
					chrome.storage.sync.set({ 'number': parseInt(res1.number) + 1 }, function () {

						window.location.assign("https://twitter.com/" + targets[parseInt(res1.number) + 2] + "?number=" + (parseInt(res1.number) + 2) + "&tool=on")

					})
				})
			})

		} else {
			getTarget(res.anonuser, function(response){
				chrome.storage.sync.get('lasttarget', function(res2){
						
					updateTarget(res2.lasttarget, function () {
						
						chrome.storage.sync.set({'lasttarget': response}, function(){
							
						window.location.assign("https://twitter.com/" + response + "?number=-1&tool=on")
						})
					})
					})
			})
		}
	})
})


function getTarget(user, callback){
	var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status >= 200 && xhttp.status < 400) {
      callback(xhttp.responseText);
    } else if( xhttp.readyState == 4 ) { 
		 chrome.runtime.sendMessage({'unavailable': 'true'}, function(){
			setTimeout(function(){getTarget(user, callback)}, 10000)	
		})
	}
  };
  xhttp.onerror = function(){
	  chrome.runtime.sendMessage({'unavailable': 'true'}, function(){
			setTimeout(function(){getTarget(user, callback)}, 10000)	
		})
  }
  xhttp.open("GET", "https://optools.anonops.com/twGetTarget.php?o=opparis&u=" + user, true);
  xhttp.send();
}

function updateTarget(target,callback){
        var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status >= 200 && xhttp.status < 400) {
		chrome.storage.sync.set({'lasttarget': xhttp.responseText}, function(){
      callback(xhttp.responseText)
	  })
    } else if ( xhttp.readyState == 4 ){
		 chrome.runtime.sendMessage({'unavailable': 'true'}, function(){
			setTimeout(function(){updateTarget(user, callback)}, 10000)	
		})
	}
  };
  
  xhttp.onerror = function(){
	   chrome.runtime.sendMessage({'unavailable': 'true'}, function(){
			setTimeout(function(){updateTarget(user, callback)}, 10000)	
		})
  }
  xhttp.open("GET", "https://optools.anonops.com/twUpdateTarget.php?o=opparis&t="+target, true);
  xhttp.send();
}

function setAnonHashUser(){
	var hashAnonUser = ""
for(var i = 0; i < 10; i++)
{
  hashAnonUser += String.fromCharCode(Math.floor(Math.random() * 255))
}
	return hashAnonUser
}