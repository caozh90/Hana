try{
	
	$.import("aporeporting.xsjs", "downloadLib");
	var download = $.aporeporting.xsjs.downloadLib;
		
//	$.response.setBody(download.prepareQuery());
//	
//	$.response.status = $.net.http.OK;
	
	var downloadExcel = function(){
	    var bodySet;
		try{
			var conn = $.db.getConnection();
			var pstmt = conn.prepareStatement(download.prepareQuery()); 
			var rs = pstmt.executeQuery();
			bodySet = download.getTableContent(rs);
		} catch (e) {
			return {
				"data" : e.message,
				"status" : $.net.http.INTERNAL_SERVER_ERROR
			};
		}
		return bodySet.map(function(body){
			return {
				"data" : body,
				"status" : $.net.http.OK
			};
		});
	};

	var sendResponse = function(content){
		var fileName = $.request.parameters.get("filename");
		if (fileName === undefined) {
			fileName = 'Content';
		}
		var zip = new $.util.Zip();
		var system = $.request.headers.get('User-Agent');
		if(content.length === 1){
			if(system.indexOf('Windows')>0){
				zip[fileName + '.csv'] = '\ufeff'+content[0].data;      //For Windows System
			}else{
				zip[fileName + '.csv'] = content[0].data;               //For non-Windows System
			}
		}else{
			content.forEach(function(cnt, index){
				var i = index + 1;
				if(system.indexOf('Windows')>0){
					zip[fileName + i + '.csv'] = '\ufeff'+ cnt.data;      //For Windows System
				}else{
					zip[fileName + i + '.csv'] = cnt.data;               //For non-Windows System
				}
			});
		}
		
		$.response.setBody(zip);
		$.response.contentType = 'application/zip';
		$.response.headers.set('Content-Disposition', 'attachment; filename='+ fileName + '.zip');
	};

	var handleReq = function(){
		if ($.request.method === $.net.http.GET) {
			sendResponse(downloadExcel());
		} else {
			$.response.contentType = "application/json; charset=UTF-8";
			$.response.status = $.net.http.FORBIDDEN;
		}
	};

	handleReq();
	
}catch(e){
	$.response.setBody(e.message);
	$.response.status=  $.net.http.INTERNAL_SERVER_ERROR;
}



