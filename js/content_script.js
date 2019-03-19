chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log(request);
	
	if (request.script) {
		var responseText = eval(request.script);
		sendResponse(responseText);
	}else if(request.tpl){
		var tpl = request.tpl;
		var data = request.data;
		//预编译模板
		var templateFunc = Handlebars.compile(tpl);
		//匹配json内容
		var responsehtml = templateFunc(data);
		sendResponse(responsehtml);
	}
});

function getDecription() {
	return getMeta("meta[name='description']");
}

function getKeywords() {
	return getMeta("meta[name='keywords']");
}

function getMeta(selector) {
	var desc = $(selector)[0];
	if (desc) {
		return desc.content
	} else {
		return document.title;
	}
}

$(document).ready(function(){
	var link = window.location.href;
	console.log(link);
})