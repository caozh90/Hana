$.import("cdp.common.services", "downloadLibWithTableInputParas");
var xsLib = $.cdp.common.services.downloadLibWithTableInputParas;

function downloadExcel() {
	var query = xsLib.getQuery();
	var body = '';
	try {
		var conn = $.db.getConnection();
		var pstmt = conn.prepareStatement(query);
		var rs = pstmt.executeQuery();
//		var conn = $.hdb.getConnection();
//		var rs = conn.executeQuery(query);
		body = xsLib.getTableContent(rs);
	} catch (e) {
		return {
			"data" : e.message,
			"status" : $.net.http.INTERNAL_SERVER_ERROR
		};
	}
	return {
		"data" : body,
		"status" : $.net.http.OK
	};
}

function downloadExcelByFatherChildren() {
	var i = 0;
	var query = xsLib.getQuery();
	var childQuery;
	var q1 = query.substring(0,query.lastIndexOf('where'));
	var q2 = query.substring(query.lastIndexOf('where')+5);
	var father = '',children = '';
	var fatherArry = [],resultArry = [];
	var metaColumn = [];
	var rowContent = [];
	var index;
	var conn;
	var pstmt;
	var rs;
	try {
		conn = $.db.getConnection();
		pstmt = conn.prepareStatement(query);
		rs = pstmt.executeQuery();
		father = xsLib.getTableContent(rs);
		fatherArry = father.split('\n');
		metaColumn = fatherArry[0].split(',');
//		resultArry.push(xsLib.getFileHeader(metaColumn));
		resultArry.push(fatherArry[0]);
		for(i = 0; i < metaColumn.length; i++){
			if(metaColumn[i] === 'CHILDREN'){
				index = i;
			}
		}
		for(i = 1; i < fatherArry.length; i++){
			rowContent = fatherArry[i].split(',');
			if(query.indexOf('where') > 0){
				childQuery = q1 + " where FATHER = '" + rowContent[index].replace(/"/g,'') + "' and " + q2;
			}else{
				childQuery = q1 + " where FATHER = '" + rowContent[index].replace(/"/g,'') + "' " + q2;
			}
			childQuery = childQuery.replace(/(\S*) from "(\S*)"\."(\S*)" (\S*)/g,"$1 from \"$2\".\"$3_CHILDREN\" $4");
			//COSTBOM下的SEO和CTO页面的父视图命名规则更改
			childQuery = childQuery.replace("COSTBOM_FATHER_CHILDREN","COSTBOM_CHILDREN");
			
			pstmt = conn.prepareStatement(childQuery);
			rs = pstmt.executeQuery();
			children = xsLib.getTableContent(rs);
			resultArry.push(fatherArry[i]);
			resultArry = resultArry.concat(children.split('\n').slice(1));
		}
	} catch (e) {
		return {
			"data" : e.message,
			"status" : $.net.http.INTERNAL_SERVER_ERROR
		};
	}
	return {
		"data" : resultArry.join('\n'),
		"status" : $.net.http.OK
	};
}

function setResponse(info) {
	var fileName = $.request.parameters.get("filename");
	if (fileName === undefined) {
		fileName = 'Content';
	}
	var zip = new $.util.Zip();
	//zip[fileName + '.csv'] = info.data;
	var system = $.request.headers.get('User-Agent');
	if(system.indexOf('Windows')>0){
		zip[fileName + '.csv'] = '\ufeff'+info.data;      //For Windows System
	}else{
		zip[fileName + '.csv'] = info.data;               //For non-Windows System
	}
	$.response.setBody(zip);
	$.response.contentType = 'application/zip';
	$.response.headers.set('Content-Disposition', 'attachment; filename='
			+ fileName + '.zip');
}

function assertAppRole(role){
	var v_role = role.substring(role.indexOf('roles.')+6);
	if(role.indexOf('roles.') < 0){
		v_role = role;
	}
	var query = 'call "SECURITY"."cdp.security.procedures::checkPrivilege"(?,?)';
	var conn = $.db.getConnection();
	var stmt = conn.prepareCall(query);
	stmt.setNString(1,v_role);
	stmt.execute();
	var result = stmt.getNString(2);
	return result;
}

function handle() {
	var rolename = $.request.parameters.get("rolename");
	var type = $.request.parameters.get("downloadType");
	if (rolename !== undefined && rolename !== '') {
//		rolename = rolename.substring(rolename.lastIndexOf('.') + 1, rolename
//				.lastIndexOf('::'));
//		rolename = 'cdp.common.services::' + rolename + '_export';
//		if (!$.session.hasAppPrivilege(rolename)) {
		
		if (assertAppRole(rolename) !== 'OK'){
			$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
			$.response.setBody('Not Authorized, no export privilege');
		} else {
			if ($.request.method === $.net.http.GET) {
				if(type !== undefined && (type === 'cto'||type === 'seo')){
					setResponse(downloadExcelByFatherChildren());
				}else{
					setResponse(downloadExcel());
				}
			} else {
				$.response.contentType = "application/json; charset=UTF-8";
				$.response.status = $.net.http.FORBIDDEN;
			}
		}
	} else {
		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody('parameter rolename must be provided');
	}
}

handle();
