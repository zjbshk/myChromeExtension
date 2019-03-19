Bmob.initialize("b693220fd79aa6692aea45eb7eb96c2f", "f6d61dad8f043f92bdf0cc6eec3ae9ff");
var bg = chrome.extension.getBackgroundPage();

$(document).ready(function() {
	if (!bg.data.tag_lists) {
		getTagAndClass_(dealTagAndClass);
	} else {
		$('#show_list_tags').html(bg.data.tag_lists);
		$(".class_item").click(onClassItemClick);
	}


	var inst = new mdui.Headroom("#fab_action", {
		"tolerance": 10,
		"unpinnedClass": "mdui-fab-hide",
		"pinnedClass": "mdui-fab-show"
	});

	$("#refresh").click(function(e) {
		getTagAndClass_(dealTagAndClass);
	});

	$("#createBookMark").click(function(e) {
		const urlQuery = Bmob.Query("url");
		urlQuery.select("name", "link")
		urlQuery.limit(500)
		urlQuery.find().then(res => {
			for (var i = 0; i < res.length; i++) {
				var re = res[i];
				searchAndCreate(re);
			}
		})
	})
});

function searchAndCreate(re){
	chrome.bookmarks.search({
		url: re.link
	}, function(urls) {
		if (urls.length == 0) {
			chrome.bookmarks.create({
				title: re.name,
				url: re.link
			}, function(result) {
				console.log(result);
			})
		}
	})
}

function onClassItemClick(e) {
	var objectId = this.dataset.id;
	bg.data.class_objectId = objectId;
	window.location.href = "url_list.html";
}

function dealTagAndClass(res, res1) {
	for (var i = 0; i < res.length; i++) {
		var re = res[i];
		re["class_"] = [];
		for (var j = 0; j < res1.length; j++) {
			var re1 = res1[j];
			if (re.objectId == re1.tag) {
				re["class_"].push(re1);
			}
		}
	}

	var tpl = $("#tag_list_item").html();

	chrome.tabs.query({
		active: true,
		currentWindow: true
	}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {
			"tpl": tpl,
			"data": res
		}, function(response) {
			bg.data.tag_lists = response;
			//输入模板
			$('#show_list_tags').html(response);
			$(".class_item").click(onClassItemClick);
		});
	});
}

function getTagAndClass_(func) {
	const tagQuery = Bmob.Query("tag");
	tagQuery.order("order");
	tagQuery.find().then(res => {
		const classQuery = Bmob.Query("class_");
		classQuery.order("order");
		classQuery.find().then(res1 => {
			bg.data.tag = res;
			bg.data.class_ = res1;
			if (func) func(res, res1);
		});
	});
}
