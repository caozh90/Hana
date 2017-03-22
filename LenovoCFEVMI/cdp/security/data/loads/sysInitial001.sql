--1\ initial sql

--可以创建 非 read-only procedure
ALTER SYSTEM ALTER CONFIGURATION ('indexserver.ini', 'SYSTEM') SET ('repository','sqlscript_mode') = 'UNSECURE'
WITH RECONFIGURE; 

--enable job scheduler
ALTER SYSTEM ALTER CONFIGURATION ('xsengine.ini', 'SYSTEM') SET ('scheduler', 'enabled') = 'true' WITH RECONFIGURE;

--WEB DISPATCHER SETTING 
ALTER SYSTEM ALTER CONFIGURATION('webdispatcher.ini','system') 

SET('profile','icm/HTTP/logging_0')='PREFIX=/, LOGFILE=$(DIR_INSTANCE)/trace/access_log-%y-%m-%d, MAXSIZEKB=10000, SWITCHTF=hour, LOGFORMAT=SAP' WITH RECONFIGURE;

--Enable the SAP HANA XS engine to run in embedded mode (in the index server). See SAP Note 1849775.
ALTER SYSTEM ALTER CONFIGURATION ('xsengine.ini', 'httpserver') SET ('embedded', 'enabled') = 'true' WITH RECONFIGURE;

--2\ import DU

