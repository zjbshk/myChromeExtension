Bmob.initialize("b693220fd79aa6692aea45eb7eb96c2f", "f6d61dad8f043f92bdf0cc6eec3ae9ff");
var bg = chrome.extension.getBackgroundPage();

$(document).ready(function() {
	$("#submitBtn").click(function(e) {
		var link = $("#link").val();
		if (!link || link.length === 0) {
			showTipError("链接不能为空");
			return;
		}
		const query = Bmob.Query("url");
		query.equalTo("link", "==", $("#link").val());
		query.find().then(res => {
			if (res.length == 0) {
				var eles = $("#form_url")[0].elements;
				var tag = {};
				for (var index in eles) {
					var ele = eles[index];
					if (typeof ele == 'object') {
						tag[ele.name] = ele.value;
					}
				}
				if(tag.class_.length ==0 || tag.tag.length == 0 || tag.name.trim().length == 0){
					showTipError("请完善信息再提交");
				}else{
					save(tag);
				}
			} else {
				var re = res[0];
				showTipError("网站信息已存在，("+re.name+")上传时间:" + re.createdAt);
			}
		});
	});

	execFunction(setUrl);

	setSelectTag(bg.data.tag);
});

function setUrl(tab) {
	$("#name").val(tab.title);
	$("#link").val(tab.url);

	// $("#remark").val();
	getContent(tab.id, "getDecription()", function(res) {
		$("#decription").val(res);
	})

	$("#ico_link").val(tab.favIconUrl);

	getContent(tab.id, "getKeywords()", function(res) {
		$("#keywords").val(res);
	})

	// $("#tags").val();
	// $("#state").val();
	// $("#notChange").val();
	// $("#reportCount").val();
	// $("#collectCount").val();
	// $("#fromEmail").val();
}

function getTagFromBmob(func) {
	const query = Bmob.Query("tag");
	query.find().then(res => {
		if (func) func(res);
	});
}

function setSelectTag(res) {
	var selectEle = $("#tag");
	selectEle.append($("<option></option>").text("请选择类别"));
	for (var i = 0; i < res.length; i++) {
		var item = res[i];
		var option = $("<option></option>").text(item.name).attr("value", item.objectId);
		selectEle.append(option);
	}
	
	selectEle.change(changeClass_);
}

function changeClass_(){
	var tag_objectId = $("#tag").val();
	var selectEle = $("#class_");
	selectEle.empty();
	var class_ = bg.data.class_;
	for (var i = 0; i < class_.length; i++) {
		var item = class_[i];
		if(tag_objectId == item.tag){
			var option = $("<option></option>").text(item.name).attr("value", item.objectId);
			selectEle.append(option);
		}
	}
}