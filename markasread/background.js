chrome.runtime.onInstalled.addListener(function () {
	// console.log("onInstalled");
	chrome.storage.sync.get("visited", function (obj) {
		if (obj["visited"] == undefined) {
			// console.log("obj undefined");
			visited = {};
		} else {
			// console.log("obj defined");
			visited = obj["visited"];
		}
	});
})

chrome.runtime.onStartup.addListener(function () {
	// console.log("onStartup");
	visited = {};
	chrome.storage.sync.get("visited", function (obj) {
		if (obj["visited"] == undefined) {
			visited = {};
		} else { 			
			visited = obj["visited"];
		}
	});
});

// chrome.browserAction.onClicked.addListener(function(tab) { 
// 	console.log("onClicked");
// 	chrome.tabs.getSelected(null, function(tab){
// 		if (visited[tab.url] == false || visited[tab.url] == undefined) {
// 			markAsVisited();
// 			visited[tab.url] = true;
			
// 		} else {
// 			markAsNotVisited();
// 			visited[tab.url] = false;
// 		}
// 	});
// });

chrome.browserAction.onClicked.addListener(function(tabs) { 
	chrome.tabs.query({'active': true, 'currentWindow': true}, function (tab) {
		// console.log(tab[0].url);
		if (visited[tab[0].url] == undefined || visited[tab[0].url] == false) {
			visited[tab[0].url] = true;
			markAsVisited(tab[0].id);
		} else { 
			visited[tab[0].url] = false;
			markAsNotVisited(tab[0].id);
		}
	});
})

/** 
* Upon switching to a new tab and on it being activated, we check if this is the tab's
* first time being loaded, and if so we mark it as not visited
*/
chrome.tabs.onActivated.addListener(function callback(activeInfo) {
	// console.log("onActivated");
	chrome.tabs.query({'active': true, 'currentWindow': true}, function (tab) {
		console.log(tab[0].url);
		if (visited[tab[0].url] == undefined || visited[tab[0].url] == false) {
			markAsNotVisited(tab[0].id);
		} else { 
			markAsVisited(tab[0].id);
		}
	});
});

chrome.tabs.onUpdated.addListener(function callback(activeInfo) {
	// console.log("onActivated");
	chrome.tabs.getSelected(null, function(tab){
		if (visited[tab.url] == undefined || visited[tab.url] == false) {
			markAsNotVisited();
		} else { 
			markAsVisited();
		}
	});
});


function updateRemoteDictionary() {	
	chrome.storage.sync.set({"visited": visited}, function() {
		if (chrome.runtime.error) {
			console.log("Runtime error.");
		}
	});
}

function markAsNotVisited(atabId) {
	// console.log("markAsNotVisited");
	chrome.browserAction.setIcon({path: "notvisited.png", tabId: atabId});
	updateRemoteDictionary();
}

function markAsVisited(atabId) {
	// console.log("markAsVisited");
	chrome.browserAction.setIcon({path: "visited.png", tabId: atabId });
	updateRemoteDictionary();
}

// chrome.storage.onChanged.addListener(function(changes, namespace) {
// 	for (key in changes) {
// 		var storageChange = changes[key];
// 		console.log('Storage key "%s" in namespace "%s" changed. ' +
// 			'Old value was "%s", new value is "%s".',
// 			key,
// 			namespace,
// 			storageChange.oldValue,
// 			storageChange.newValue);
// 	}
// });
