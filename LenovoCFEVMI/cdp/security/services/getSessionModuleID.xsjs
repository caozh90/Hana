
var output = {};
/*
var json=JSON.parse(decodeURI($.request.body.asString()));

var MODULE_ID = json.MODULE_ID;
var firstName = json.firstName;
var lastName = json.lastName;
var emailAddress = json.emailAddress;
var status = json.status;

call "SECURITY"."cdp.security.procedures::setSessionModuleUser" ( '1000000000',
		 200758 ,
		?)
*/		

var conn = $.db.getConnection();

var query = 'SELECT SESSION_CONTEXT(\'MODULE_ID\') "MODULE_ID" FROM DUMMY';
//var conn = $.db.getConnection();
//var 
var pcall = conn.prepareStatement(query);
pcall.execute();
var rs = pcall.getResultSet();
rs.next();
output = rs.getNString(1);

pcall.close();

conn.commit();
conn.close();
//rs.close();

$.response.contentType = "application/json; charset=UTF-8";
$.response.setBody(JSON.stringify(output));
$.response.status = $.net.http.OK;

