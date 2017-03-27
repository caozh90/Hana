var invoke = $.import('cdp.mxebgvmi.service.invoke', 'invoke');

function validationBefore(param,oper_type){
	var after = param.afterTableName;
	var pStmt = param.connection.prepareStatement('select * from "' + after + '"');
    var rs = pStmt.executeQuery();
    var LOGICAL_PLANT,DELIVERY_PRIORITY;
    while (rs.next()) {
    	LOGICAL_PLANT = rs.getNString(1);
    	DELIVERY_PRIORITY = rs.getInteger(2);
    }
    
    pStmt = param.connection.prepareCall('call "cdp.mxebgvmi.procedures.pkg_ui.ui_nocut_so_priority::validationNocutSoPriority"(?,?,?,?)');
	pStmt.setNString(1,LOGICAL_PLANT);
	pStmt.setInteger(2,DELIVERY_PRIORITY);
	pStmt.setNString(3,oper_type);
    pStmt.execute();
	var error = pStmt.getNString(4);
	if(error !== ''){
		throw '$$'+error+'$$';
	}
}



function insert(param){
	var result=invoke.checkPrivilege('nocutsopriority::createable');
	if(result!== 'OK' ){
		throw result;
		
	}
	validationBefore(param,'insert');
	var after = param.afterTableName;
	var pStmt = param.connection.prepareStatement('select * from "' + after + '"');
    var rs = pStmt.executeQuery();
    var LOGICAL_PLANT,DELIVERY_PRIORITY;
    while (rs.next()) {
    	LOGICAL_PLANT = rs.getNString(1);
    	DELIVERY_PRIORITY = rs.getInteger(2);
    }
    pStmt = param.connection.prepareCall('call "cdp.mxebgvmi.procedures.pkg_ui.ui_nocut_so_priority::createNocutSoPriority"(?,?)');
    pStmt.setNString(1,LOGICAL_PLANT);
	pStmt.setInteger(2,DELIVERY_PRIORITY);
    pStmt.execute();
}

function remove(param){
	var result=invoke.checkPrivilege('nocutsopriority::deleteable');
	if(result!== 'OK' ){
		throw result;
		
	}
	var after = param.beforeTableName;
	var pStmt = param.connection.prepareStatement('select * from "' + after + '"');
    var rs = pStmt.executeQuery();
    var LOGICAL_PLANT,DELIVERY_PRIORITY;
    while (rs.next()) {
    	LOGICAL_PLANT = rs.getNString(1);
    	DELIVERY_PRIORITY = rs.getInteger(2);
    }
    pStmt = param.connection.prepareCall('call "cdp.mxebgvmi.procedures.pkg_ui.ui_nocut_so_priority::deleteNocutSoPriority"(?,?)');
    pStmt.setNString(1,LOGICAL_PLANT);
	pStmt.setInteger(2,DELIVERY_PRIORITY);
    pStmt.execute();
}
