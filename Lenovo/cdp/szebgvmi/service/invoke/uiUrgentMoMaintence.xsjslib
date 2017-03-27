var invoke = $.import('cdp.szebgvmi.service.invoke', 'invoke');


function validationBefore(param,oper_type){
	var after = param.afterTableName;
	var pStmt = param.connection.prepareStatement('select * from "' + after + '"');
    var rs = pStmt.executeQuery();
    var LOGICAL_PLANT,DS_LINE,MO_ID,BOM_NAME,QUANTITY,START_TIME,END_TIME,PLANNED_START_TIME;
	var PLANNED_END_TIME,STATUS;
    while (rs.next()) {
    	LOGICAL_PLANT = rs.getNString(1);
    	DS_LINE = rs.getNString(2);
    	MO_ID = rs.getNString(3);
    	BOM_NAME = rs.getNString(4);
    	QUANTITY = rs.getInteger(5);
    	START_TIME = rs.getTimestamp(6);
    	END_TIME = rs.getTimestamp(7);
    	PLANNED_START_TIME = rs.getTimestamp(8);
    	PLANNED_END_TIME = rs.getTimestamp(9);
    	STATUS = rs.getNString(10);
    }
    
    pStmt = param.connection.prepareCall('call "cdp.szebgvmi.procedures.pkg_ui.ui_urgent_mo_maintence::validationUrgentMoMaintence"(?,?,?,?,?,?,?,?,?,?,?,?)');
	pStmt.setNString(1,LOGICAL_PLANT);
	pStmt.setNString(2,DS_LINE);
	pStmt.setNString(3,MO_ID);
	pStmt.setNString(4,BOM_NAME);
	pStmt.setInteger(5,QUANTITY);
	pStmt.setTimestamp(6,START_TIME);
	pStmt.setTimestamp(7,END_TIME);
	pStmt.setTimestamp(8,PLANNED_START_TIME);
	pStmt.setTimestamp(9,PLANNED_END_TIME);
	if(STATUS === null){
		pStmt.setNull(10,null);
	}else{
		pStmt.setNString(10,STATUS);
	}
	pStmt.setNString(11,oper_type);
    pStmt.execute();
	var error = pStmt.getNString(12);
	if(error !== ''){
		throw error;
	}
}



function insert(param){
	var result=invoke.checkPrivilege('urgentmomaintaince::createable');
	if(result!== 'OK' ){
		throw result;
		
	}
	validationBefore(param,'insert');
	var after = param.afterTableName;
	var pStmt = param.connection.prepareStatement('select * from "' + after + '"');
    var rs = pStmt.executeQuery();
    var LOGICAL_PLANT,DS_LINE,MO_ID,BOM_NAME,QUANTITY,START_TIME,END_TIME,PLANNED_START_TIME;
	var PLANNED_END_TIME,STATUS;
    while (rs.next()) {
    	LOGICAL_PLANT = rs.getNString(1);
    	DS_LINE = rs.getNString(2);
    	MO_ID = rs.getNString(3);
    	BOM_NAME = rs.getNString(4);
    	QUANTITY = rs.getInteger(5);
    	START_TIME = rs.getTimestamp(6);
    	END_TIME = rs.getTimestamp(7);
    	PLANNED_START_TIME = rs.getTimestamp(8);
    	PLANNED_END_TIME = rs.getTimestamp(9);
    	STATUS = rs.getNString(10);
    }
    pStmt = param.connection.prepareCall('call "cdp.szebgvmi.procedures.pkg_ui.ui_urgent_mo_maintence::createUrgentMoMaintence"(?,?,?,?,?,?,?,?,?,?)');
    pStmt.setNString(1,LOGICAL_PLANT);
	pStmt.setNString(2,DS_LINE);
	pStmt.setNString(3,MO_ID);
	pStmt.setNString(4,BOM_NAME);
	pStmt.setInteger(5,QUANTITY);
	pStmt.setTimestamp(6,START_TIME);
	pStmt.setTimestamp(7,END_TIME);
	pStmt.setTimestamp(8,PLANNED_START_TIME);
	pStmt.setTimestamp(9,PLANNED_END_TIME);
	pStmt.setNString(10,STATUS);
    pStmt.execute();
}

function update(param){
	var result=invoke.checkPrivilege('urgentmomaintaince::editable');
	if(result!== 'OK' ){
		throw result;
		
	}
	validationBefore(param,'update');
	var after = param.afterTableName;
	var pStmt = param.connection.prepareStatement('select * from "' + after + '"');
    var rs = pStmt.executeQuery();
    var LOGICAL_PLANT,DS_LINE,MO_ID,BOM_NAME,QUANTITY,START_TIME,END_TIME,PLANNED_START_TIME;
	var PLANNED_END_TIME;
    while (rs.next()) {
    	LOGICAL_PLANT = rs.getNString(1);
    	DS_LINE = rs.getNString(2);
    	MO_ID = rs.getNString(3);
    	BOM_NAME = rs.getNString(4);
    	QUANTITY = rs.getInteger(5);
    	START_TIME = rs.getTimestamp(6);
    	END_TIME = rs.getTimestamp(7);
    	PLANNED_START_TIME = rs.getTimestamp(8);
    	PLANNED_END_TIME = rs.getTimestamp(9);
    	//STATUS = rs.getNString(11);
    }
    pStmt = param.connection.prepareCall('call "cdp.szebgvmi.procedures.pkg_ui.ui_urgent_mo_maintence::updateUrgentMoMaintence"(?,?,?,?,?,?,?,?,?)');
    pStmt.setNString(1,LOGICAL_PLANT);
	pStmt.setNString(2,DS_LINE);
	pStmt.setNString(3,MO_ID);
	pStmt.setNString(4,BOM_NAME);
	pStmt.setInteger(5,QUANTITY);
	pStmt.setTimestamp(6,START_TIME);
	pStmt.setTimestamp(7,END_TIME);
	pStmt.setTimestamp(8,PLANNED_START_TIME);
	pStmt.setTimestamp(9,PLANNED_END_TIME);
	//pStmt.setNString(10,STATUS);
    pStmt.execute();
}

function remove(param){
	var result=invoke.checkPrivilege('urgentmomaintaince::deleteable');
	if(result!== 'OK' ){
		throw result;
		
	}
	var after = param.beforeTableName;
	var pStmt = param.connection.prepareStatement('select * from "' + after + '"');
    var rs = pStmt.executeQuery();
    var MO_ID;
    while (rs.next()) {
    	MO_ID = rs.getNString(3);    	
    }
    pStmt = param.connection.prepareCall('call "cdp.szebgvmi.procedures.pkg_ui.ui_urgent_mo_maintence::deleteUrgentMoMaintence"(?)');
	pStmt.setNString(1,MO_ID);
    pStmt.execute();
}
