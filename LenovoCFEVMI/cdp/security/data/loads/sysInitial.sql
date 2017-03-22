--install procedure

--1\ initial sql
--2\ import DU about security \log \common\ui\
--3\ create cdpSYS user
--4\ active cdpSYS role
--5\ create log user \DS user 
--6\ active logSYS role \DS role 
--7\   web config about httpDestination by cdpSYS
  --   web config about logJOB logon by logSys

--8\import DU base on module(pcdw)  ,initial :schema \ Role etc
--9\ PI user \PI role
--10\ initial SQL create table
--11\ import DU ,initial :procedures; 

--8\import DU base on module(ebgcfe\mxebgvmi\xxxx)  ,initial :schema \ Role etc
--9\ active moduleInitialRole for cdpSYS ,and log on by cdpSYS
--10\ create Module base on security procedure createModule
	--a create Module
	--b create moduleAdmin /add exist user to new module
	--c initial SQL create table
	--d initial role information
	--e initial view role map
--11\ import DU about procedure \services\ui etc
--12\ deactive moduleInitialRole from cdpSYS
