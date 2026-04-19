-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: carshop_db
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chi_tiet_don_hang`
--

LOCK TABLES `chi_tiet_don_hang` WRITE;
/*!40000 ALTER TABLE `chi_tiet_don_hang` DISABLE KEYS */;
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
  `ghn_district_id` int DEFAULT NULL,
  `ghn_ward_code` varchar(20) DEFAULT NULL,
  `is_default` bit(1) DEFAULT NULL,
  `so_dien_thoai` varchar(15) NOT NULL,
  `ten_nguoi_nhan` varchar(100) NOT NULL,
  `tinh_thanh_id` int NOT NULL,
  `tinh_thanh_ten` varchar(100) NOT NULL,
  `xa_phuong_id` int DEFAULT NULL,
  `xa_phuong_ten` varchar(100) DEFAULT NULL,
  `khach_hang_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK2mxf2qa1ern5h64biueqov64m` (`khach_hang_id`),
  CONSTRAINT `FK2mxf2qa1ern5h64biueqov64m` FOREIGN KEY (`khach_hang_id`) REFERENCES `khach_hang` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dia_chi_khach_hang`
--

LOCK TABLES `dia_chi_khach_hang` WRITE;
/*!40000 ALTER TABLE `dia_chi_khach_hang` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `don_hang`
--

LOCK TABLES `don_hang` WRITE;
/*!40000 ALTER TABLE `don_hang` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kho_hang`
--

LOCK TABLES `kho_hang` WRITE;
/*!40000 ALTER TABLE `kho_hang` DISABLE KEYS */;
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
  `loai_doi_tuong` enum('DICH_VU','OTO','PHU_KIEN') NOT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nguoi_dung`
--

LOCK TABLES `nguoi_dung` WRITE;
/*!40000 ALTER TABLE `nguoi_dung` DISABLE KEYS */;
INSERT INTO `nguoi_dung` VALUES ('NguoiDung',1,'2026-04-18 11:45:02.446367','2026-04-18 11:45:02.446367',NULL,NULL,'admin@carshop.com','Admin','$2a$10$/kG7euyinNGEt2zafXUgb.s8YrZTIFA/QHoU1yCqstc5S.M6lmPEu',NULL,_binary '','ADMIN');
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oto`
--

LOCK TABLES `oto` WRITE;
/*!40000 ALTER TABLE `oto` DISABLE KEYS */;
INSERT INTO `oto` VALUES (2,'2026-04-19 11:46:50.173245','2026-04-19 11:45:38.347462','2.5L V4','Camry',1350000000.00,'Toyota','Tự động','Đen','Xe đã sửa thông tin',2025,'Xăng',100,3,'Toyota Camry 2025 - Updated','DANG_BAN');
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phu_kien`
--

LOCK TABLES `phu_kien` WRITE;
/*!40000 ALTER TABLE `phu_kien` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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

-- Dump completed on 2026-04-19 14:21:08
