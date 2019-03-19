Bmob.initialize("b693220fd79aa6692aea45eb7eb96c2f", "f6d61dad8f043f92bdf0cc6eec3ae9ff");
var bg = chrome.extension.getBackgroundPage();

const urlQuery = Bmob.Query("url");
urlQuery.equalTo("class_","==",bg.data.class_objectId);
urlQuery.find().then(res => {
	
	var tpl = $("#tag_list_item").html();
	
	chrome.tabs.query({
		active: true,
		currentWindow: true
	}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {
			"tpl": tpl,
			"data": res
		}, function(response) {
			//输入模板
			$('#show_list_class_').html(response);
			$(".url_item").click(onUrlItemClick);
		});
	});
});

function onUrlItemClick(e){
	var url = this.dataset.url;
	chrome.tabs.create({"url":url,active:false},function(e){
		console.log(e);
	})
}