var json=JSON.parse(decodeURI($.request.body.asString()));

var PULL_TYPE = json.PULL_TYPE;
var body;
var query;
var conn = $.db.getConnection();

var pcall_privilege;

var privilegeExists;

//验证权限.三个MANUAL_PULL分别验证，根据PULL_TYPE区分
/**
 * manual pull:"MANUAL";
 * pull from supplier:"SHIPPING_GROUP";
 * manual packaging:"MANUAL_PACKAGING";
 */
if(PULL_TYPE === 'MANUAL')
{
	query ='call "SECURITY"."cdp.security.procedures::checkPrivilege" ('
		+'\'manualpull::deleteable\',?)';
	pcall_privilege = conn.prepareCall(query);
	pcall_privilege.execute();
	privilegeExists = pcall_privilege.getNString(1);
}
else if(PULL_TYPE === 'SHIPPING_GROUP')
{
	query ='call "SECURITY"."cdp.security.procedures::checkPrivilege" ('
		+'\'pullfromsupplier::deleteable\',?)';
	pcall_privilege = conn.prepareCall(query);
	pcall_privilege.execute();
	privilegeExists = pcall_privilege.getNString(1);
}
else if(PULL_TYPE === 'MANUAL_PACKAGING')
{
	query ='call "SECURITY"."cdp.security.procedures::checkPrivilege" ('
		+'\'manualpackaging::deleteable\',?)';
	pcall_privilege = conn.prepareCall(query);
	pcall_privilege.execute();
	privilegeExists = pcall_privilege.getNString(1);
}


if(privilegeExists === 'OK')
{
	try
	{
		query = 'call "SZEBGVMI"."cdp.szebgvmi.procedures.pkg_ui.ui_manual_pull::deleteAllDraft"(?)';
	/*	query = 'call "MXEBGVMI"."cdp.mxebgvmi.procedures.pkg_ui.ui_manual_pull::deleteAllDraft"('
			+'\''+ PULL_TYPE +'\''
			+ ')';
		*/

		var pcall = conn.prepareCall(query);
		pcall.setString(1,PULL_TYPE);
		pcall.execute();
		pcall.close();
		conn.commit();
		conn.close();
		body = 'All \'DRAFT\' records have been deleted!';
		$.response.status = $.net.http.OK;
	}

	catch(e)
	{
		body = e.message;
		$.response.status = $.net.http.BAD_REQUEST;
	}

	$.response.contentType = "application/json; charset=UTF-8";
	$.response.setBody(body);
}
else
{
	$.response.setBody("Insufficient privilege!");
	$.response.status = $.net.http.BAD_REQUEST;
}


