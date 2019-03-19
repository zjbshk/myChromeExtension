
function save(tag) {
	const query = Bmob.Query('url');
	for (var v in tag) {
		query.set(v, tag[v]);
	}
	query.save().then(res => {
		if (res.objectId) {
			showTipError("("+tag.name+")上传成功啦");
		} else {
			showTipError("("+tag.name+")上传失败了");
		}
	}).catch(err => {
		showTipError("发生了异常!");
		console.log(err)
	});
}

function execFunction(func){
	chrome.tabs.query({
		active: true,
		currentWindow: true
	}, function(tabs) {
		if(func)func(tabs[0]);
	});
}


function getContent(tabId, script, callback) {
	chrome.tabs.sendMessage(tabId, {
		"script": script
	}, function(response) {
		if (callback) callback(response);
	});
}

function showTipError(tip){
	alert(tip);
}