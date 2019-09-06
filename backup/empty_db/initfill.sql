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
-- Dumping data for table `agog`
--

LOCK TABLES `agog` WRITE;
/*!40000 ALTER TABLE `agog` DISABLE KEYS */;
INSERT INTO `agog` VALUES (1,'uid_aid','uid','users','link','',0,0),(2,'uid_aid','aid','accounts','link','',0,0),(3,'lid_aid','aid','accounts','link','',0,0),(4,'lid_aid','lid','labels','link','',0,0),(5,'transactions','source','accounts','','',0,0),(6,'transactions','dest','accounts','','',0,0),(7,'transactions','scassa','users','','',0,0),(8,'transactions','dcassa','users','','',0,0),(9,'transactions','uid','users','','',0,0),(10,'transactions','tfid','transactions_formpre','','',0,0),(11,'transactions_formpre','defsour','accounts','','',0,0),(12,'transactions_formpre','defdest','accounts','','',0,0),(13,'transactions_formpre','uid','users','','',0,0),(14,'budgetrules','rsid','reportscripts','','',0,0),(15,'budgetrules','source','accounts','','',0,0),(16,'budgetrules','dest','accounts','','',0,0),(17,'budgetrules','uid','users','','',0,0),(19,'accounts','curr','','','currency',0,0),(20,'accounts','side','','','side',0,0),(21,'accounts','usebal','','','use_balance',0,0),(22,'transactions','tcurr','','','currency',0,0),(23,'budgetrules','type','','','mode_budgetrule',0,0),(24,'accounts','aname','','','',1,0),(25,'labels','lname','','','',1,0),(26,'transactions','tdate','','','',1,0),(27,'users','login','','','',1,0),(28,'reportpresets','rpname','','','',1,0),(29,'journalpresets','jpname','','','',1,0),(30,'transactions_formpre','tfname','','','',1,0),(31,'slid_sid','slid','sublabels','link','',0,0),(32,'slid_sid','sid','subjects','link','',0,0),(33,'subjects','sgid','subgroups','','',0,0),(34,'subjects','currcid','contracts','','',0,0),(35,'contracts','contractor','subjects','','',0,0),(36,'contracts','customer','subjects','','',0,0),(37,'contracts','budget','budgetrules','','',0,0),(38,'subjects','stype','','','typesubject',0,0),(39,'subjects','taxation','','','taxation',0,0),(40,'subjects','sname','','','',1,0),(41,'sublabels','slname','','','',1,0),(42,'subgroups','sgname','','','',1,0),(43,'contracts','cdate','','','',1,0);
/*!40000 ALTER TABLE `agog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `enumerations`
--

LOCK TABLES `enumerations` WRITE;
/*!40000 ALTER TABLE `enumerations` DISABLE KEYS */;
INSERT INTO `enumerations` VALUES (1,'currency','UAN','UAN',0),(2,'currency','USD','USD',0),(3,'side','INNER','0',0),(4,'side','OUTER','1',0),(5,'use_balance','USE','1',0),(6,'use_balance','NOT','0',0),(7,'mode_budgetrule','ANALYTIC','0',0),(8,'mode_budgetrule','DEFER','1',0),(9,'mode_budgetrule','AUTODEFER','2',0),(10,'typesubject','ENTITY','ENTITY',0),(11,'typesubject','IE','IE',0),(12,'taxation','common','common',0),(13,'taxation','simpl','simpl',0);
/*!40000 ALTER TABLE `enumerations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `reportscripts`
--

LOCK TABLES `reportscripts` WRITE;
/*!40000 ALTER TABLE `reportscripts` DISABLE KEYS */;
INSERT INTO `reportscripts` VALUES (1,'allCounts','total balance of all counts',NULL,0);
/*!40000 ALTER TABLE `reportscripts` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-09-06 12:56:37
