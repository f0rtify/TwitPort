


function f(val) {
	var reportIframe = document.getElementById("new-report-flow-frame");
	var iframeHTML = reportIframe.contentDocument;
	if(iframeHTML.querySelector("input[type='radio'][value='" + val + "']") === null)
	{
		setTimeout(function(){ f(val)}, 500)
	} else {
		f2(iframeHTML, val)
	}
	
	
}

function f2(iframeHTML, val) {
	iframeHTML.querySelector("input[type='radio'][value='" + val + "']").click()
	document.querySelector('.new-report-flow-next-button').click()
}
function report(callback) {
	
	document.querySelector('.user-dropdown').click()
	document.querySelector('li.report-text button[type="button"]').click()


	setTimeout(function () { 
		f('abuse') 
		setTimeout(function () { f('harassment') 
			setTimeout(function () { f('Someone_else')
				setTimeout(function () { f('violence') 
					callback()
				 }, 1000)
			 }, 1000)
		}, 1000)
	}, 2000)
	
	
	
}



function $_GET(){
	var queryDict = {}
location.search.substr(1).split("&").forEach(function(item) {queryDict[item.split("=")[0]] = item.split("=")[1]})
return queryDict
}

var els = document.querySelectorAll('img')
for (var i=0; i < els.length; i++) {
    els[i].setAttribute("src", "")
}


chrome.storage.sync.get('targetlist', function(res){
	chrome.storage.sync.get('anonuser', function(res1){
		if(!res1.anonuser)
		{
			var anonhash = setAnonHashUser()
			chrome.storage.sync.set({'anonuser': anonhash}, function(){
				res1.anonuser = anonhash
			})
		}
	
	if(res.targetlist){
		chrome.storage.sync.get('targetshtml', function (res) {
	var targets = res.targetshtml.split("\n")
		getP = $_GET()
		if(getP['start'] || parseInt(getP['number']) < targets.length){
		target_url = targets[parseInt(getP['number'])]
		if (targets.length !== 0 && ("https://twitter.com/" + target_url + '?number='+ getP['number'] +'&tool=on'  )=== window.location.href) {
			if(document.querySelector('html').innerHTML.indexOf('Sorry, that page doesn’t exist!') === -1){
			window.onload = function() {report(function () {
					chrome.storage.sync.set({'number': getP['number']}, function(){
						chrome.runtime.sendMessage({'number': getP['number']})
					window.location.assign("https://twitter.com/" + targets[parseInt(getP['number']) + 1] + '?number=' + (parseInt(getP['number']) + 1) + '&tool=on')
				
					})
			})
			}
			} else {
				chrome.storage.sync.set({'number': getP['number']}, function(){
						chrome.runtime.sendMessage({'number': getP['number']})
					window.location.assign("https://twitter.com/" + targets[parseInt(getP['number']) + 1] + '?number=' + (parseInt(getP['number']) + 1) + '&tool=on')
				
					})
			}
		} else if (targets.length !== 0) {
			if(getP['start'] === 'true'){
			window.location.assign("https://twitter.com/" + targets[0] + '?number=0&tool=on')
			} else {
			chrome.runtime.sendMessage({showNotification: "true"}, function(res){
				window.close()
			})
			}
				
		}
		
		} else {
			chrome.runtime.sendMessage({showNotification: "true"}, function(res){
				window.close()
			})
		}

})

} else {
	if($_GET()['start']) {
		chrome.runtime.sendMessage({'number': "0"})
		getTarget(res1.anonuser, function(target){
					window.location.assign("https://twitter.com/" + target + '?number=-1&tool=on')
				})
	}
	else if(document.querySelector('html').innerHTML.indexOf('Sorry, that page doesn’t exist!') === -1){
			window.onload = function() {report(function () {
					
					
					chrome.runtime.sendMessage({'a_number': "true"})
					getTarget(res1.anonuser, function(target){
					window.location.assign("https://twitter.com/" + target + '?number=-1&tool=on')
				})
					})
			}
			} else if(document.querySelector('html').innerHTML.indexOf('Sorry, that page doesn’t exist!') !== -1) {
				document.querySelector('.body-content h1').innerHTML = "Please wait, will report that this account does not exist anymore and will redirect to another target..."
				chrome.storage.sync.get('lasttarget', function(res){
				updateTarget(res.lasttarget, function(){
				getTarget(res1.anonuser, function(target){
					window.location.assign("https://twitter.com/" + target + '?number=-1&tool=on')
				})
				})
				})
			} else {
				getTarget(res1.anonuser, function(target){
					window.location.assign("https://twitter.com/" + target + '?number=-1&tool=on')
				})
			}
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