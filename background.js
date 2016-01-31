chrome.runtime.onMessage.addListener(function (message, sender, senderResponse) {


    if (message.number) {
        chrome.browserAction.setBadgeText({ text: "" + (parseInt(message.number) + 1) })
    
    } else if (message.a_number) {
        chrome.browserAction.getBadgeText({}, function(res){
						chrome.browserAction.setBadgeText({ text : "" + (parseInt(res) + 1)})
					})
    } else if(message.unavailable) {
         var opt = {
            type: "basic",
            title: "TwitPort",
            message: "TwitPort is currently having issues connecting to the servers. Please try again in 10 seconds.",
            iconUrl: "unnamed.png"
        };
        try {
            chrome.notifications.create(opt).show()
            senderResponse()
        } catch (e) {

        }
    }else {
        var opt = {
            type: "basic",
            title: "TwitPort",
            message: "Done reporting the users on the list!",
            iconUrl: "unnamed.png"
        }
        try {
            chrome.notifications.create(opt).show()
        } catch (e) {

        }
    }

})

var Notification = (function () {
    var notification = null;

    return {
        display: function (opt) {
            notification = chrome.notifications.create(opt);
            notification.show();
        },
        hide: function () {
            notification.close();
        }
    };
})();


chrome.browserAction.onClicked.addListener(function (tab) {
    window.alert("Do not close this new tab. You may swap to other tabs though.")
    var action_url = "http://twitter.com/?start=true&tool=on";
    chrome.tabs.create({ url: action_url })
    chrome.storage.sync.get('targetlist', function (res) {
        if(res.targetlist){
            chrome.tabs.create({ url: res.targetlist })
        }
    })
});


