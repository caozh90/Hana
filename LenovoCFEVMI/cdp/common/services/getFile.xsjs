$.import("cdp.common.services", "downloadLib");
var xsLib = $.cdp.common.services.downloadLib;

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

function downloadExcelByFatherChildren(type) {
	var i = 0,j=0;
	var query = xsLib.getQuery();
	var childQuery;
	var seoBottomQuery = "";
	var q1 = query.substring(0,query.lastIndexOf('where'));
	var q2 = query.substring(query.lastIndexOf('where')+5);
	//added by Chris Gao 2015-10-30
	var childrenModelIn = $.request.parameters.get("childrenModelIn");
	var brandHeader = $.request.parameters.get("brandHeader") || "";
	var brandValue = $.request.parameters.get("brandValue") || "";
	var familyValue = $.request.parameters.get("familyValue") || "";
	var familyHeader = $.request.parameters.get("familyHeader") || "";
	var plantHeader = $.request.parameters.get("plantHeader") || "";
	var plantValue = $.request.parameters.get("plantValue") || "";
	var countryValue = $.request.parameters.get("countryValue") || "";
	var countryHeader = $.request.parameters.get("countryHeader") || "";
	var sbbValue = $.request.parameters.get("sbbValue") || "";
	var sbbHeader = $.request.parameters.get("sbbHeader") || "";
	var fcValue = $.request.parameters.get("fcValue") || "";
	var fcHeader = $.request.parameters.get("fcHeader") || "";
	
	if(childrenModelIn !== undefined && childrenModelIn !== null){
		childrenModelIn =  childrenModelIn.replace(/\s+/g,'').split('and');
		for(i = 0; i < childrenModelIn.length; i++){
			childrenModelIn[i] = 'placeholder.' + childrenModelIn[i];
		}
		childrenModelIn = '(' + childrenModelIn.join(',') + ')';
	}else{
		childrenModelIn = '';
	}
	
	var filter = $.request.parameters.get("filter");
	if(filter!==undefined&&filter!==null){
		if(filter.indexOf('eq') !== -1)
			{filter = filter.replace(/(\s+)eq(\s+)/g,'=');}
		if(filter.indexOf('ge') !== -1)
			{filter = filter.replace(/(\s+)ge(\s+)/g,'>=');}
		if(filter.indexOf('gt') !== -1)
			{filter = filter.replace(/(\s+)gt(\s+)/g,'>');}
		if(filter.indexOf('le') !== -1)
			{filter = filter.replace(/(\s+)le(\s+)/g,'<=');}
		if(filter.indexOf('lt') !== -1)
			{filter = filter.replace(/(\s+)lt(\s+)/g,'<');}
		if(filter.indexOf('ne') !== -1)
			{filter = filter.replace(/(\s+)ne(\s+)/g,'!=');}
		if(filter.indexOf('datetime') !== -1)
			{filter = filter.replace(/datetime/g,'');}
		if(filter.indexOf('substringof') !== -1)
			{filter = filter.replace(/substringof\('(.*?)',(.*?)\)/g," $2 like '%$1%' ");}
		if(filter.indexOf('startswith') !== -1)
			{filter = filter.replace(/startswith\((.*?),'(.*?)'\)/g," $1 like '$2%' ");}
		if(filter.indexOf('endswith') !== -1)
			{filter = filter.replace(/endswith\((.*?),'(.*?)'\)/g," $1 like '%$2' ");}
		filter = ' where ' + filter;
	}else{
		filter = '';
	}
	
	//to prepare add filter header for cto,seo,sbb
	var filterHeaderDownload = [], fatherHeaderContent = [];
	var headerResult="",headerValueResult="";
	filterHeaderDownload = filter.replace(' where ','').split(' and ');
	for(j=0;j<filterHeaderDownload.length;j++)
	{
		fatherHeaderContent = filterHeaderDownload[j].split('=');
		headerResult = headerResult + fatherHeaderContent[0] + ',';
		headerValueResult = headerValueResult + fatherHeaderContent[1].replace(/'/g,"") + ',';
	}
	if(plantHeader !== "")
	{
		headerResult = headerResult + plantHeader.replace(/'/g,"") + ',';
	}
	if(countryHeader !== "")
	{
		headerResult = headerResult + countryHeader.replace(/'/g,"") + ',';
	}
	if(brandHeader !== "")
	{
		headerResult = headerResult + brandHeader.replace(/'/g,"") + ',';
	}
	if(familyHeader !== "")
	{
		headerResult = headerResult + familyHeader.replace(/'/g,"") + ',';
	}
	if(sbbHeader !== "")
	{
		headerResult = headerResult + sbbHeader.replace(/'/g,"") + ',';
	}
	if(fcHeader !== "")
	{
		headerResult = headerResult + fcHeader.replace(/'/g,"") + ',';
	}
	headerResult = headerResult.substring(0,headerResult.length - 1);
	
	if(plantValue !== "")
	{
		headerValueResult = headerValueResult + plantValue.replace(/'/g,"") + ',';
	}
	if(countryValue !== "")
	{
		headerValueResult = headerValueResult + countryValue.replace(/'/g,"") + ',';
	}
	if(brandValue !== "")
	{
		headerValueResult = headerValueResult + brandValue.replace(/'/g,"") + ',';
	}
	if(familyValue !== "")
	{
		headerValueResult = headerValueResult + familyValue.replace(/'/g,"") + ',';
	}
	if(sbbValue !== "")
	{
		headerValueResult = headerValueResult + '"' + sbbValue.replace(/'/g,"") + '",';
	}
	if(fcValue !== "")
	{
		headerValueResult = headerValueResult + fcValue.replace(/'/g,"") + ',';
	}
	headerValueResult = headerValueResult.substring(0,headerValueResult.length - 1);
	//end by Chris Gao
	
	var qtemp;
	var father = '',children = '';
	var fatherArry = [],resultArry = [];
	var metaColumn = [];
	var rowContent = [];
	var index;
	var conn;
	var pstmt;
	var rs;
	//process cto fc, sbb dimension -- Chris Gao 2016-08-03
	var fatherQuery = '';
	var ctoBottomQuery = '';
	var ctoBottomAdder = '';
	if((type !== undefined && type === 'cto' && fcValue !== undefined && fcValue !== "") || (type !== undefined && type === 'cto' && sbbValue !== undefined && sbbValue !== ""))
	{
		fatherQuery = q1 + " where " ;
		
		if(type !== undefined && type === 'cto' && fcValue !== undefined && fcValue !== "")
		{
			fatherQuery = fatherQuery + " FC = " + fcValue + " and ";
		}
		if(type !== undefined && type === 'cto' && sbbValue !== undefined && sbbValue !== "")
		{
			//'0000000MJ104,0000000MJ167'
			fatherQuery = fatherQuery + " CHILDREN IN (" + sbbValue.replace(/,/g,"','") + ") and ";
		}
		fatherQuery = fatherQuery + q2;
		
	}
	else
	{
		fatherQuery = query;
	}
	try {
		conn = $.db.getConnection();
		pstmt = conn.prepareStatement(fatherQuery);
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
				//modified by Chris Gao 2015-10-29
				qtemp = q1.substring(0, q1.lastIndexOf('(placeholder'));
				if(type === 'sbb')
				{
					qtemp =  qtemp + childrenModelIn.substring(0, childrenModelIn.length - 1) +",placeholder.\"$$V_SBB$$\"=>'" + rowContent[index].replace(/"/g,'') + "')"; 
				}
				else
				{
					qtemp =  qtemp + childrenModelIn.substring(0, childrenModelIn.length - 1) +",placeholder.\"$$v_sbb$$\"=>'" + rowContent[index].replace(/"/g,'') + "')"; 
				}
				
				childQuery = qtemp + filter +" and " + q2;
//				childQuery = qtemp + filter +" and FATHER = '" + rowContent[index].replace(/"/g,'') + "' and " + q2;
				
			}else{
				childQuery = q1 + filter + " and FATHER = '" + rowContent[index].replace(/"/g,'') + "' " + q2;
			}
			childQuery = childQuery.replace(/(\S*) from "(\S*)"\."(\S*)" (\S*)/g,"$1 from \"$2\".\"$3_CHILDREN\" $4");
			//COSTBOM下的SEO和CTO页面的父视图命名规则更改
			//modified by Chris Gao 2015-10-29
			if(type === 'sbb')
			{
				childQuery = childQuery.replace("FATHER_LAST","CHILDREN");
			}
			else if(type === 'cto')
			{
				childQuery = childQuery.replace("COSTBOM_FATHER","COSTBOM_CHILDREN_LAST");
			}
			else
			{
				childQuery = childQuery.replace("COSTBOM_FATHER","COSTBOM_CHILDREN_LAST");
			}
			
			//childQuery = childQuery.replace("COSTBOM_FATHER_CHILDREN","COSTBOM_CHILDREN");

			
			pstmt = conn.prepareStatement(childQuery);
			rs = pstmt.executeQuery();
			children = xsLib.getTableContent(rs);
			resultArry.push(fatherArry[i]);
			resultArry = resultArry.concat(children.split('\n').slice(1));
			
			//process cto  adder download - bottom -- Chris Gao 2016-08-03
			if((type !== undefined && type === 'cto' && fcValue !== undefined && fcValue !== "") || (type !== undefined && type === 'cto' && sbbValue !== undefined && sbbValue !== ""))
			{
				ctoBottomQuery = "select * from (select to_varchar(COST_NAME) as COST_NAME,to_varchar(COST_LVL) as COST_LVL,'','','','','','','',to_varchar(M1) as M1,to_varchar(M2) as M2,to_varchar(M3) as M3,to_varchar(M4) as M4,to_varchar(M5) as M5,to_varchar(M6) as M6,to_varchar(M7) as M7,to_varchar(M8) as M8,to_varchar(M9) as M9,to_varchar(M10) as M10,to_varchar(M11) as M11,to_varchar(M12) as M12,to_varchar(M13) as M13,to_varchar(M14) as M14,to_varchar(M15) as M15,to_varchar(M16) as M16,to_varchar(M17) as M17,to_varchar(M18) as M18, ";
				ctoBottomQuery = ctoBottomQuery + "to_varchar(LM1) as LM1,to_varchar(LM2) as LM2,to_varchar(LM3) as LM3,to_varchar(LM4) as LM4,to_varchar(LM5) as LM5,to_varchar(LM6) as LM6,to_varchar(LM7) as LM7,to_varchar(LM8) as LM8,to_varchar(LM9) as LM9,to_varchar(LM10) as LM10,to_varchar(LM11) as LM11,to_varchar(LM12) as LM12,to_varchar(LM13) as LM13,to_varchar(LM14) as LM14,to_varchar(LM15) as LM15,to_varchar(LM16) as LM16,to_varchar(LM17) as LM17,to_varchar(LM18) as LM18";
				ctoBottomQuery = ctoBottomQuery + " from (select * from \"_SYS_BIC\".\"cdp.ebgcfe.models.ui_cto_costbom/CV_UI_CTO_COSTBOM_LIST_LAST\" "; 
				ctoBottomQuery = ctoBottomQuery + filter + " and PLANT = " + plantValue + " and COUNTRY = " + countryValue +  " and FATHER = '" + rowContent[index].replace(/"/g,'') + "' ";
				ctoBottomQuery = ctoBottomQuery + " order by COST_LVL, length(COST_NAME) asc  limit 500000 offset 0))";
				
				pstmt = conn.prepareStatement(ctoBottomQuery);
				rs = pstmt.executeQuery();
				ctoBottomAdder = xsLib.getTableContent(rs);
				resultArry = resultArry.concat(ctoBottomAdder.split('\n').slice(1));
			}
			
		}
		
		//to process seo cost bom bottom table data
		var bottomTable = '';
		if(type === 'seo')
		{
			seoBottomQuery = xsLib.getSeoBottomQuery();
			seoBottomQuery = seoBottomQuery.replace("COSTBOM_FATHER","COSTBOM_LIST");
			pstmt = conn.prepareStatement(seoBottomQuery);
			rs = pstmt.executeQuery();
			bottomTable = xsLib.getTableContent(rs);
			resultArry = resultArry.concat(bottomTable.split('\n').slice(1));
		}
		
	} catch (e) {
		return {
			"data" : e.message,
			"status" : $.net.http.INTERNAL_SERVER_ERROR
		};
	}
//	return seoBottomQuery;
	return {
		"data" : headerResult + '\n' + headerValueResult + '\n' + resultArry.join('\n'),
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
				if(type !== undefined && (type === 'cto'||type === 'seo'||type === 'sbb')){
//					$.response.setBody(downloadExcelByFatherChildren(type));
					setResponse(downloadExcelByFatherChildren(type));
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
