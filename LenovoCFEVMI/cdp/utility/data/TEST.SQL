--select 'DELETE FROM "'||TABLE_NAME||'";' from tables
--w-here SCHEMA_NAME = 'SECURITY'
--AND IS_COLUMN_TABLE  = 'TRUE';


--'DELETE FROM "'||TABLE_NAME||'";'
DELETE FROM "cdp.security.data::userManagement.DATA_SESSION_CONTEXT";
DELETE FROM "cdp.security.data::userManagement.INFO_GROUP";
DELETE FROM "cdp.security.data::userManagement.INFO_MODULE";
DELETE FROM "cdp.security.data::userManagement.INFO_RESOURCE_TYPE";
DELETE FROM "cdp.security.data::userManagement.INFO_ROLEGROUP";
DELETE FROM "cdp.security.data::userManagement.INFO_ROLES";
DELETE FROM "cdp.security.data::userManagement.INFO_USER";
DELETE FROM "cdp.security.data::userManagement.MAP_ALL";
DELETE FROM "cdp.security.data::userManagement.MAP_GROUP_USER";
DELETE FROM "cdp.security.data::userManagement.MAP_MODULE_USER";
DELETE FROM "cdp.security.data::userManagement.MAP_RESOURCE_USER";
DELETE FROM "cdp.security.data::userManagement.MAP_ROLEGROUP_ROLE";
DELETE FROM "cdp.security.data::userManagement.MAP_VIEW_ROLE";


CALL		"SECURITY"."cdp.security.procedures::clearSYSRoleGroup"();

CALL "SECURITY"."cdp.security.procedures::createModule"(
		'EBGCFE','cdp.ebgcfe','CFE :Cost Forecast Estimation '
		,'SAP_TEST001','Password12345','SAP_TEST001@lenovo.com'
		,?		);
	
CALL "SECURITY"."cdp.security.procedures::createModule"(
		'MXEBGVMI','cdp.mxebgvmi','VMI '
		,'SAP_TEST101','Password12345','SAP_TEST101@lenovo.com'
		,?		);

