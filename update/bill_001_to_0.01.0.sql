alter table budgetrules add name VARCHAR(40);
alter table budgetrules add track tinyint(1) NOT NULL DEFAULT '1';

CREATE TABLE subjects
      (
        sid SMALLINT UNSIGNED NOT NULL auto_increment,
        sname VARCHAR(40),
        sfullname VARCHAR(255),
        inn smallint(10) NOT NULL COMMENT "EDRPOU or IIN",
        stype VARCHAR(7) NOT NULL DEFAULT "IE" COMMENT "enumeration  ENTITY / IE (FOP)/",
        regnum smallint(10) NOT NULL COMMENT "registry entry number" ,
        regdate DATE NOT NULL COMMENT "registry entry date",
        taxation VARCHAR(10) NOT NULL COMMENT "type of taxation: enumeration  common / simpl (simplified)",
        admin VARCHAR(255) NOT NULL,
        sgid SMALLINT NOT NULL COMMENT "sgroups",
        contacts text NOT NULL,
        currcid SMALLINT DEFAULT NULL COMMENT "cid - current contracts",
        descr VARCHAR(255),
        is_deleted tinyint(1) NOT NULL DEFAULT 0,
        CONSTRAINT pk_subjects PRIMARY KEY (sid)
      );

CREATE TABLE sublabels
      (
      	slid SMALLINT UNSIGNED NOT NULL auto_increment,
        slname VARCHAR(20),
      	descr VARCHAR(255),
        is_deleted tinyint(1) NOT NULL DEFAULT 0,
        CONSTRAINT pk_sublabels PRIMARY KEY (slid)
      );

CREATE TABLE slid_sid
        (
        ssid SMALLINT UNSIGNED NOT NULL auto_increment,
        slid SMALLINT(5),
        sid SMALLINT(5),
        def TINYINT,
        descr VARCHAR(255),
        CONSTRAINT pk_slid_sid PRIMARY KEY (ssid)
        );

CREATE TABLE subgroups
      (
      	sgid SMALLINT UNSIGNED NOT NULL auto_increment,
        sgname VARCHAR(40),
        descr VARCHAR(255),
        is_deleted tinyint(1) NOT NULL DEFAULT 0,
        CONSTRAINT pk_subgroups PRIMARY KEY (sgid)
      );


CREATE TABLE contracts
      (
      	cid SMALLINT UNSIGNED NOT NULL auto_increment,
        cdate DATE NOT NULL,
        enddate DATE NOT NULL,
        contractor SMALLINT DEFAULT NULL COMMENT "sid",
        customer SMALLINT DEFAULT NULL COMMENT "sid",
        budget SMALLINT DEFAULT NULL COMMENT "brid",
        cdata text COMMENT "parametrs for reportscripts (json)",
        descr VARCHAR(255),
        is_deleted tinyint(1) NOT NULL DEFAULT 0,
        CONSTRAINT pk_contracts PRIMARY KEY (cid)
      );


ALTER TABLE accounts ADD COLUMN sid SMALLINT DEFAULT NULL;
ALTER TABLE accounts ADD COLUMN iban VARCHAR(40) NOT NULL DEFAULT '';

INSERT into enumerations (enumname,name,value) VALUES ('typesubject','ENTITY','ENTITY');
INSERT into enumerations (enumname,name,value) VALUES ('typesubject','IE','IE');
INSERT into enumerations (enumname,name,value) VALUES ('taxation','common','common');
INSERT into enumerations (enumname,name,value) VALUES ('taxation','simpl','simpl');

INSERT into agog (main,field,relation,used) VALUES ('slid_sid','slid','sublabels','link'),
('slid_sid','sid','subjects','link');
INSERT into agog (main,field,relation) VALUES ('subjects','sgid','subgroups'),
('subjects','currcid','contracts'), ('contracts','contractor','subjects'),('contracts','customer','subjects'),
('contracts','budget','budgetrules');
INSERT into agog (main,field,enumeration) VALUES ('subjects','stype','typesubject'),('subjects','taxation','taxation');
INSERT into agog (main,field,showprimary) VALUES ('subjects','sname',1),('sublabels','slname',1),
('subgroups','sgname',1),('contracts','cdate',1);

UPDATE passport_db SET version = "0.01.0";
