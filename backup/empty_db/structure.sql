-- MySQL dump 10.13  Distrib 5.5.62, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: buh
-- ------------------------------------------------------
-- Server version	5.5.62-0ubuntu0.14.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `accounts` (
  `aid` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `aname` varchar(40) DEFAULT NULL,
  `curr` char(3) DEFAULT NULL,
  `side` tinyint(4) DEFAULT '0',
  `apdate` datetime DEFAULT NULL,
  `apbal` decimal(10,3) DEFAULT '0.000',
  `descr` varchar(255) DEFAULT NULL,
  `usebal` tinyint(4) DEFAULT '1',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`aid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `actpoints`
--

DROP TABLE IF EXISTS `actpoints`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `actpoints` (
  `apid` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `aname` varchar(40) DEFAULT NULL,
  `apdate` datetime DEFAULT NULL,
  `descr` varchar(255) DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`apid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `agog`
--

DROP TABLE IF EXISTS `agog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `agog` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `main` varchar(20) DEFAULT NULL,
  `field` varchar(20) DEFAULT NULL,
  `relation` varchar(20) NOT NULL,
  `used` varchar(20) NOT NULL,
  `enumeration` varchar(40) NOT NULL,
  `showprimary` smallint(1) NOT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `budgetrules`
--

DROP TABLE IF EXISTS `budgetrules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `budgetrules` (
  `brid` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `brdate` datetime NOT NULL,
  `script` text,
  `rsid` smallint(5) unsigned NOT NULL,
  `rparam` text,
  `source` smallint(5) unsigned DEFAULT NULL,
  `dest` smallint(5) unsigned DEFAULT NULL,
  `sum` decimal(10,3) NOT NULL DEFAULT '0.000',
  `type` tinyint(1) NOT NULL DEFAULT '0',
  `priority` tinyint(2) NOT NULL DEFAULT '0',
  `uid` smallint(6) NOT NULL,
  `gid` smallint(6) NOT NULL,
  `schedule` varchar(255) DEFAULT NULL,
  `enddate` datetime NOT NULL,
  `rpid` smallint(5) unsigned NOT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`brid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cassapoints`
--

DROP TABLE IF EXISTS `cassapoints`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cassapoints` (
  `cpid` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `uid` smallint(6) NOT NULL,
  `curr` char(3) DEFAULT NULL,
  `apbal` decimal(10,3) DEFAULT '0.000',
  PRIMARY KEY (`cpid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `enumerations`
--

DROP TABLE IF EXISTS `enumerations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `enumerations` (
  `enid` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `enumname` varchar(40) DEFAULT NULL,
  `name` varchar(40) DEFAULT NULL,
  `value` varchar(40) DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`enid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `events` (
  `eid` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `edate` datetime NOT NULL,
  `relclass` varchar(100) DEFAULT NULL,
  `relid` smallint(6) NOT NULL,
  `priority` tinyint(2) NOT NULL DEFAULT '0',
  `done` tinyint(1) NOT NULL DEFAULT '0',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`eid`),
  KEY `edate_range` (`edate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `groups`
--

DROP TABLE IF EXISTS `groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `groups` (
  `gid` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `gname` varchar(20) DEFAULT NULL,
  `descr` varchar(255) DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`gid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `labels`
--

DROP TABLE IF EXISTS `labels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `labels` (
  `lid` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `lname` varchar(20) DEFAULT NULL,
  `descr` varchar(255) DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`lid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `lid_aid`
--

DROP TABLE IF EXISTS `lid_aid`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lid_aid` (
  `laid` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `lid` smallint(5) DEFAULT NULL,
  `aid` smallint(5) DEFAULT NULL,
  `def` tinyint(4) DEFAULT NULL,
  `descr` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`laid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `messages` (
  `mid` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `mdate` datetime NOT NULL,
  `msource` varchar(40) NOT NULL,
  `mdest` varchar(40) NOT NULL,
  `type` varchar(40) NOT NULL,
  `mess` text NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`mid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `passport_db`
--

DROP TABLE IF EXISTS `passport_db`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `passport_db` (
  `pdid` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `pdate` datetime NOT NULL,
  `developer` varchar(40) NOT NULL,
  `svcode` varchar(40) NOT NULL,
  `version` varchar(40) NOT NULL,
  PRIMARY KEY (`pdid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `presets`
--

DROP TABLE IF EXISTS `presets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `presets` (
  `prid` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `class` varchar(40) NOT NULL,
  `gname` varchar(40) NOT NULL COMMENT 'group name',
  `login` varchar(40) NOT NULL,
  `name` varchar(40) NOT NULL,
  `data` text NOT NULL COMMENT 'script',
  PRIMARY KEY (`prid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `reportperiods`
--

DROP TABLE IF EXISTS `reportperiods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reportperiods` (
  `rpid` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `rpdate` datetime NOT NULL,
  `enddate` datetime NOT NULL,
  `schedule` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`rpid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `reportscripts`
--

DROP TABLE IF EXISTS `reportscripts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reportscripts` (
  `rsid` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `sysname` varchar(40) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `descr` varchar(255) DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`rsid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `temp_accounts`
--

DROP TABLE IF EXISTS `temp_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `temp_accounts` (
  `aid` smallint(5) unsigned NOT NULL,
  `aname` varchar(40) DEFAULT NULL,
  `curr` char(3) DEFAULT NULL,
  `side` tinyint(4) DEFAULT '0',
  `usebal` tinyint(4) DEFAULT '1',
  `apdate` datetime DEFAULT NULL,
  `apbal` decimal(10,3) DEFAULT '0.000',
  `descr` varchar(255) DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`aid`)
) ENGINE=MEMORY DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `temp_actpoints`
--

DROP TABLE IF EXISTS `temp_actpoints`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `temp_actpoints` (
  `apid` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `aname` varchar(40) DEFAULT NULL,
  `apdate` datetime DEFAULT NULL,
  `descr` varchar(255) DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`apid`)
) ENGINE=MEMORY DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `temp_cookie`
--

DROP TABLE IF EXISTS `temp_cookie`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `temp_cookie` (
  `cookie` varchar(40) DEFAULT NULL,
  `login` varchar(20) DEFAULT NULL
) ENGINE=MEMORY DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `temp_formlock`
--

DROP TABLE IF EXISTS `temp_formlock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `temp_formlock` (
  `tflid` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `href` varchar(100) DEFAULT NULL,
  `uid` smallint(5) DEFAULT NULL,
  `lcode` varchar(100) DEFAULT NULL,
  `tlock` datetime NOT NULL,
  PRIMARY KEY (`tflid`),
  KEY `href_range` (`href`)
) ENGINE=MEMORY DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `temp_transactions`
--

DROP TABLE IF EXISTS `temp_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `temp_transactions` (
  `tid` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `tdate` datetime NOT NULL,
  `tcurr` char(3) DEFAULT NULL,
  `accept` tinyint(1) DEFAULT NULL,
  `plus` decimal(10,3) NOT NULL DEFAULT '0.000',
  `minus` decimal(10,3) NOT NULL DEFAULT '0.000',
  `source` smallint(5) unsigned DEFAULT NULL,
  `dest` smallint(5) unsigned DEFAULT NULL,
  `scassa` smallint(5) unsigned NOT NULL DEFAULT '0',
  `dcassa` smallint(5) unsigned NOT NULL DEFAULT '0',
  `descr` varchar(255) DEFAULT NULL,
  `oid` smallint(5) unsigned DEFAULT NULL,
  `uid` smallint(5) unsigned DEFAULT NULL,
  `tfid` smallint(5) unsigned NOT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`tid`)
) ENGINE=MEMORY DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `transactions` (
  `tid` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `tdate` datetime NOT NULL,
  `tcurr` char(3) DEFAULT NULL,
  `accept` tinyint(1) DEFAULT NULL,
  `plus` decimal(10,3) DEFAULT '0.000',
  `minus` decimal(10,3) DEFAULT '0.000',
  `source` smallint(5) unsigned DEFAULT NULL,
  `dest` smallint(5) unsigned DEFAULT NULL,
  `descr` varchar(255) DEFAULT NULL,
  `oid` smallint(5) unsigned DEFAULT NULL,
  `uid` smallint(5) unsigned DEFAULT NULL,
  `tfid` smallint(6) DEFAULT '1',
  `scassa` smallint(5) unsigned NOT NULL DEFAULT '0',
  `dcassa` smallint(5) unsigned NOT NULL DEFAULT '0',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`tid`),
  KEY `tdate_range` (`tdate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `uid_aid`
--

DROP TABLE IF EXISTS `uid_aid`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `uid_aid` (
  `uaid` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `uid` smallint(5) DEFAULT NULL,
  `aid` smallint(5) DEFAULT NULL,
  `def` tinyint(4) DEFAULT NULL,
  `descr` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`uaid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `uid` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `login` varchar(20) DEFAULT NULL,
  `password` varchar(20) DEFAULT NULL,
  `fullname` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `descr` varchar(255) DEFAULT NULL,
  `apbal` decimal(10,3) DEFAULT '0.000',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-07-31  0:00:07
