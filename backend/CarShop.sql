-- MySQL dump 10.13  Distrib 8.0.39, for Win64 (x86_64)
--
-- Host: localhost    Database: carshop_db
-- ------------------------------------------------------
-- Server version	8.0.39

CREATE DATABASE IF NOT EXISTS `carshop_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `carshop_db`;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `chi_tiet_don_hang`
--

DROP TABLE IF EXISTS `chi_tiet_don_hang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chi_tiet_don_hang` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ngay_cap_nhat` datetime(6) DEFAULT NULL,
  `ngay_tao` datetime(6) DEFAULT NULL,
  `don_gia` decimal(15,2) NOT NULL,
  `loai_san_pham` enum('DICH_VU','OTO','PHU_KIEN') NOT NULL,
  `so_luong` int NOT NULL,
  `thanh_tien` decimal(15,2) NOT NULL,
  `dich_vu_id` bigint DEFAULT NULL,
  `don_hang_id` bigint NOT NULL,
  `oto_id` bigint DEFAULT NULL,
  `phu_kien_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKoldfctjd9b1f2x8fwipg96vpi` (`dich_vu_id`),
  KEY `FKt57maavf6s28hxyar724mdr1b` (`don_hang_id`),
  KEY `FK2g0lmvtod8ma79ay95nb2ylhf` (`oto_id`),
  KEY `FK1ij1xe4e34g3xprjxvm2vcj9g` (`phu_kien_id`),
  CONSTRAINT `FK1ij1xe4e34g3xprjxvm2vcj9g` FOREIGN KEY (`phu_kien_id`) REFERENCES `phu_kien` (`id`),
  CONSTRAINT `FK2g0lmvtod8ma79ay95nb2ylhf` FOREIGN KEY (`oto_id`) REFERENCES `oto` (`id`),
  CONSTRAINT `FKoldfctjd9b1f2x8fwipg96vpi` FOREIGN KEY (`dich_vu_id`) REFERENCES `dich_vu` (`id`),
  CONSTRAINT `FKt57maavf6s28hxyar724mdr1b` FOREIGN KEY (`don_hang_id`) REFERENCES `don_hang` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chi_tiet_don_hang`
--

LOCK TABLES `chi_tiet_don_hang` WRITE;
/*!40000 ALTER TABLE `chi_tiet_don_hang` DISABLE KEYS */;
INSERT INTO `chi_tiet_don_hang` VALUES (1,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000',1250000.00,'PHU_KIEN',1,1250000.00,NULL,1,NULL,1),(2,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000',280000.00,'PHU_KIEN',2,560000.00,NULL,2,NULL,3),(3,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000',350000.00,'PHU_KIEN',2,700000.00,NULL,2,NULL,2),(4,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000',1500000.00,'PHU_KIEN',1,1500000.00,NULL,2,NULL,6),(5,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000',1800000.00,'PHU_KIEN',1,1800000.00,NULL,3,NULL,4),(6,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000',420000.00,'PHU_KIEN',2,420000.00,NULL,3,NULL,7),(7,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000',1390000000.00,'OTO',1,1390000000.00,NULL,4,1,NULL),(8,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000',320000.00,'PHU_KIEN',2,640000.00,NULL,5,NULL,8),(9,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000',450000.00,'PHU_KIEN',1,450000.00,NULL,5,NULL,10),(10,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000',2300000.00,'PHU_KIEN',1,2300000.00,NULL,6,NULL,9),(11,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000',420000.00,'PHU_KIEN',1,420000.00,NULL,6,NULL,7),(12,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000',1218000000.00,'OTO',1,1218000000.00,NULL,7,2,NULL),(13,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000',890000.00,'PHU_KIEN',2,1800000.00,NULL,7,NULL,5),(14,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000',890000.00,'PHU_KIEN',1,890000.00,NULL,8,NULL,5),(15,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000',1250000.00,'PHU_KIEN',1,1250000.00,NULL,9,NULL,1),(16,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000',890000.00,'PHU_KIEN',1,890000.00,NULL,9,NULL,5),(17,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000',2300000.00,'PHU_KIEN',1,2300000.00,NULL,10,NULL,9),(18,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000',280000.00,'PHU_KIEN',4,1120000.00,NULL,10,NULL,3);
/*!40000 ALTER TABLE `chi_tiet_don_hang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `danh_gia`
--

DROP TABLE IF EXISTS `danh_gia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `danh_gia` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ngay_cap_nhat` datetime(6) DEFAULT NULL,
  `ngay_tao` datetime(6) DEFAULT NULL,
  `diem_danh_gia` int NOT NULL,
  `loai_san_pham` enum('DICH_VU','OTO','PHU_KIEN') NOT NULL,
  `noi_dung` text,
  `trang_thai` bit(1) NOT NULL,
  `dich_vu_id` bigint DEFAULT NULL,
  `khach_hang_id` bigint NOT NULL,
  `oto_id` bigint DEFAULT NULL,
  `phu_kien_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK758aiv316rc2cspjaa3xofvjp` (`dich_vu_id`),
  KEY `FKs24q7va704gwc33kjomar4s4p` (`khach_hang_id`),
  KEY `FK23s5l3cbgcuc8xvg3rd6llias` (`oto_id`),
  KEY `FKdd04dq610m92wtm78rni0tvn3` (`phu_kien_id`),
  CONSTRAINT `FK23s5l3cbgcuc8xvg3rd6llias` FOREIGN KEY (`oto_id`) REFERENCES `oto` (`id`),
  CONSTRAINT `FK758aiv316rc2cspjaa3xofvjp` FOREIGN KEY (`dich_vu_id`) REFERENCES `dich_vu` (`id`),
  CONSTRAINT `FKdd04dq610m92wtm78rni0tvn3` FOREIGN KEY (`phu_kien_id`) REFERENCES `phu_kien` (`id`),
  CONSTRAINT `FKs24q7va704gwc33kjomar4s4p` FOREIGN KEY (`khach_hang_id`) REFERENCES `khach_hang` (`id`),
  CONSTRAINT `danh_gia_chk_1` CHECK (((`diem_danh_gia` <= 5) and (`diem_danh_gia` >= 1)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `danh_gia`
--

LOCK TABLES `danh_gia` WRITE;
/*!40000 ALTER TABLE `danh_gia` DISABLE KEYS */;
/*!40000 ALTER TABLE `danh_gia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dia_chi_khach_hang`
--

DROP TABLE IF EXISTS `dia_chi_khach_hang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dia_chi_khach_hang` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ngay_cap_nhat` datetime(6) DEFAULT NULL,
  `ngay_tao` datetime(6) DEFAULT NULL,
  `dia_chi_chi_tiet` text NOT NULL,
  `is_default` bit(1) DEFAULT NULL,
  `so_dien_thoai` varchar(15) NOT NULL,
  `ten_nguoi_nhan` varchar(100) NOT NULL,
  `tinh_thanh_id` int NOT NULL,
  `tinh_thanh_ten` varchar(100) NOT NULL,
  `xa_phuong_id` int DEFAULT NULL,
  `xa_phuong_ten` varchar(100) DEFAULT NULL,
  `khach_hang_id` bigint NOT NULL,
  `ghn_district_id` int DEFAULT NULL,
  `ghn_ward_code` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK2mxf2qa1ern5h64biueqov64m` (`khach_hang_id`),
  CONSTRAINT `FK2mxf2qa1ern5h64biueqov64m` FOREIGN KEY (`khach_hang_id`) REFERENCES `khach_hang` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dia_chi_khach_hang`
--

LOCK TABLES `dia_chi_khach_hang` WRITE;
/*!40000 ALTER TABLE `dia_chi_khach_hang` DISABLE KEYS */;
INSERT INTO `dia_chi_khach_hang` VALUES (1,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000','12 Phố Giải Phóng, Phường Yên Sở, Quận Hoàng Mai, Hà Nội',_binary '','0911000001','Nguyễn Văn An',1,'Hà Nội',1001,'Phường Yên Sở',10,1490,'1A0814'),(2,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000','88 Nguyễn Huệ, Phường Trung Mỹ Tây, Quận 12, TP.HCM',_binary '\0','0911000001','Nguyễn Văn An',2,'TP Hồ Chí Minh',2001,'Phường Trung Mỹ Tây',10,1454,'21211'),(3,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000','45 Trần Đại Nghĩa, Phường Định Công, Quận Hoàng Mai, Hà Nội',_binary '','0911000002','Trần Thị Bảo',1,'Hà Nội',1002,'Phường Định Công',11,1490,'1A0802'),(4,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000','67 Bạch Đằng, Xã Tân Thành, Quận Sơn Trà, Đà Nẵng',_binary '','0911000003','Lê Hoàng Cường',3,'Đà Nẵng',3001,'Xã Tân Thành',12,1823,'640706'),(5,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000','99 Đinh Tiên Hoàng, Phường Trung Mỹ Tây, Quận 12, TP.HCM',_binary '','0911000004','Phạm Thị Dung',2,'TP Hồ Chí Minh',2001,'Phường Trung Mỹ Tây',13,1454,'21211'),(6,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000','23 Lê Trọng Tấn, Phường Hoàng Liệt, Quận Hoàng Mai, Hà Nội',_binary '','0911000005','Hoàng Văn Em',1,'Hà Nội',1003,'Phường Hoàng Liệt',14,1490,'1A0804'),(7,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000','11 Nguyễn Chí Thanh, Xã Hiệp Lợi, Quận Sơn Trà, Đà Nẵng',_binary '','0911000006','Vũ Thị Phương',3,'Đà Nẵng',3002,'Xã Hiệp Lợi',15,1823,'640705'),(8,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000','55 Lý Tự Trọng, Phường Thọi An, Quận 12, TP.HCM',_binary '\0','0911000006','Vũ Thị Phương',2,'TP Hồ Chí Minh',2002,'Phường Thọi An',15,1454,'21210'),(9,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000','7 Hùng Vương, Phường Ngã Bảy, Quận Sơn Trà, Đà Nẵng',_binary '\0','0911000004','Phạm Thị Dung',3,'Đà Nẵng',3003,'Phường Ngã Bảy',13,1823,'640703'),(10,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000','5 Tôn Đức Thắng, Phường Thanh Trì, Quận Hoàng Mai, Hà Nội',_binary '\0','0911000003','Lê Hoàng Cường',1,'Hà Nội',1004,'Phường Thanh Trì',12,1490,'1A0809');
/*!40000 ALTER TABLE `dia_chi_khach_hang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dich_vu`
--

DROP TABLE IF EXISTS `dich_vu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dich_vu` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ngay_cap_nhat` datetime(6) DEFAULT NULL,
  `ngay_tao` datetime(6) DEFAULT NULL,
  `gia` decimal(15,2) NOT NULL,
  `mo_ta` text,
  `ten_dich_vu` varchar(200) NOT NULL,
  `thoi_gian_uoc_tinh` varchar(50) DEFAULT NULL,
  `trang_thai` bit(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dich_vu`
--

LOCK TABLES `dich_vu` WRITE;
/*!40000 ALTER TABLE `dich_vu` DISABLE KEYS */;
/*!40000 ALTER TABLE `dich_vu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `don_hang`
--

DROP TABLE IF EXISTS `don_hang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `don_hang` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ngay_cap_nhat` datetime(6) DEFAULT NULL,
  `ngay_tao` datetime(6) DEFAULT NULL,
  `ghi_chu` text,
  `ma_don_hang` varchar(30) NOT NULL,
  `ma_don_hang_ghn` varchar(100) DEFAULT NULL,
  `phi_van_chuyen` decimal(15,2) DEFAULT NULL,
  `tong_tien` decimal(15,2) NOT NULL,
  `trang_thai` enum('CHO_XAC_NHAN','DANG_GIAO','DANG_XU_LY','DA_HUY','DA_XAC_NHAN','HOAN_THANH') NOT NULL,
  `dia_chi_giao_hang_id` bigint DEFAULT NULL,
  `khach_hang_id` bigint NOT NULL,
  `kho_hang_id` bigint DEFAULT NULL,
  `nhan_vien_xu_ly_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKs5i48w1mfy55nsdcohle0lbbp` (`ma_don_hang`),
  KEY `FKpovc7rl9wiiflua4e7q5fv7jv` (`dia_chi_giao_hang_id`),
  KEY `FKeyporccvr9mq4k9j4fc5wpum5` (`khach_hang_id`),
  KEY `FK2juyci2n88b3xkw7vqim8jx59` (`kho_hang_id`),
  KEY `FKkntiy1oextv85xn8tcgxsitr8` (`nhan_vien_xu_ly_id`),
  CONSTRAINT `FK2juyci2n88b3xkw7vqim8jx59` FOREIGN KEY (`kho_hang_id`) REFERENCES `kho_hang` (`id`),
  CONSTRAINT `FKeyporccvr9mq4k9j4fc5wpum5` FOREIGN KEY (`khach_hang_id`) REFERENCES `khach_hang` (`id`),
  CONSTRAINT `FKkntiy1oextv85xn8tcgxsitr8` FOREIGN KEY (`nhan_vien_xu_ly_id`) REFERENCES `nhan_vien` (`id`),
  CONSTRAINT `FKpovc7rl9wiiflua4e7q5fv7jv` FOREIGN KEY (`dia_chi_giao_hang_id`) REFERENCES `dia_chi_khach_hang` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `don_hang`
--

LOCK TABLES `don_hang` WRITE;
/*!40000 ALTER TABLE `don_hang` DISABLE KEYS */;
INSERT INTO `don_hang` VALUES (1,'2026-04-06 16:48:06.101796','2026-04-04 16:44:00.000000','Giao giờ hành chính','DH-2026-0001','LTMRLN',0.00,1250000.00,'DA_XAC_NHAN',1,10,1,2),(2,'2026-04-05 16:44:00.000000','2026-04-05 16:44:00.000000','Gọi trước khi đến','DH-2026-0002',NULL,0.00,2690000.00,'CHO_XAC_NHAN',3,11,3,3),(3,'2026-04-06 16:52:12.004710','2026-04-01 16:44:00.000000',NULL,'DH-2026-0003',NULL,25000.00,1870000.00,'CHO_XAC_NHAN',4,12,2,2),(4,'2026-04-06 16:52:12.965327','2026-03-30 16:44:00.000000','Khách ra showroom nhận xe','DH-2026-0004',NULL,0.00,1390000000.00,'CHO_XAC_NHAN',NULL,13,NULL,NULL),(5,'2026-04-06 16:52:14.567331','2026-04-02 16:44:00.000000',NULL,'DH-2026-0005','GHNTESTHN001',30000.00,920000.00,'CHO_XAC_NHAN',6,14,1,2),(6,'2026-04-06 16:52:16.104389','2026-03-27 16:44:00.000000',NULL,'DH-2026-0006','GHNTESTHCM02',22000.00,2720000.00,'CHO_XAC_NHAN',7,15,3,3),(7,'2026-04-03 16:44:00.000000','2026-04-03 16:44:00.000000','Kèm phụ kiện lắp sẵn','DH-2026-0007',NULL,0.00,1219800000.00,'DANG_XU_LY',1,10,1,4),(8,'2026-04-06 16:52:21.797218','2026-03-29 16:44:00.000000','Khách đổi ý','DH-2026-0008',NULL,0.00,890000.00,'CHO_XAC_NHAN',4,12,2,NULL),(9,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000','Đóng gói cẩn thận','DH-2026-0009',NULL,0.00,1600000.00,'CHO_XAC_NHAN',7,15,2,2),(10,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000',NULL,'DH-2026-0010',NULL,0.00,3420000.00,'CHO_XAC_NHAN',5,13,3,3);
/*!40000 ALTER TABLE `don_hang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `khach_hang`
--

DROP TABLE IF EXISTS `khach_hang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `khach_hang` (
  `diem_tich_luy` int DEFAULT NULL,
  `hang_thanh_vien` enum('BAC','DONG','KIM_CUONG','VANG') DEFAULT NULL,
  `id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `FKcp8ph0atqfwjo9itwicv1jxvv` FOREIGN KEY (`id`) REFERENCES `nguoi_dung` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `khach_hang`
--

LOCK TABLES `khach_hang` WRITE;
/*!40000 ALTER TABLE `khach_hang` DISABLE KEYS */;
INSERT INTO `khach_hang` VALUES (500,'BAC',10),(1200,'VANG',11),(200,'DONG',12),(800,'BAC',13),(0,'DONG',14),(3500,'KIM_CUONG',15);
/*!40000 ALTER TABLE `khach_hang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `khieu_nai`
--

DROP TABLE IF EXISTS `khieu_nai`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `khieu_nai` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ngay_cap_nhat` datetime(6) DEFAULT NULL,
  `ngay_tao` datetime(6) DEFAULT NULL,
  `noi_dung` text NOT NULL,
  `phan_hoi` text,
  `tieu_de` varchar(200) NOT NULL,
  `trang_thai` enum('DANG_XU_LY','DA_GIAI_QUYET','MOI','TU_CHOI') NOT NULL,
  `don_hang_id` bigint DEFAULT NULL,
  `khach_hang_id` bigint NOT NULL,
  `nhan_vien_xu_ly_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK8h1m1r9s5itm9yhs6qe6oens1` (`don_hang_id`),
  KEY `FKihggwjsyjo3hvc7ob90c6viqy` (`khach_hang_id`),
  KEY `FKdqatbmb9vralm63ip80tmgoh3` (`nhan_vien_xu_ly_id`),
  CONSTRAINT `FK8h1m1r9s5itm9yhs6qe6oens1` FOREIGN KEY (`don_hang_id`) REFERENCES `don_hang` (`id`),
  CONSTRAINT `FKdqatbmb9vralm63ip80tmgoh3` FOREIGN KEY (`nhan_vien_xu_ly_id`) REFERENCES `nhan_vien` (`id`),
  CONSTRAINT `FKihggwjsyjo3hvc7ob90c6viqy` FOREIGN KEY (`khach_hang_id`) REFERENCES `khach_hang` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `khieu_nai`
--

LOCK TABLES `khieu_nai` WRITE;
/*!40000 ALTER TABLE `khieu_nai` DISABLE KEYS */;
/*!40000 ALTER TABLE `khieu_nai` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kho_hang`
--

DROP TABLE IF EXISTS `kho_hang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kho_hang` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ngay_cap_nhat` datetime(6) DEFAULT NULL,
  `ngay_tao` datetime(6) DEFAULT NULL,
  `dia_chi_chi_tiet` text NOT NULL,
  `ghn_district_id` int DEFAULT NULL,
  `ghn_province_id` int DEFAULT NULL,
  `ghn_shop_id` varchar(50) DEFAULT NULL,
  `ghn_ward_code` varchar(20) DEFAULT NULL,
  `nguoi_lien_he` varchar(100) DEFAULT NULL,
  `so_dien_thoai` varchar(15) NOT NULL,
  `ten_kho` varchar(100) NOT NULL,
  `tinh_thanh_id` int NOT NULL,
  `tinh_thanh_ten` varchar(100) NOT NULL,
  `trang_thai` bit(1) NOT NULL,
  `xa_phuong_id` int DEFAULT NULL,
  `xa_phuong_ten` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kho_hang`
--

LOCK TABLES `kho_hang` WRITE;
/*!40000 ALTER TABLE `kho_hang` DISABLE KEYS */;
INSERT INTO `kho_hang` VALUES (1,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000','Số 15 Đường Giải Phóng, Phường Yên Sở, Quận Hoàng Mai, Hà Nội',1490,201,NULL,'1A0814','Nguyễn Văn Hùng','0901100001','Kho Hà Nội',1,'Hà Nội',_binary '',1001,'Phường Yên Sở'),(2,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000','Số 32 Lê Đình Lý, Xã Tân Thành, Quận Sơn Trà, Đà Nẵng',1823,518,NULL,'640706','Trần Thị Lan','0902200002','Kho Đà Nẵng',3,'Đà Nẵng',_binary '',3001,'Xã Tân Thành'),(3,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000','Số 118 Lê Thánh Tôn, Phường Trung Mỹ Tây, Quận 12, TP.HCM',1454,202,NULL,'21211','Phạm Minh Tuấn','0903300003','Kho TP Hồ Chí Minh',2,'TP Hồ Chí Minh',_binary '',2001,'Phường Trung Mỹ Tây');
/*!40000 ALTER TABLE `kho_hang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `media`
--

DROP TABLE IF EXISTS `media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `media` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ngay_cap_nhat` datetime(6) DEFAULT NULL,
  `ngay_tao` datetime(6) DEFAULT NULL,
  `chieu_cao` int DEFAULT NULL,
  `chieu_rong` int DEFAULT NULL,
  `dinh_dang` varchar(20) DEFAULT NULL,
  `doi_tuong_id` bigint NOT NULL,
  `dung_luong` bigint DEFAULT NULL,
  `loai_doi_tuong` enum('DICH_VU','OTO','PHU_KIEN','KHIEU_NAI') NOT NULL,
  `loai_media` enum('IMAGE','VIDEO') NOT NULL,
  `mo_ta` varchar(255) DEFAULT NULL,
  `public_id` varchar(300) NOT NULL,
  `thoi_luong` double DEFAULT NULL,
  `thu_tu` int DEFAULT NULL,
  `url` varchar(500) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_media_doi_tuong` (`loai_doi_tuong`,`doi_tuong_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media`
--

LOCK TABLES `media` WRITE;
/*!40000 ALTER TABLE `media` DISABLE KEYS */;
/*!40000 ALTER TABLE `media` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nguoi_dung`
--

DROP TABLE IF EXISTS `nguoi_dung`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nguoi_dung` (
  `loai_nguoi_dung` varchar(31) NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ngay_cap_nhat` datetime(6) DEFAULT NULL,
  `ngay_tao` datetime(6) DEFAULT NULL,
  `anh_dai_dien` varchar(255) DEFAULT NULL,
  `dia_chi` text,
  `email` varchar(150) NOT NULL,
  `ho_ten` varchar(100) NOT NULL,
  `mat_khau` varchar(255) NOT NULL,
  `so_dien_thoai` varchar(15) DEFAULT NULL,
  `trang_thai` bit(1) NOT NULL,
  `vai_tro` enum('ADMIN','KHACH_HANG','NHAN_VIEN') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKmajqh5g4djy2tp3p9dvr64brp` (`email`),
  CONSTRAINT `nguoi_dung_chk_1` CHECK ((`loai_nguoi_dung` in (_utf8mb4'NguoiDung',_utf8mb4'KHACH_HANG',_utf8mb4'NHAN_VIEN')))
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nguoi_dung`
--

LOCK TABLES `nguoi_dung` WRITE;
/*!40000 ALTER TABLE `nguoi_dung` DISABLE KEYS */;
INSERT INTO `nguoi_dung` VALUES ('NHAN_VIEN',1,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000',NULL,NULL,'admin@carshop.com','Admin Carshop','$2a$10$ef3pZeYE3ugcrCrY6pJIOOSJpKAxvk0sm8ZduQvtBiFVCIJ3oUCU6','0900000001',_binary '','ADMIN'),('NHAN_VIEN',2,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000',NULL,NULL,'dat.nv@carshop.com','Nguyễn Thành Đạt','$2a$10$N.zmdr9zkP1Tc03RFPh8reUvYJDmF4jNFdLZajr5P9m.sVJrJSiui','0900000002',_binary '','NHAN_VIEN'),('NHAN_VIEN',3,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000',NULL,NULL,'hoa.nv@carshop.com','Lê Thị Hoa','$2a$10$N.zmdr9zkP1Tc03RFPh8reUvYJDmF4jNFdLZajr5P9m.sVJrJSiui','0900000003',_binary '','NHAN_VIEN'),('NHAN_VIEN',4,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000',NULL,NULL,'binh.nv@carshop.com','Trần Văn Bình','$2a$10$N.zmdr9zkP1Tc03RFPh8reUvYJDmF4jNFdLZajr5P9m.sVJrJSiui','0900000004',_binary '','NHAN_VIEN'),('KHACH_HANG',10,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000',NULL,NULL,'an.kh@gmail.com','Nguyễn Văn An','$2a$10$N.zmdr9zkP1Tc03RFPh8reUvYJDmF4jNFdLZajr5P9m.sVJrJSiui','0911000001',_binary '','KHACH_HANG'),('KHACH_HANG',11,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000',NULL,NULL,'bao.kh@gmail.com','Trần Thị Bảo','$2a$10$N.zmdr9zkP1Tc03RFPh8reUvYJDmF4jNFdLZajr5P9m.sVJrJSiui','0911000002',_binary '','KHACH_HANG'),('KHACH_HANG',12,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000',NULL,NULL,'cuong.kh@gmail.com','Lê Hoàng Cường','$2a$10$N.zmdr9zkP1Tc03RFPh8reUvYJDmF4jNFdLZajr5P9m.sVJrJSiui','0911000003',_binary '','KHACH_HANG'),('KHACH_HANG',13,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000',NULL,NULL,'dung.kh@gmail.com','Phạm Thị Dung','$2a$10$N.zmdr9zkP1Tc03RFPh8reUvYJDmF4jNFdLZajr5P9m.sVJrJSiui','0911000004',_binary '','KHACH_HANG'),('KHACH_HANG',14,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000',NULL,NULL,'em.kh@gmail.com','Hoàng Văn Em','$2a$10$N.zmdr9zkP1Tc03RFPh8reUvYJDmF4jNFdLZajr5P9m.sVJrJSiui','0911000005',_binary '','KHACH_HANG'),('KHACH_HANG',15,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000',NULL,NULL,'phuong.kh@gmail.com','Vũ Thị Phương','$2a$10$N.zmdr9zkP1Tc03RFPh8reUvYJDmF4jNFdLZajr5P9m.sVJrJSiui','0911000006',_binary '','KHACH_HANG');
/*!40000 ALTER TABLE `nguoi_dung` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nhan_vien`
--

DROP TABLE IF EXISTS `nhan_vien`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nhan_vien` (
  `chuc_vu` enum('CHAM_SOC_KHACH_HANG','KE_TOAN','KY_THUAT_VIEN','NHAN_VIEN_BAN_HANG','QUAN_LY') DEFAULT NULL,
  `luong` decimal(15,2) DEFAULT NULL,
  `ma_nhan_vien` varchar(20) NOT NULL,
  `ngay_vao_lam` date DEFAULT NULL,
  `phong_ban` varchar(100) DEFAULT NULL,
  `id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKf0qentjxcfeoyrwxpv5htu514` (`ma_nhan_vien`),
  CONSTRAINT `FKprlpmdctdqid0fycwqd8c9r59` FOREIGN KEY (`id`) REFERENCES `nguoi_dung` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nhan_vien`
--

LOCK TABLES `nhan_vien` WRITE;
/*!40000 ALTER TABLE `nhan_vien` DISABLE KEYS */;
INSERT INTO `nhan_vien` VALUES ('QUAN_LY',30000000.00,'NV-ADMIN-001','2022-01-01','Ban Giám Đốc',1),('NHAN_VIEN_BAN_HANG',12000000.00,'NV-2025-002','2023-05-01','Kinh Doanh',2),('CHAM_SOC_KHACH_HANG',10000000.00,'NV-2025-003','2024-01-15','CSKH',3),('KY_THUAT_VIEN',11000000.00,'NV-2025-004','2024-03-01','Kỹ Thuật',4);
/*!40000 ALTER TABLE `nhan_vien` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oto`
--

DROP TABLE IF EXISTS `oto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oto` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ngay_cap_nhat` datetime(6) DEFAULT NULL,
  `ngay_tao` datetime(6) DEFAULT NULL,
  `dong_co` varchar(100) DEFAULT NULL,
  `dong_xe` varchar(100) DEFAULT NULL,
  `gia` decimal(15,2) NOT NULL,
  `hang_xe` varchar(100) NOT NULL,
  `hop_so` varchar(50) DEFAULT NULL,
  `mau_sac` varchar(50) DEFAULT NULL,
  `mo_ta` text,
  `nam_san_xuat` int DEFAULT NULL,
  `nhien_lieu` varchar(50) DEFAULT NULL,
  `so_km` int DEFAULT NULL,
  `so_luong` int DEFAULT NULL,
  `ten_xe` varchar(200) NOT NULL,
  `trang_thai` enum('DANG_BAN','DAT_TRUOC','DA_BAN','NGUNG_BAN') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oto`
--

LOCK TABLES `oto` WRITE;
/*!40000 ALTER TABLE `oto` DISABLE KEYS */;
INSERT INTO `oto` VALUES (1,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000','2.5L 4-cylinder','Camry',1390000000.00,'Toyota','Tự Động','Đen','Sedan cao cấp đầy đủ option',2023,'Xăng',0,2,'Toyota Camry 2.5Q','DANG_BAN'),(2,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000','1.5L Turbo','CR-V',1218000000.00,'Honda','Tự Động','Trắng','SUV 5+2 chỗ, an toàn cao',2023,'Xăng',0,3,'Honda CR-V L','DANG_BAN'),(3,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000','2.2L Diesel','Sorento',1349000000.00,'Kia','Tự Động','Xám','Crossover 7 chỗ cao cấp',2024,'Dầu',0,1,'Kia Sorento Signature','DANG_BAN'),(4,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000','2.0L Biturbo','Ranger',962000000.00,'Ford','Tự Động','Xanh','Bán tải địa hình bền bỉ',2023,'Dầu',0,4,'Ford Ranger Wildtrak','DANG_BAN'),(5,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000','1.5L M254','C-Class',1939000000.00,'Mercedes','Tự Động','Đen','Sedan thương gia hạng sang',2023,'Xăng',0,1,'Mercedes C200 Avantgarde','DANG_BAN'),(6,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000','Electric Dual','VF8',1187000000.00,'VinFast','Tự Động','Trắng','SUV điện thuần Việt tự hào',2023,'Điện',0,5,'VinFast VF8 Plus','DANG_BAN'),(7,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000','2.0L MPI','Tucson',862000000.00,'Hyundai','Tự Động','Đỏ','SUV hạng C đa dụng ăn khách',2023,'Xăng',0,3,'Hyundai Tucson 2.0 ATH','DANG_BAN'),(8,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000','2.5L SkyActiv','CX-5',989000000.00,'Mazda','Tự Động','Bạc','Thiết kế Nhật tinh tế KODO',2023,'Xăng',0,2,'Mazda CX-5 Premium','DANG_BAN'),(9,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000','1.5L MIVEC','Xpander',702000000.00,'Mitsubishi','Tự Động','Đen','MPV 7 chỗ đa năng phổ thông',2023,'Xăng',0,6,'Mitsubishi Xpander Cross','DANG_BAN'),(10,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000','2.8L 1GD-FTV','Fortuner',1356000000.00,'Toyota','Tự Động','Bạc','SUV 7 chỗ đỉnh phân khúc D',2023,'Dầu',0,2,'Toyota Fortuner Legender','DANG_BAN');
/*!40000 ALTER TABLE `oto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phien_chat`
--

DROP TABLE IF EXISTS `phien_chat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phien_chat` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ngay_cap_nhat` datetime(6) DEFAULT NULL,
  `ngay_tao` datetime(6) DEFAULT NULL,
  `ngay_ket_thuc` datetime(6) DEFAULT NULL,
  `trang_thai` enum('DANG_CHO','DANG_HOAT_DONG','DA_DONG') NOT NULL,
  `khach_hang_id` bigint NOT NULL,
  `nhan_vien_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKmj7nkflrgf7mnett2tpqyr2wa` (`khach_hang_id`),
  KEY `FKfarggilqmo9d23dbc526ko7no` (`nhan_vien_id`),
  CONSTRAINT `FKfarggilqmo9d23dbc526ko7no` FOREIGN KEY (`nhan_vien_id`) REFERENCES `nhan_vien` (`id`),
  CONSTRAINT `FKmj7nkflrgf7mnett2tpqyr2wa` FOREIGN KEY (`khach_hang_id`) REFERENCES `khach_hang` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phien_chat`
--

LOCK TABLES `phien_chat` WRITE;
/*!40000 ALTER TABLE `phien_chat` DISABLE KEYS */;
/*!40000 ALTER TABLE `phien_chat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phu_kien`
--

DROP TABLE IF EXISTS `phu_kien`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phu_kien` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ngay_cap_nhat` datetime(6) DEFAULT NULL,
  `ngay_tao` datetime(6) DEFAULT NULL,
  `gia` decimal(15,2) NOT NULL,
  `hang_san_xuat` varchar(100) DEFAULT NULL,
  `loai_phu_kien` varchar(100) DEFAULT NULL,
  `mo_ta` text,
  `so_luong` int DEFAULT NULL,
  `ten_phu_kien` varchar(200) NOT NULL,
  `trang_thai` bit(1) NOT NULL,
  `trong_luong` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phu_kien`
--

LOCK TABLES `phu_kien` WRITE;
/*!40000 ALTER TABLE `phu_kien` DISABLE KEYS */;
INSERT INTO `phu_kien` VALUES (1,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000',1250000.00,'Michelin','Lốp xe','Lốp xe nguyên bản Michelin bền bỉ',50,'Lốp xe Michelin 215/60R16',_binary '',9500),(2,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000',350000.00,'Toyota','Bộ lọc','Lọc gió chính hãng Toyota',80,'Lọc gió động cơ Toyota',_binary '',350),(3,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000',280000.00,'Castrol','Dầu nhớt','Dầu động cơ tổng hợp cao cấp',100,'Dầu nhớt Castrol 5W-30 (4L)',_binary '',800),(4,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000',1800000.00,'Mafin','Camera','Camera toàn cảnh 360 độ chống nước IP67',30,'Camera lùi 360 độ HD',_binary '',650),(5,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000',890000.00,'Aukey','Cảm biến','Bộ 4 cảm biến áp suất lốp không dây',40,'Cảm biến áp suất lốp TPMS',_binary '',200),(6,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000',1500000.00,'ToyotaGear','Thảm lót','Thảm cao su 3D full bộ chính hãng',25,'Thảm lót sàn 3D Toyota Camry',_binary '',3000),(7,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000',420000.00,'GenericPro','Gương','Gương chiếu hậu gập điện thay thế',60,'Gương chiếu hậu gập điện',_binary '',450),(8,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000',320000.00,'Osram','Đèn','Đèn LED khoang xe ánh sáng trắng 6000K',120,'Đèn LED nội thất 12V bộ 4',_binary '',300),(9,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000',2300000.00,'GS Battery','Ắc quy','Ắc quy ô tô chính hãng GS Nhật Bản',15,'Bình ắc quy GS 55Ah 12V',_binary '',16000),(10,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000',450000.00,'Stanley','Dụng cụ','Kẹp kích điện ắc quy ô tô chuyên dụng',70,'Bộ kẹp điện cứu hộ Stanley',_binary '',1200);
/*!40000 ALTER TABLE `phu_kien` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `thanh_toan`
--

DROP TABLE IF EXISTS `thanh_toan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `thanh_toan` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ngay_cap_nhat` datetime(6) DEFAULT NULL,
  `ngay_tao` datetime(6) DEFAULT NULL,
  `du_lieu_phan_hoi` text,
  `ma_giao_dich` varchar(100) DEFAULT NULL,
  `ngay_thanh_toan` datetime(6) DEFAULT NULL,
  `noi_dung` varchar(255) DEFAULT NULL,
  `phuong_thuc` enum('CHUYEN_KHOAN','MOMO','TIEN_MAT','VNPAY') NOT NULL,
  `so_tien` decimal(15,2) NOT NULL,
  `trang_thai` enum('CHO_THANH_TOAN','DA_THANH_TOAN','HOAN_TIEN','THAT_BAI') NOT NULL,
  `url_thanh_toan` text,
  `don_hang_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKhuic4h1i8fvdu4wlqrn04e2b7` (`don_hang_id`),
  CONSTRAINT `FKhuic4h1i8fvdu4wlqrn04e2b7` FOREIGN KEY (`don_hang_id`) REFERENCES `don_hang` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thanh_toan`
--

LOCK TABLES `thanh_toan` WRITE;
/*!40000 ALTER TABLE `thanh_toan` DISABLE KEYS */;
INSERT INTO `thanh_toan` VALUES (1,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000',NULL,NULL,NULL,'COD khi nhận hàng','TIEN_MAT',1250000.00,'CHO_THANH_TOAN',NULL,1),(2,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000',NULL,'MOMO20260002','2026-04-05 16:44:00.000000','Thanh toán qua MoMo','MOMO',2690000.00,'DA_THANH_TOAN',NULL,2),(3,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000',NULL,'VP20260003','2026-04-02 16:44:00.000000','Thanh toán VNPay online','VNPAY',1895000.00,'DA_THANH_TOAN',NULL,3),(4,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000',NULL,'CK20260004','2026-03-31 16:44:00.000000','Chuyển khoản 100% tiền xe','CHUYEN_KHOAN',1390000000.00,'DA_THANH_TOAN',NULL,4),(5,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000',NULL,NULL,'2026-04-05 16:44:00.000000','COD thu khi giao','TIEN_MAT',950000.00,'DA_THANH_TOAN',NULL,5),(6,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000',NULL,NULL,'2026-04-04 16:44:00.000000','COD thu + phí ship','TIEN_MAT',2742000.00,'DA_THANH_TOAN',NULL,6),(7,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000',NULL,NULL,NULL,'COD khi nhận hàng','TIEN_MAT',1600000.00,'CHO_THANH_TOAN',NULL,9),(8,'2026-04-06 16:44:00.000000','2026-04-06 16:44:00.000000',NULL,'MOMO20260010','2026-04-06 16:44:00.000000','Đã thanh toán online MoMo','MOMO',3420000.00,'DA_THANH_TOAN',NULL,10);
/*!40000 ALTER TABLE `thanh_toan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tin_nhan`
--

DROP TABLE IF EXISTS `tin_nhan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tin_nhan` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ngay_cap_nhat` datetime(6) DEFAULT NULL,
  `ngay_tao` datetime(6) DEFAULT NULL,
  `da_doc` bit(1) NOT NULL,
  `loai_tin_nhan` enum('HINH_ANH','TAP_TIN','VAN_BAN') NOT NULL,
  `ngay_gui` datetime(6) NOT NULL,
  `noi_dung` text NOT NULL,
  `nguoi_gui_id` bigint NOT NULL,
  `phien_chat_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKfj8y0xh2iicon5lm2swyc2r2j` (`nguoi_gui_id`),
  KEY `FKjq2l8tlgsfs0lojwy3w9rb35t` (`phien_chat_id`),
  CONSTRAINT `FKfj8y0xh2iicon5lm2swyc2r2j` FOREIGN KEY (`nguoi_gui_id`) REFERENCES `nguoi_dung` (`id`),
  CONSTRAINT `FKjq2l8tlgsfs0lojwy3w9rb35t` FOREIGN KEY (`phien_chat_id`) REFERENCES `phien_chat` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tin_nhan`
--

LOCK TABLES `tin_nhan` WRITE;
/*!40000 ALTER TABLE `tin_nhan` DISABLE KEYS */;
/*!40000 ALTER TABLE `tin_nhan` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-19 20:33:39
