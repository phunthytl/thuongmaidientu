-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: carshop_db
-- ------------------------------------------------------
-- Server version	8.0.42

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
  `ngay_tao` datetime(6) DEFAULT NULL,
  `ngay_cap_nhat` datetime(6) DEFAULT NULL,
  `don_hang_id` bigint NOT NULL,
  `loai_san_pham` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `oto_id` bigint DEFAULT NULL,
  `phu_kien_id` bigint DEFAULT NULL,
  `dich_vu_id` bigint DEFAULT NULL,
  `kho_hang_id` bigint DEFAULT NULL,
  `so_luong` int NOT NULL DEFAULT '1',
  `don_gia` decimal(15,2) NOT NULL,
  `thanh_tien` decimal(15,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_ctdh_don_hang` (`don_hang_id`),
  KEY `idx_ctdh_oto` (`oto_id`),
  KEY `idx_ctdh_phu_kien` (`phu_kien_id`),
  KEY `idx_ctdh_dich_vu` (`dich_vu_id`),
  CONSTRAINT `fk_ctdh_dich_vu` FOREIGN KEY (`dich_vu_id`) REFERENCES `dich_vu` (`id`),
  CONSTRAINT `fk_ctdh_don_hang` FOREIGN KEY (`don_hang_id`) REFERENCES `don_hang` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ctdh_oto` FOREIGN KEY (`oto_id`) REFERENCES `oto` (`id`),
  CONSTRAINT `fk_ctdh_phu_kien` FOREIGN KEY (`phu_kien_id`) REFERENCES `phu_kien` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chi_tiet_don_hang`
--

LOCK TABLES `chi_tiet_don_hang` WRITE;
/*!40000 ALTER TABLE `chi_tiet_don_hang` DISABLE KEYS */;
INSERT INTO `chi_tiet_don_hang` VALUES (1,'2026-05-20 00:25:41.865908','2026-05-20 00:25:41.865908',1,'PHU_KIEN',NULL,2,NULL,1,1,2190000.00,2190000.00);
/*!40000 ALTER TABLE `chi_tiet_don_hang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chi_tiet_gio_hang`
--

DROP TABLE IF EXISTS `chi_tiet_gio_hang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chi_tiet_gio_hang` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ngay_tao` datetime(6) DEFAULT NULL,
  `ngay_cap_nhat` datetime(6) DEFAULT NULL,
  `gio_hang_id` bigint NOT NULL,
  `loai_san_pham` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `oto_id` bigint DEFAULT NULL,
  `phu_kien_id` bigint DEFAULT NULL,
  `dich_vu_id` bigint DEFAULT NULL,
  `kho_hang_id` bigint DEFAULT NULL,
  `so_luong` int NOT NULL DEFAULT '1',
  `don_gia` decimal(15,2) NOT NULL,
  `thanh_tien` decimal(15,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_ctgh_gio_hang` (`gio_hang_id`),
  KEY `idx_ctgh_oto` (`oto_id`),
  KEY `idx_ctgh_phu_kien` (`phu_kien_id`),
  KEY `idx_ctgh_dich_vu` (`dich_vu_id`),
  CONSTRAINT `fk_ctgh_dich_vu` FOREIGN KEY (`dich_vu_id`) REFERENCES `dich_vu` (`id`),
  CONSTRAINT `fk_ctgh_gio_hang` FOREIGN KEY (`gio_hang_id`) REFERENCES `gio_hang` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ctgh_oto` FOREIGN KEY (`oto_id`) REFERENCES `oto` (`id`),
  CONSTRAINT `fk_ctgh_phu_kien` FOREIGN KEY (`phu_kien_id`) REFERENCES `phu_kien` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chi_tiet_gio_hang`
--

LOCK TABLES `chi_tiet_gio_hang` WRITE;
/*!40000 ALTER TABLE `chi_tiet_gio_hang` DISABLE KEYS */;
INSERT INTO `chi_tiet_gio_hang` VALUES (2,'2026-05-20 09:40:32.709618','2026-05-20 09:59:27.318583',1,'PHU_KIEN',NULL,2,NULL,2,1,2190000.00,2190000.00);
/*!40000 ALTER TABLE `chi_tiet_gio_hang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `danh_gia`
--

DROP TABLE IF EXISTS `danh_gia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `danh_gia` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ngay_tao` datetime(6) DEFAULT NULL,
  `ngay_cap_nhat` datetime(6) DEFAULT NULL,
  `khach_hang_id` bigint NOT NULL,
  `loai_san_pham` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `oto_id` bigint DEFAULT NULL,
  `phu_kien_id` bigint DEFAULT NULL,
  `dich_vu_id` bigint DEFAULT NULL,
  `diem_danh_gia` int NOT NULL,
  `noi_dung` text COLLATE utf8mb4_unicode_ci,
  `trang_thai` bit(1) NOT NULL DEFAULT b'1',
  `lich_hen_id` bigint DEFAULT NULL,
  `chi_tiet_don_hang_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_danh_gia_lich_hen` (`lich_hen_id`),
  UNIQUE KEY `uk_danh_gia_ctdh` (`chi_tiet_don_hang_id`),
  KEY `idx_danh_gia_khach_hang` (`khach_hang_id`),
  KEY `idx_danh_gia_oto` (`oto_id`),
  KEY `idx_danh_gia_phu_kien` (`phu_kien_id`),
  KEY `idx_danh_gia_dich_vu` (`dich_vu_id`),
  CONSTRAINT `fk_danh_gia_dich_vu` FOREIGN KEY (`dich_vu_id`) REFERENCES `dich_vu` (`id`),
  CONSTRAINT `fk_danh_gia_khach_hang` FOREIGN KEY (`khach_hang_id`) REFERENCES `khach_hang` (`id`),
  CONSTRAINT `fk_danh_gia_oto` FOREIGN KEY (`oto_id`) REFERENCES `oto` (`id`),
  CONSTRAINT `fk_danh_gia_phu_kien` FOREIGN KEY (`phu_kien_id`) REFERENCES `phu_kien` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `danh_gia`
--

LOCK TABLES `danh_gia` WRITE;
/*!40000 ALTER TABLE `danh_gia` DISABLE KEYS */;
INSERT INTO `danh_gia` VALUES (1,'2026-05-20 09:30:02.861082','2026-05-20 09:30:02.861082',2,'PHU_KIEN',NULL,2,NULL,4,'k',_binary '',NULL,1);
/*!40000 ALTER TABLE `danh_gia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `danh_gia_oto`
--

DROP TABLE IF EXISTS `danh_gia_oto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `danh_gia_oto` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ngay_tao` datetime(6) DEFAULT NULL,
  `ngay_cap_nhat` datetime(6) DEFAULT NULL,
  `nguoi_dung_id` bigint NOT NULL,
  `oto_id` bigint NOT NULL,
  `diem_danh_gia` int NOT NULL,
  `binh_luan` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_nguoidung_oto_review` (`nguoi_dung_id`,`oto_id`),
  KEY `idx_danh_gia_oto_nd` (`nguoi_dung_id`),
  KEY `idx_danh_gia_oto_oto` (`oto_id`),
  CONSTRAINT `fk_danh_gia_oto_nguoi_dung` FOREIGN KEY (`nguoi_dung_id`) REFERENCES `nguoi_dung` (`id`),
  CONSTRAINT `fk_danh_gia_oto_oto` FOREIGN KEY (`oto_id`) REFERENCES `oto` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `danh_gia_oto`
--

LOCK TABLES `danh_gia_oto` WRITE;
/*!40000 ALTER TABLE `danh_gia_oto` DISABLE KEYS */;
/*!40000 ALTER TABLE `danh_gia_oto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dia_chi_khach_hang`
--

DROP TABLE IF EXISTS `dia_chi_khach_hang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dia_chi_khach_hang` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ngay_tao` datetime(6) DEFAULT NULL,
  `ngay_cap_nhat` datetime(6) DEFAULT NULL,
  `khach_hang_id` bigint NOT NULL,
  `ten_nguoi_nhan` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `so_dien_thoai` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tinh_thanh_id` int NOT NULL,
  `tinh_thanh_ten` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quan_huyen_id` int DEFAULT NULL,
  `quan_huyen_ten` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `xa_phuong_id` int DEFAULT NULL,
  `xa_phuong_ten` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dia_chi_chi_tiet` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `ghn_district_id` int DEFAULT NULL,
  `ghn_ward_code` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_default` bit(1) DEFAULT b'0',
  `is_deleted` bit(1) NOT NULL DEFAULT b'0',
  PRIMARY KEY (`id`),
  KEY `idx_dia_chi_khach_hang_kh` (`khach_hang_id`),
  CONSTRAINT `fk_dia_chi_khach_hang_kh` FOREIGN KEY (`khach_hang_id`) REFERENCES `khach_hang` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dia_chi_khach_hang`
--

LOCK TABLES `dia_chi_khach_hang` WRITE;
/*!40000 ALTER TABLE `dia_chi_khach_hang` DISABLE KEYS */;
INSERT INTO `dia_chi_khach_hang` VALUES (1,'2026-05-20 00:25:41.626182','2026-05-20 10:03:57.306265',2,'Đức Lê Văn','+84363490431',269,'Lào Cai',2171,'Huyện Mường Khương',80902,'Xã Bản Lầu','123 đường Lê Duẩn',2171,'80902',_binary '\0',_binary '\0'),(2,'2026-05-20 00:30:42.264868','2026-05-20 10:03:57.306265',2,'Nguyễn Thị Liên','0363898888',40,'Tỉnh Nghệ An',NULL,NULL,427,'Xã Trù Sơn, Huyện Đô Lương','xóm 1',427,'17707',_binary '',_binary '\0');
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
  `ngay_tao` datetime(6) DEFAULT NULL,
  `ngay_cap_nhat` datetime(6) DEFAULT NULL,
  `ten_dich_vu` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mo_ta` text COLLATE utf8mb4_unicode_ci,
  `gia` decimal(15,2) NOT NULL,
  `thoi_gian_uoc_tinh` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trang_thai` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dich_vu`
--

LOCK TABLES `dich_vu` WRITE;
/*!40000 ALTER TABLE `dich_vu` DISABLE KEYS */;
INSERT INTO `dich_vu` VALUES (1,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','Bảo dưỡng định kỳ 5.000 km','Gói bảo dưỡng định kỳ cơ bản gồm thay dầu máy, kiểm tra lọc gió, mực nước và hệ thống phanh.',950000.00,'90 phút',_binary ''),(2,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','Vệ sinh nội thất cơ bản','Vệ sinh khoang nội thất, hút bụi ghế, sàn, taplo và các vị trí sử dụng thường xuyên.',650000.00,'90 phút',_binary ''),(3,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','Vệ sinh khoang máy','Làm sạch chi tiết khoang máy bằng dung dịch chuyên dụng, hạn chế bám bẩn và mùi khó chịu.',950000.00,'75 phút',_binary ''),(4,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','Cân bằng động lốp','Cân bằng động 4 bánh xe, giảm rung lắc khi chạy tốc độ cao.',550000.00,'60 phút',_binary ''),(5,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','Kiểm tra hệ thống phanh','Kiểm tra hệ thống phanh, độ mòn bố thắng và tư vấn thay thế nếu cần.',350000.00,'45 phút',_binary ''),(6,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','Đánh bóng sơn xe 1 bước','Đánh bóng sơn xe 1 bước giúp xóa vết xoáy nhẹ và tăng độ bóng bề mặt.',1200000.00,'4 giờ',_binary ''),(7,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','Bảo dưỡng hệ thống điều hòa','Bảo dưỡng điều hòa gồm kiểm tra gas, vệ sinh giàn lạnh và dàn nóng cơ bản.',600000.00,'75 phút',_binary ''),(8,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','Vệ sinh kim phun và buồng đốt','Vệ sinh kim phun và buồng đốt cho động cơ xăng, cải thiện độ mượt khi vận hành.',1800000.00,'120 phút',_binary ''),(9,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','Phục hồi đèn pha bị ố','Đánh bóng đèn pha giúp đèn trong hơn và cải thiện độ sáng khi đi đêm.',1650000.00,'90 phút',_binary ''),(10,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','Combo thay lọc gió và vệ sinh hút gió','Thay lọc gió động cơ và lọc gió điều hòa kết hợp vệ sinh khoang hút gió.',1100000.00,'60 phút',_binary ''),(11,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','Dưỡng khoang máy chuyên sâu','Phủ dung dịch bảo vệ khoang máy và chi tiết nhựa cao su.',1300000.00,'120 phút',_binary ''),(12,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','Gói chăm sóc xe tổng thể','Phủ gói chăm sóc tổng thể gồm rửa xe, hút bụi, đánh bóng nhẹ và dưỡng nội thất.',2400000.00,'5 giờ',_binary '');
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
  `ngay_tao` datetime(6) DEFAULT NULL,
  `ngay_cap_nhat` datetime(6) DEFAULT NULL,
  `ma_don_hang` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `khach_hang_id` bigint NOT NULL,
  `nhan_vien_xu_ly_id` bigint DEFAULT NULL,
  `tong_tien` decimal(15,2) NOT NULL,
  `trang_thai` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ghi_chu` text COLLATE utf8mb4_unicode_ci,
  `dia_chi_giao_hang_id` bigint DEFAULT NULL,
  `phi_van_chuyen` decimal(15,2) DEFAULT NULL,
  `ma_don_hang_ghn` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kho_hang_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_don_hang_ma` (`ma_don_hang`),
  KEY `idx_don_hang_khach_hang` (`khach_hang_id`),
  KEY `idx_don_hang_nhan_vien` (`nhan_vien_xu_ly_id`),
  KEY `idx_don_hang_dia_chi` (`dia_chi_giao_hang_id`),
  KEY `idx_don_hang_kho` (`kho_hang_id`),
  CONSTRAINT `fk_don_hang_dia_chi` FOREIGN KEY (`dia_chi_giao_hang_id`) REFERENCES `dia_chi_khach_hang` (`id`),
  CONSTRAINT `fk_don_hang_khach_hang` FOREIGN KEY (`khach_hang_id`) REFERENCES `khach_hang` (`id`),
  CONSTRAINT `fk_don_hang_kho` FOREIGN KEY (`kho_hang_id`) REFERENCES `kho_hang` (`id`),
  CONSTRAINT `fk_don_hang_nhan_vien` FOREIGN KEY (`nhan_vien_xu_ly_id`) REFERENCES `nhan_vien` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `don_hang`
--

LOCK TABLES `don_hang` WRITE;
/*!40000 ALTER TABLE `don_hang` DISABLE KEYS */;
INSERT INTO `don_hang` VALUES (1,'2026-05-20 00:25:41.862891','2026-05-20 00:25:52.568858','DH-817261D2',2,NULL,2261500.00,'HOAN_THANH','Đóng hàng cẩn thận ',1,71500.00,NULL,NULL);
/*!40000 ALTER TABLE `don_hang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gio_hang`
--

DROP TABLE IF EXISTS `gio_hang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gio_hang` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ngay_tao` datetime(6) DEFAULT NULL,
  `ngay_cap_nhat` datetime(6) DEFAULT NULL,
  `khach_hang_id` bigint NOT NULL,
  `tong_tien` decimal(15,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_gio_hang_khach_hang` (`khach_hang_id`),
  CONSTRAINT `fk_gio_hang_khach_hang` FOREIGN KEY (`khach_hang_id`) REFERENCES `khach_hang` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gio_hang`
--

LOCK TABLES `gio_hang` WRITE;
/*!40000 ALTER TABLE `gio_hang` DISABLE KEYS */;
INSERT INTO `gio_hang` VALUES (1,'2026-05-20 00:25:15.733463','2026-05-20 09:40:32.714969',2,2190000.00);
/*!40000 ALTER TABLE `gio_hang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `khach_hang`
--

DROP TABLE IF EXISTS `khach_hang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `khach_hang` (
  `id` bigint NOT NULL,
  `diem_tich_luy` int DEFAULT '0',
  `hang_thanh_vien` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_khach_hang_nguoi_dung` FOREIGN KEY (`id`) REFERENCES `nguoi_dung` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `khach_hang`
--

LOCK TABLES `khach_hang` WRITE;
/*!40000 ALTER TABLE `khach_hang` DISABLE KEYS */;
INSERT INTO `khach_hang` VALUES (2,0,'DONG'),(3,0,'DONG');
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
  `ngay_tao` datetime(6) DEFAULT NULL,
  `ngay_cap_nhat` datetime(6) DEFAULT NULL,
  `khach_hang_id` bigint NOT NULL,
  `don_hang_id` bigint DEFAULT NULL,
  `tieu_de` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `noi_dung` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `trang_thai` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phan_hoi` text COLLATE utf8mb4_unicode_ci,
  `nhan_vien_xu_ly_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_khieu_nai_khach_hang` (`khach_hang_id`),
  KEY `idx_khieu_nai_don_hang` (`don_hang_id`),
  KEY `idx_khieu_nai_nhan_vien` (`nhan_vien_xu_ly_id`),
  CONSTRAINT `fk_khieu_nai_don_hang` FOREIGN KEY (`don_hang_id`) REFERENCES `don_hang` (`id`),
  CONSTRAINT `fk_khieu_nai_khach_hang` FOREIGN KEY (`khach_hang_id`) REFERENCES `khach_hang` (`id`),
  CONSTRAINT `fk_khieu_nai_nhan_vien` FOREIGN KEY (`nhan_vien_xu_ly_id`) REFERENCES `nhan_vien` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `khieu_nai`
--

LOCK TABLES `khieu_nai` WRITE;
/*!40000 ALTER TABLE `khieu_nai` DISABLE KEYS */;
INSERT INTO `khieu_nai` VALUES (1,'2026-05-20 00:26:25.180626','2026-05-20 00:40:59.532622',2,1,'Hàng bị hỏng','Đơn của tôi bị hỏng méo hàng','DA_GIAI_QUYET',NULL,NULL);
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
  `ngay_tao` datetime(6) DEFAULT NULL,
  `ngay_cap_nhat` datetime(6) DEFAULT NULL,
  `ten_kho` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nguoi_lien_he` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `so_dien_thoai` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tinh_thanh_id` int NOT NULL,
  `tinh_thanh_ten` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `xa_phuong_id` int DEFAULT NULL,
  `xa_phuong_ten` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dia_chi_chi_tiet` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `trang_thai` bit(1) NOT NULL DEFAULT b'1',
  `ghn_shop_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ghn_province_id` int DEFAULT NULL,
  `ghn_district_id` int DEFAULT NULL,
  `ghn_ward_code` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kho_hang`
--

LOCK TABLES `kho_hang` WRITE;
/*!40000 ALTER TABLE `kho_hang` DISABLE KEYS */;
INSERT INTO `kho_hang` VALUES (1,'2026-05-20 00:24:01.284968','2026-05-20 00:24:01.284968','Kho Đà Nẵng ','Anh Phạm Thành Nam','0323232323',0,'Thành Phố Đà Nẵng',NULL,'','khu 2 số 62 đường Lê Đức',_binary '',NULL,NULL,NULL,NULL),(2,'2026-05-20 00:24:35.351147','2026-05-20 00:24:35.351147','Kho Nghệ An ','Anh Lê Văn Đức','0363942032',0,'Nghệ An',NULL,'','Đô Lương Nghệ An',_binary '',NULL,NULL,NULL,NULL),(3,'2026-05-20 10:47:36.149561','2026-05-20 10:47:36.149561','Kho Hà Nội','Anh Nguyễn Văn Phú','0374827327',0,'Hà Nội',NULL,'','Yên Hòa, Cầu Giấy, Hà Nội',_binary '',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `kho_hang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lich_hen`
--

DROP TABLE IF EXISTS `lich_hen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lich_hen` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `loai_lich` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nguoi_dung_id` bigint DEFAULT NULL,
  `oto_id` bigint DEFAULT NULL,
  `dich_vu_id` bigint DEFAULT NULL,
  `kho_hang_id` bigint DEFAULT NULL,
  `ho_ten` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `so_dien_thoai` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ngay_hen` date DEFAULT NULL,
  `gio_hen` time DEFAULT NULL,
  `ghi_chu` text COLLATE utf8mb4_unicode_ci,
  `trang_thai` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ngay_tao` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_lich_hen_nguoi_dung` (`nguoi_dung_id`),
  KEY `idx_lich_hen_oto` (`oto_id`),
  KEY `idx_lich_hen_dich_vu` (`dich_vu_id`),
  KEY `idx_lich_hen_kho_hang` (`kho_hang_id`),
  CONSTRAINT `fk_lich_hen_dich_vu` FOREIGN KEY (`dich_vu_id`) REFERENCES `dich_vu` (`id`),
  CONSTRAINT `fk_lich_hen_kho_hang` FOREIGN KEY (`kho_hang_id`) REFERENCES `kho_hang` (`id`),
  CONSTRAINT `fk_lich_hen_nguoi_dung` FOREIGN KEY (`nguoi_dung_id`) REFERENCES `nguoi_dung` (`id`),
  CONSTRAINT `fk_lich_hen_oto` FOREIGN KEY (`oto_id`) REFERENCES `oto` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lich_hen`
--

LOCK TABLES `lich_hen` WRITE;
/*!40000 ALTER TABLE `lich_hen` DISABLE KEYS */;
INSERT INTO `lich_hen` VALUES (1,'DICH_VU',3,NULL,2,2,'Đức Lê Văn','+84363490411','levanduc0602003@gmail.com','2026-05-20','13:55:00','','DA_HOAN_THANH','2026-05-20 13:51:24.477341'),(2,'DICH_VU',3,NULL,2,2,'Đức Lê Văn','+84363490411','levanduc0602003@gmail.com','2026-05-20','17:24:00','ds','DA_HOAN_THANH','2026-05-20 17:24:19.572258');
/*!40000 ALTER TABLE `lich_hen` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `media`
--

DROP TABLE IF EXISTS `media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `media` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ngay_tao` datetime(6) DEFAULT NULL,
  `ngay_cap_nhat` datetime(6) DEFAULT NULL,
  `loai_media` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `loai_doi_tuong` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `doi_tuong_id` bigint NOT NULL,
  `url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `public_id` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mo_ta` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `thu_tu` int DEFAULT '0',
  `dung_luong` bigint DEFAULT NULL,
  `dinh_dang` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `chieu_rong` int DEFAULT NULL,
  `chieu_cao` int DEFAULT NULL,
  `thoi_luong` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_media_doi_tuong` (`loai_doi_tuong`,`doi_tuong_id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media`
--

LOCK TABLES `media` WRITE;
/*!40000 ALTER TABLE `media` DISABLE KEYS */;
INSERT INTO `media` VALUES (1,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','OTO',1,'/demo-images/cars/001-toyota-camry-2-5q.jpg','demo/oto/1','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(2,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','OTO',14,'/demo-images/cars/006-vinfast-vf8-plus.jpg','demo/oto/6','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(3,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','OTO',13,'/demo-images/cars/009-mitsubishi-xpander-cross.jpg','demo/oto/9','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(4,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','OTO',5,'/demo-images/cars/010-toyota-fortuner-legender.jpg','demo/oto/10','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(5,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','OTO',2,'/demo-images/cars/012-toyota-corolla-cross-1-8v.jpg','demo/oto/12','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(6,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','OTO',3,'/demo-images/cars/013-toyota-corolla-cross-1-8hev.jpg','demo/oto/13','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(7,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','OTO',4,'/demo-images/cars/016-toyota-vios-g-cvt.jpg','demo/oto/16','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(8,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','OTO',5,'/demo-images/cars/017-toyota-fortuner-legender-2-4at-4x2.jpg','demo/oto/17','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(9,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','OTO',6,'/demo-images/cars/018-honda-city-rs.jpg','demo/oto/18','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(10,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','OTO',7,'/demo-images/cars/020-honda-hr-v-l.jpg','demo/oto/20','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(11,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','OTO',8,'/demo-images/cars/021-honda-cr-v-e-hev-rs.jpeg','demo/oto/21','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(12,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','OTO',9,'/demo-images/cars/024-mazda-cx-5-2-5-signature-sport.jpg','demo/oto/24','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(13,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','OTO',10,'/demo-images/cars/027-hyundai-tucson-2-0-xang-dac-biet.jpg','demo/oto/27','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(14,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','OTO',11,'/demo-images/cars/030-kia-carnival-3-5g-premium.webp','demo/oto/30','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(15,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','OTO',12,'/demo-images/cars/032-ford-everest-titanium-2-0l-4x4-at.jpg','demo/oto/32','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(16,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','OTO',14,'/demo-images/cars/034-vinfast-vf-8-plus.jpg','demo/oto/34','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(17,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','OTO',15,'/demo-images/cars/036-honda-civic-g.jpg','demo/oto/36','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(18,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','OTO',16,'/demo-images/cars/037-honda-hr-v-g.jpg','demo/oto/37','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(19,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','OTO',17,'/demo-images/cars/047-vinfast-vf-6-plus.jpeg','demo/oto/47','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(20,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','OTO',18,'/demo-images/cars/048-vinfast-vf-7-plus.webp','demo/oto/48','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(21,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','OTO',19,'/demo-images/cars/049-toyota-raize-turbo.jpg','demo/oto/49','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(22,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','PHU_KIEN',6,'/demo-images/accessories/006-th-m-l-t-s-n-3d-toyota-camry.jpg','demo/phu_kien/6','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(23,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','PHU_KIEN',10,'/demo-images/accessories/009-b-nh-c-quy-gs-55ah-12v.jpg','demo/phu_kien/9','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(24,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','PHU_KIEN',1,'/demo-images/accessories/011-camera-hanh-trinh-70mai-a500s.jpg','demo/phu_kien/11','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(25,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','PHU_KIEN',2,'/demo-images/accessories/012-camera-hanh-trinh-vietmap-c61-pro.jpg','demo/phu_kien/12','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(26,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','PHU_KIEN',3,'/demo-images/accessories/013-man-hinh-android-zestech-zx10.jpeg','demo/phu_kien/13','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(27,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','PHU_KIEN',4,'/demo-images/accessories/015-camera-lui-icar-elliview-s3.jpg','demo/phu_kien/15','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(28,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','PHU_KIEN',5,'/demo-images/accessories/018-lop-bridgestone-turanza-t005a-225-50r18.png','demo/phu_kien/18','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(29,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','PHU_KIEN',6,'/demo-images/accessories/022-tham-lot-san-5d-sedan-hang-c.jpg','demo/phu_kien/22','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(30,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','PHU_KIEN',7,'/demo-images/accessories/026-tui-treo-lung-ghe-da-nang.png','demo/phu_kien/26','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(31,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','PHU_KIEN',8,'/demo-images/accessories/029-bo-khan-microfiber-3m-3-chiec.jpg','demo/phu_kien/29','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(32,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','PHU_KIEN',9,'/demo-images/accessories/030-may-bom-lop-mini-xiaomi-portable-air-pump.png','demo/phu_kien/30','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(33,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','PHU_KIEN',11,'/demo-images/accessories/034-den-led-philips-ultinon-pro6000-h11.jpg','demo/phu_kien/34','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(34,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','PHU_KIEN',12,'/demo-images/accessories/035-nuoc-hoa-xe-hoi-kieu-kep-cua-gio.jpg','demo/phu_kien/35','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(35,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','PHU_KIEN',13,'/demo-images/accessories/039-tam-lot-cop-xe-chong-tham-suv-hang-c.jpg','demo/phu_kien/39','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(36,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','PHU_KIEN',14,'/demo-images/accessories/040-moc-treo-do-sau-ghe-hop-kim-2-chiec.jpg','demo/phu_kien/40','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(37,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','PHU_KIEN',15,'/demo-images/accessories/050-hop-de-do-noc-xe-thule-ocean-100.jpg','demo/phu_kien/50','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(38,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','PHU_KIEN',16,'/demo-images/accessories/054-cap-loa-pioneer-2-duong-tieng.jpg','demo/phu_kien/54','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(39,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','PHU_KIEN',17,'/demo-images/accessories/055-loa-sub-gam-ghe-jbl-basspro-sl2.png','demo/phu_kien/55','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(40,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','PHU_KIEN',18,'/demo-images/accessories/059-bat-chong-loa-taplo-da-nang.jpg','demo/phu_kien/59','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(41,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','DICH_VU',1,'/demo-images/services/001-bao-duong-dinh-ky-5-000-km.jpg','demo/dich_vu/1','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(42,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','DICH_VU',2,'/demo-images/services/004-ve-sinh-noi-that-co-ban.jpeg','demo/dich_vu/4','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(43,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','DICH_VU',3,'/demo-images/services/005-ve-sinh-khoang-may.jpg','demo/dich_vu/5','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(44,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','DICH_VU',4,'/demo-images/services/008-can-bang-dong-lop.jpg','demo/dich_vu/8','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(45,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','DICH_VU',5,'/demo-images/services/009-kiem-tra-he-thong-phanh.jpg','demo/dich_vu/9','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(46,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','DICH_VU',6,'/demo-images/services/010-danh-bong-son-xe-1-buoc.jpg','demo/dich_vu/10','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(47,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','DICH_VU',7,'/demo-images/services/012-bao-duong-he-thong-dieu-hoa.jpg','demo/dich_vu/12','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(48,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','DICH_VU',8,'/demo-images/services/015-ve-sinh-kim-phun-va-buong-dot.jpg','demo/dich_vu/15','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(49,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','DICH_VU',9,'/demo-images/services/020-phuc-hoi-den-pha-bi-o.jpg','demo/dich_vu/20','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(50,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','DICH_VU',10,'/demo-images/services/022-combo-thay-loc-gio-va-ve-sinh-hut-gio.jpeg','demo/dich_vu/22','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(51,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','DICH_VU',11,'/demo-images/services/023-duong-khoang-may-chuyen-sau.jpg','demo/dich_vu/23','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(52,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','IMAGE','DICH_VU',12,'/demo-images/services/025-goi-cham-soc-xe-tong-the.jpg','demo/dich_vu/25','Local demo image',1,NULL,NULL,NULL,NULL,NULL),(53,'2026-05-20 00:26:30.408249','2026-05-20 00:26:30.408249','IMAGE','KHIEU_NAI',1,'https://res.cloudinary.com/dlrhrn29k/image/upload/v1779211589/carshop/khieu_nai/1/cz6ezqy6mow3kkubfiuk.png','carshop/khieu_nai/1/cz6ezqy6mow3kkubfiuk',NULL,0,232412,'png',800,450,NULL),(54,'2026-05-20 11:21:50.229924','2026-05-20 11:21:50.229924','IMAGE','OTO',1,'https://res.cloudinary.com/dlrhrn29k/image/upload/v1779250909/carshop/oto/1/mhqsotwh3cyeysfnrhoi.png','carshop/oto/1/mhqsotwh3cyeysfnrhoi',NULL,1,232412,'png',800,450,NULL);
/*!40000 ALTER TABLE `media` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nguoi_dung`
--

DROP TABLE IF EXISTS `nguoi_dung`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nguoi_dung` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ngay_tao` datetime(6) DEFAULT NULL,
  `ngay_cap_nhat` datetime(6) DEFAULT NULL,
  `loai_nguoi_dung` varchar(31) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ho_ten` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mat_khau` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `so_dien_thoai` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dia_chi` text COLLATE utf8mb4_unicode_ci,
  `anh_dai_dien` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vai_tro` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `trang_thai` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_nguoi_dung_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nguoi_dung`
--

LOCK TABLES `nguoi_dung` WRITE;
/*!40000 ALTER TABLE `nguoi_dung` DISABLE KEYS */;
INSERT INTO `nguoi_dung` VALUES (1,'2026-05-20 00:15:32.482264','2026-05-20 00:15:32.482264','NguoiDung','Admin','admin@carshop.com','$2a$10$7.TpToOSH1yIO7BSmo.t4OtXTQ0584e5uGQhRbJXIQMXu7kadBDZm',NULL,NULL,NULL,'ADMIN',_binary ''),(2,'2026-05-20 00:16:32.663765','2026-05-20 00:16:32.663765','KHACH_HANG','Đức Lê Văn','levanduc06022003@gmail.com','$2a$10$ZJeh.xVUcLJlTxrW1yo/8Oh8/SpINBvvq3iaMbqjEJwdA2xObA5/K','+84363490431',NULL,NULL,'KHACH_HANG',_binary ''),(3,'2026-05-20 10:10:16.193945','2026-05-20 10:10:16.193945','KHACH_HANG','Đức Lê Văn','levanduc0602003@gmail.com','$2a$10$JwuVTqqYYI4Fx8rRZQI/G.9OYN4CTp5pT1IHqiX903ZguAHrbYCJ2','+84363490411',NULL,NULL,'KHACH_HANG',_binary '');
/*!40000 ALTER TABLE `nguoi_dung` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nhan_vien`
--

DROP TABLE IF EXISTS `nhan_vien`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nhan_vien` (
  `id` bigint NOT NULL,
  `ma_nhan_vien` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `chuc_vu` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phong_ban` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `luong` decimal(15,2) DEFAULT NULL,
  `ngay_vao_lam` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_nhan_vien_ma` (`ma_nhan_vien`),
  CONSTRAINT `fk_nhan_vien_nguoi_dung` FOREIGN KEY (`id`) REFERENCES `nguoi_dung` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nhan_vien`
--

LOCK TABLES `nhan_vien` WRITE;
/*!40000 ALTER TABLE `nhan_vien` DISABLE KEYS */;
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
  `ngay_tao` datetime(6) DEFAULT NULL,
  `ngay_cap_nhat` datetime(6) DEFAULT NULL,
  `ten_xe` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hang_xe` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dong_xe` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nam_san_xuat` int DEFAULT NULL,
  `mau_sac` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dong_co` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hop_so` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nhien_lieu` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `so_km` int DEFAULT NULL,
  `gia` decimal(15,2) NOT NULL,
  `so_luong` int DEFAULT NULL,
  `mo_ta` text COLLATE utf8mb4_unicode_ci,
  `trang_thai` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oto`
--

LOCK TABLES `oto` WRITE;
/*!40000 ALTER TABLE `oto` DISABLE KEYS */;
INSERT INTO `oto` VALUES (1,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','Toyota Camry 2.5HEV Q','Toyota','Camry',2025,'Đen','2.5L Hybrid','CVT','Xăng + Điện',0,1460000000.00,2,'Sedan hạng D, nội thất rộng, nhiều công nghệ an toàn, phù hợp đi gia đình và doanh nhân.','DANG_BAN'),(2,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','Toyota Corolla Cross 1.8V','Toyota','Corolla Cross',2025,'Trắng ngọc trai','1.8L','CVT','Xăng',0,820000000.00,3,'SUV đô thị 5 chỗ, vận hành dễ chịu, tiết kiệm nhiên liệu, phù hợp nhu cầu đi lại hằng ngày.','DANG_BAN'),(3,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','Toyota Corolla Cross 1.8HEV','Toyota','Corolla Cross',2025,'Đỏ','1.8L Hybrid','CVT','Xăng + Điện',0,865000000.00,2,'Bản hybrid của Corolla Cross, thiết kế hiện đại, trang bị an toàn đầy đủ và tiết kiệm xăng.','DANG_BAN'),(4,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','Toyota Vios G CVT','Toyota','Vios',2024,'Trắng','1.5L','CVT','Xăng',0,545000000.00,5,'Sedan hạng B phổ biến, bền bỉ, dễ bảo dưỡng và chi phí sử dụng hợp lý cho gia đình nhỏ.','DANG_BAN'),(5,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','Toyota Fortuner Legender 2.4AT 4x2','Toyota','Fortuner',2025,'Xám','2.4L Diesel','AT 6 cấp','Dầu',0,1185000000.00,2,'SUV 7 chỗ khung rời, máy dầu, phù hợp đi đường dài và nhu cầu gia đình đông người.','DANG_BAN'),(6,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','Honda City RS','Honda','City',2025,'Đỏ','1.5L','CVT','Xăng',0,569000000.00,4,'Sedan hạng B có Honda SENSING, không gian rộng, lái linh hoạt và mức giá dễ tiếp cận.','DANG_BAN'),(7,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','Honda HR-V L','Honda','HR-V',2025,'Vàng cát','1.5L Turbo','CVT','Xăng',0,826000000.00,3,'SUV hạng B thiết kế trẻ trung, nội thất thông minh, cân bằng giữa giá và trang bị.','DANG_BAN'),(8,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','Honda CR-V e:HEV RS','Honda','CR-V',2025,'Đỏ đô','2.0L Hybrid','e-CVT','Xăng + Điện',0,1259000000.00,2,'SUV 5+2 chỗ, vận hành êm, nội thất cao cấp, có bản hybrid và nhiều công nghệ an toàn.','DANG_BAN'),(9,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','Mazda CX-5 2.5 Signature Sport','Mazda','CX-5',2025,'Trắng','2.5L','AT 6 cấp','Xăng',0,959000000.00,4,'SUV hạng C được ưa chuộng nhờ cách âm tốt, nội thất đẹp và lái dễ điều khiển.','DANG_BAN'),(10,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','Hyundai Tucson 2.0 Xăng Đặc biệt','Hyundai','Tucson',2025,'Đen','2.0L','AT 6 cấp','Xăng',0,989000000.00,3,'SUV hạng C thiết kế sắc nét, nội thất hiện đại, phù hợp người dùng trẻ và gia đình.','DANG_BAN'),(11,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','Kia Carnival 3.5G Premium','Kia','Carnival',2025,'Xám xi măng','3.5L V6','AT 8 cấp','Xăng',0,1589000000.00,2,'MPV cao cấp rộng rãi, ghế sau thoải mái, phù hợp gia đình đông người và đón khách.','DANG_BAN'),(12,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','Ford Everest Titanium+ 2.0L 4x4 AT','Ford','Everest',2025,'Đen','2.0L Turbo Diesel','AT 10 cấp','Dầu',0,1468000000.00,2,'SUV 7 chỗ mạnh mẽ, đi đường dài ổn định, cách âm tốt và nhiều tính năng hỗ trợ lái.','DANG_BAN'),(13,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','Mitsubishi Xpander Cross','Mitsubishi','Xpander Cross',2025,'Trắng','1.5L MIVEC','CVT','Xăng',0,703000000.00,4,'MPV lai SUV, khoảng sáng gầm cao, rộng rãi và được ưa chuộng trong nhóm gia đình trẻ.','DANG_BAN'),(14,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','VinFast VF 8 Plus','VinFast','VF 8',2025,'Xanh navy','87.7 kWh','1 cấp','Điện',0,1179000000.00,2,'SUV điện có khoang cabin rộng, màn hình lớn, phù hợp người dùng cần xe điện gia đình.','DANG_BAN'),(15,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','Honda Civic G','Honda','Civic',2025,'Đen ánh','2.0L','CVT','Xăng',0,789000000.00,3,'Sedan hạng C thiết kế trẻ, khung gầm chắc chắn và khả năng vận hành cân bằng.','DANG_BAN'),(16,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','Honda HR-V G','Honda','HR-V',2025,'Xám','1.5L','CVT','Xăng',0,699000000.00,3,'SUV đô thị gọn gàng, trang bị an toàn cơ bản và phù hợp người mua xe lần đầu.','DANG_BAN'),(17,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','VinFast VF 6 Plus','VinFast','VF 6',2025,'Đỏ','Electric','1 cấp','Điện',0,689000000.00,4,'SUV điện đô thị có kích thước gọn, giao diện điều khiển hiện đại và chi phí vận hành thấp.','DANG_BAN'),(18,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','VinFast VF 7 Plus','VinFast','VF 7',2025,'Trắng','Electric','1 cấp','Điện',0,999000000.00,3,'SUV điện thiết kế cá tính, khoang cabin rộng và màn hình giải trí lớn.','DANG_BAN'),(19,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','Toyota Raize Turbo','Toyota','Raize',2024,'Vàng cát','1.2L Turbo','CVT','Xăng',0,552000000.00,4,'SUV hạng A gọn nhẹ, dễ xoay trở và phù hợp đường phố đông đúc.','DANG_BAN');
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
  `ngay_tao` datetime(6) DEFAULT NULL,
  `ngay_cap_nhat` datetime(6) DEFAULT NULL,
  `khach_hang_id` bigint NOT NULL,
  `nhan_vien_id` bigint DEFAULT NULL,
  `trang_thai` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ngay_ket_thuc` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_phien_chat_kh` (`khach_hang_id`),
  KEY `idx_phien_chat_nv` (`nhan_vien_id`),
  CONSTRAINT `fk_phien_chat_khach_hang` FOREIGN KEY (`khach_hang_id`) REFERENCES `khach_hang` (`id`),
  CONSTRAINT `fk_phien_chat_nhan_vien` FOREIGN KEY (`nhan_vien_id`) REFERENCES `nhan_vien` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `ngay_tao` datetime(6) DEFAULT NULL,
  `ngay_cap_nhat` datetime(6) DEFAULT NULL,
  `ten_phu_kien` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `loai_phu_kien` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hang_san_xuat` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gia` decimal(15,2) NOT NULL,
  `so_luong` int DEFAULT '0',
  `trong_luong` int DEFAULT '500',
  `mo_ta` text COLLATE utf8mb4_unicode_ci,
  `trang_thai` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phu_kien`
--

LOCK TABLES `phu_kien` WRITE;
/*!40000 ALTER TABLE `phu_kien` DISABLE KEYS */;
INSERT INTO `phu_kien` VALUES (1,'2026-05-20 00:14:39.000000','2026-05-20 00:24:56.030997','Camera hành trình 70mai A500S','Camera hành trình','70mai',3290000.00,12,450,'Camera trước sau, ghi hình 2K, hỗ trợ ADAS và kết nối app.',_binary ''),(2,'2026-05-20 00:14:39.000000','2026-05-20 00:25:41.882796','Camera hành trình Vietmap C61 Pro','Camera hành trình','Vietmap',2190000.00,7,420,'Camera Full HD, cảnh báo giao thông cơ bản, phù hợp xe gia đình.',_binary ''),(3,'2026-05-20 00:14:39.000000','2026-05-20 10:45:29.888351','Màn hình Android Zestech ZX10','Màn hình Android','Zestech',8990000.00,4,1800,'Màn hình Android cho xe, kết nối camera, bản đồ và giải trí đa phương tiện.',_binary ''),(4,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','Camera lùi ICAR Elliview S3','Camera lùi','ICAR',1490000.00,45,300,'Camera lùi góc rộng, chất lượng hình ảnh rõ nét và dễ lắp đặt.',_binary ''),(5,'2026-05-20 00:14:39.000000','2026-05-20 10:45:38.585017','Lốp Bridgestone Turanza T005A 225/50R18','Lốp xe','Bridgestone',2350000.00,7,10100,'Lốp xe phổ thông dành cho sedan và CUV, khả năng êm ái và bền bỉ.',_binary ''),(6,'2026-05-20 00:14:39.000000','2026-05-20 12:06:01.539172','Thảm lót sàn 5D sedan hạng C','Thảm lót sàn','Michelin',1490000.00,8,3200,'Thảm lót sàn 5D, dễ vệ sinh, ôm sát form xe và giữ khoang nội thất sạch.',_binary ''),(7,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','Túi treo lưng ghế đa năng','Túi treo đồ','OEM',249000.00,90,280,'Túi treo sau ghế để đựng khăn giấy, máy tính bảng và vật dụng nhỏ.',_binary ''),(8,'2026-05-20 00:14:39.000000','2026-05-20 12:06:12.971882','Bộ khăn microfiber 3M 3 chiếc','Chăm sóc xe','3M',289000.00,7,250,'Bộ khăn microfiber mềm, phù hợp lau sơn xe và nội thất.',_binary ''),(9,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','Máy bơm lốp mini Xiaomi Portable Air Pump','Bơm lốp mini','Xiaomi',990000.00,55,700,'Máy bơm lốp mini có màn hình điện tử, dùng cho ô tô và xe máy.',_binary ''),(10,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','Ắc quy GS MF DIN45L 12V','Ắc quy','GS Battery',1890000.00,20,14500,'Ắc quy dành cho sedan và CUV, dòng khởi động ổn định.',_binary ''),(11,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','Đèn LED Philips Ultinon Pro6000 H11','Đèn LED','Philips',1390000.00,40,220,'Bóng đèn LED tăng sáng, màu ánh sáng trắng và tiết kiệm điện.',_binary ''),(12,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','Nước hoa xe hơi kiểu kẹp cửa gió','Nước hoa xe hơi','OEM',299000.00,120,180,'Nước hoa xe hơi mùi fresh linen, thiết kế gọn đẹp.',_binary ''),(13,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','Tấm lót cốp xe chống thấm SUV hạng C','Lót cốp xe','OEM',259000.00,80,1300,'Tấm lót cốp xe chống thấm nước, dễ xếp đồ và dễ vệ sinh.',_binary ''),(14,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','Móc treo đồ sau ghế hợp kim 2 chiếc','Móc treo','OEM',189000.00,160,140,'Móc treo đồ sau ghế, đựng túi xách và vật dụng nhỏ gọn gàng.',_binary ''),(15,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','Hộp để đồ nóc xe Thule Ocean 100','Hộp để đồ','Thule',2790000.00,8,14500,'Hộp để đồ trên nóc xe phù hợp chuyến đi xa và du lịch gia đình.',_binary ''),(16,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','Cặp loa Pioneer 2 đường tiếng','Loa xe hơi','Pioneer',1290000.00,20,2100,'Cặp loa cơ bản nâng cấp âm thanh khoang cabin.',_binary ''),(17,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','Loa sub gầm ghế JBL BassPro SL2','Loa sub','JBL',3290000.00,12,5400,'Loa sub gầm ghế giúp tăng âm trầm cho hệ thống giải trí trên xe.',_binary ''),(18,'2026-05-20 00:14:39.000000','2026-05-20 00:14:39.000000','Bạt chống lóa taplo đa năng','Bạt chống lóa','OEM',269000.00,70,500,'Bạt chống lóa nội thất chống bụi và nếp dán để lắp nhanh.',_binary '');
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
  `ngay_tao` datetime(6) DEFAULT NULL,
  `ngay_cap_nhat` datetime(6) DEFAULT NULL,
  `don_hang_id` bigint NOT NULL,
  `so_tien` decimal(15,2) NOT NULL,
  `phuong_thuc` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ma_giao_dich` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trang_thai` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `noi_dung` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `url_thanh_toan` text COLLATE utf8mb4_unicode_ci,
  `du_lieu_phan_hoi` text COLLATE utf8mb4_unicode_ci,
  `ngay_thanh_toan` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_thanh_toan_don_hang` (`don_hang_id`),
  CONSTRAINT `fk_thanh_toan_don_hang` FOREIGN KEY (`don_hang_id`) REFERENCES `don_hang` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thanh_toan`
--

LOCK TABLES `thanh_toan` WRITE;
/*!40000 ALTER TABLE `thanh_toan` DISABLE KEYS */;
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
  `ngay_tao` datetime(6) DEFAULT NULL,
  `ngay_cap_nhat` datetime(6) DEFAULT NULL,
  `phien_chat_id` bigint NOT NULL,
  `nguoi_gui_id` bigint NOT NULL,
  `noi_dung` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `loai_tin_nhan` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `da_doc` bit(1) NOT NULL DEFAULT b'0',
  `ngay_gui` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_tin_nhan_phien_chat` (`phien_chat_id`),
  KEY `idx_tin_nhan_nguoi_gui` (`nguoi_gui_id`),
  CONSTRAINT `fk_tin_nhan_nguoi_gui` FOREIGN KEY (`nguoi_gui_id`) REFERENCES `nguoi_dung` (`id`),
  CONSTRAINT `fk_tin_nhan_phien_chat` FOREIGN KEY (`phien_chat_id`) REFERENCES `phien_chat` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tin_nhan`
--

LOCK TABLES `tin_nhan` WRITE;
/*!40000 ALTER TABLE `tin_nhan` DISABLE KEYS */;
/*!40000 ALTER TABLE `tin_nhan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ton_kho`
--

DROP TABLE IF EXISTS `ton_kho`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ton_kho` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ngay_tao` datetime(6) DEFAULT NULL,
  `ngay_cap_nhat` datetime(6) DEFAULT NULL,
  `phu_kien_id` bigint NOT NULL,
  `kho_hang_id` bigint NOT NULL,
  `so_luong` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_ton_kho_phu_kien_kho` (`phu_kien_id`,`kho_hang_id`),
  UNIQUE KEY `UKmjhwr68i087kuw99ikfmi70v0` (`phu_kien_id`,`kho_hang_id`),
  KEY `idx_ton_kho_kho` (`kho_hang_id`),
  CONSTRAINT `fk_ton_kho_kho_hang` FOREIGN KEY (`kho_hang_id`) REFERENCES `kho_hang` (`id`),
  CONSTRAINT `fk_ton_kho_phu_kien` FOREIGN KEY (`phu_kien_id`) REFERENCES `phu_kien` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ton_kho`
--

LOCK TABLES `ton_kho` WRITE;
/*!40000 ALTER TABLE `ton_kho` DISABLE KEYS */;
INSERT INTO `ton_kho` VALUES (1,'2026-05-20 00:24:55.994040','2026-05-20 00:24:55.994040',1,1,7),(2,'2026-05-20 00:24:56.024393','2026-05-20 00:24:56.024393',1,2,5),(3,'2026-05-20 00:25:11.762961','2026-05-20 00:25:41.873527',2,1,3),(4,'2026-05-20 00:25:11.778995','2026-05-20 00:25:11.778995',2,2,4),(5,'2026-05-20 10:45:22.634242','2026-05-20 10:45:22.634242',6,1,3),(6,'2026-05-20 10:45:22.658252','2026-05-20 10:45:22.658252',6,2,3),(7,'2026-05-20 10:45:29.864806','2026-05-20 10:45:29.864806',3,1,2),(8,'2026-05-20 10:45:29.888351','2026-05-20 10:45:29.888351',3,2,2),(9,'2026-05-20 10:45:38.564809','2026-05-20 10:45:38.564809',5,1,4),(10,'2026-05-20 10:45:38.585017','2026-05-20 10:45:38.585017',5,2,3),(11,'2026-05-20 12:06:01.528234','2026-05-20 12:06:01.528234',6,3,2),(12,'2026-05-20 12:06:12.937621','2026-05-20 12:06:12.937621',8,1,3),(13,'2026-05-20 12:06:12.953595','2026-05-20 12:06:12.953595',8,2,2),(14,'2026-05-20 12:06:12.971882','2026-05-20 12:06:12.971882',8,3,2);
/*!40000 ALTER TABLE `ton_kho` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-20 18:36:51
