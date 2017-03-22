--1\ initial sql
--2\ import DU about security \log \common\ui\

--3\ create cdpSYS user
--4\ active cdpSYS role

create user CDPSYS password Sap12345;
ALTER USER CDPSYS DISABLE PASSWORD LIFETIME;
call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.security.roles::sysAdmin','CDPSYS');

--5\ create cdpLOG user
--6\ active cdpLOG role

create user CDPLOG password Sap12345;
ALTER USER CDPLOG DISABLE PASSWORD LIFETIME;
call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.log.roles::logJob','CDPLOG');

--7\ create CDPDS user
--8\ active CDPDS role

create user CDPDS password Sap12345;
ALTER USER CDPDS DISABLE PASSWORD LIFETIME;
call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.ds.roles::Base','CDPDS');

--9\ create pcdwPI user
--10\ active pcdwPI role

create user PI_TO_PCDW password Sap12345;
ALTER USER PI_TO_PCDW DISABLE PASSWORD LIFETIME;
call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.pcdw.roles::Base','PI_TO_PCDW');


CALL "SECURITY"."cdp.security.procedures::createModule"(
		'EBGCFE','cdp.ebgcfe','CFE :Cost Forecast Estimation '
		,'EBGCFE_ADMIN','Sap12345','EBGCFE_ADMIN@lenovo.com'
		,?		);
		
CALL "SECURITY"."cdp.security.procedures::createModule"(
		'MXEBGVMI','cdp.mxebgvmi','VMI '
		,'MXEBGVMI_ADMIN','Sap12345','MXEBGVMI_ADMIN@lenovo.com'
		,?		);

CALL "SECURITY"."cdp.security.procedures::createModule"(
		'PCDW','cdp.pcdw','PCDW '
		,'PCDW_ADMIN','Sap12345','PCDW_ADMIN@lenovo.com'
		,?		);
