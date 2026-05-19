-- ============================================================
-- CarShop Database Schema
-- Auto-generated from JPA entities
-- MySQL 8.x / InnoDB / utf8mb4
--
-- HUONG DAN:
--   1. Mo MySQL Workbench (hoac mysql CLI)
--   2. Chay TOAN BO file nay -> tao database + tat ca bang
--   3. Sau do chay seed_data_lamthanhduc.sql de co du lieu mau
-- ============================================================

DROP DATABASE IF EXISTS `carshop_db`;
CREATE DATABASE `carshop_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `carshop_db`;

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- DROP TABLES (reverse dependency order)
-- ============================================================
DROP TABLE IF EXISTS `tin_nhan`;
DROP TABLE IF EXISTS `phien_chat`;
DROP TABLE IF EXISTS `media`;
DROP TABLE IF EXISTS `danh_gia_oto`;
DROP TABLE IF EXISTS `danh_gia`;
DROP TABLE IF EXISTS `khieu_nai`;
DROP TABLE IF EXISTS `thanh_toan`;
DROP TABLE IF EXISTS `chi_tiet_don_hang`;
DROP TABLE IF EXISTS `don_hang`;
DROP TABLE IF EXISTS `chi_tiet_gio_hang`;
DROP TABLE IF EXISTS `gio_hang`;
DROP TABLE IF EXISTS `lich_hen`;
DROP TABLE IF EXISTS `ton_kho`;
DROP TABLE IF EXISTS `dia_chi_khach_hang`;
DROP TABLE IF EXISTS `khach_hang`;
DROP TABLE IF EXISTS `nhan_vien`;
DROP TABLE IF EXISTS `nguoi_dung`;
DROP TABLE IF EXISTS `oto`;
DROP TABLE IF EXISTS `phu_kien`;
DROP TABLE IF EXISTS `dich_vu`;
DROP TABLE IF EXISTS `kho_hang`;

-- ============================================================
-- BASE / INDEPENDENT TABLES
-- ============================================================

-- ---------- nguoi_dung (JOINED inheritance parent) ----------
CREATE TABLE `nguoi_dung` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `ngay_tao` DATETIME(6) NULL,
  `ngay_cap_nhat` DATETIME(6) NULL,
  `loai_nguoi_dung` VARCHAR(31) NOT NULL,
  `ho_ten` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `mat_khau` VARCHAR(255) NOT NULL,
  `so_dien_thoai` VARCHAR(15) NULL,
  `dia_chi` TEXT NULL,
  `anh_dai_dien` VARCHAR(255) NULL,
  `vai_tro` VARCHAR(50) NOT NULL,
  `trang_thai` BIT(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_nguoi_dung_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- kho_hang ----------
CREATE TABLE `kho_hang` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `ngay_tao` DATETIME(6) NULL,
  `ngay_cap_nhat` DATETIME(6) NULL,
  `ten_kho` VARCHAR(100) NOT NULL,
  `nguoi_lien_he` VARCHAR(100) NULL,
  `so_dien_thoai` VARCHAR(15) NOT NULL,
  `tinh_thanh_id` INT NOT NULL,
  `tinh_thanh_ten` VARCHAR(100) NOT NULL,
  `xa_phuong_id` INT NULL,
  `xa_phuong_ten` VARCHAR(100) NULL,
  `dia_chi_chi_tiet` TEXT NOT NULL,
  `trang_thai` BIT(1) NOT NULL DEFAULT b'1',
  `ghn_shop_id` VARCHAR(50) NULL,
  `ghn_province_id` INT NULL,
  `ghn_district_id` INT NULL,
  `ghn_ward_code` VARCHAR(20) NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- oto ----------
CREATE TABLE `oto` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `ngay_tao` DATETIME(6) NULL,
  `ngay_cap_nhat` DATETIME(6) NULL,
  `ten_xe` VARCHAR(200) NOT NULL,
  `hang_xe` VARCHAR(100) NOT NULL,
  `dong_xe` VARCHAR(100) NULL,
  `nam_san_xuat` INT NULL,
  `mau_sac` VARCHAR(50) NULL,
  `dong_co` VARCHAR(100) NULL,
  `hop_so` VARCHAR(50) NULL,
  `nhien_lieu` VARCHAR(50) NULL,
  `so_km` INT NULL,
  `gia` DECIMAL(15,2) NOT NULL,
  `so_luong` INT NULL,
  `mo_ta` TEXT NULL,
  `trang_thai` VARCHAR(50) NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- phu_kien ----------
CREATE TABLE `phu_kien` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `ngay_tao` DATETIME(6) NULL,
  `ngay_cap_nhat` DATETIME(6) NULL,
  `ten_phu_kien` VARCHAR(200) NOT NULL,
  `loai_phu_kien` VARCHAR(100) NULL,
  `hang_san_xuat` VARCHAR(100) NULL,
  `gia` DECIMAL(15,2) NOT NULL,
  `so_luong` INT NULL DEFAULT 0,
  `trong_luong` INT NULL DEFAULT 500,
  `mo_ta` TEXT NULL,
  `trang_thai` BIT(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- dich_vu ----------
CREATE TABLE `dich_vu` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `ngay_tao` DATETIME(6) NULL,
  `ngay_cap_nhat` DATETIME(6) NULL,
  `ten_dich_vu` VARCHAR(200) NOT NULL,
  `mo_ta` TEXT NULL,
  `gia` DECIMAL(15,2) NOT NULL,
  `thoi_gian_uoc_tinh` VARCHAR(50) NULL,
  `trang_thai` BIT(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- JOINED SUBCLASSES of nguoi_dung
-- ============================================================

-- ---------- khach_hang ----------
CREATE TABLE `khach_hang` (
  `id` BIGINT NOT NULL,
  `diem_tich_luy` INT NULL DEFAULT 0,
  `hang_thanh_vien` VARCHAR(50) NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_khach_hang_nguoi_dung`
    FOREIGN KEY (`id`) REFERENCES `nguoi_dung` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- nhan_vien ----------
CREATE TABLE `nhan_vien` (
  `id` BIGINT NOT NULL,
  `ma_nhan_vien` VARCHAR(20) NOT NULL,
  `chuc_vu` VARCHAR(50) NULL,
  `phong_ban` VARCHAR(100) NULL,
  `luong` DECIMAL(15,2) NULL,
  `ngay_vao_lam` DATE NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_nhan_vien_ma` (`ma_nhan_vien`),
  CONSTRAINT `fk_nhan_vien_nguoi_dung`
    FOREIGN KEY (`id`) REFERENCES `nguoi_dung` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- DEPENDENT TABLES (level 1)
-- ============================================================

-- ---------- dia_chi_khach_hang ----------
CREATE TABLE `dia_chi_khach_hang` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `ngay_tao` DATETIME(6) NULL,
  `ngay_cap_nhat` DATETIME(6) NULL,
  `khach_hang_id` BIGINT NOT NULL,
  `ten_nguoi_nhan` VARCHAR(100) NOT NULL,
  `so_dien_thoai` VARCHAR(15) NOT NULL,
  `tinh_thanh_id` INT NOT NULL,
  `tinh_thanh_ten` VARCHAR(100) NOT NULL,
  `quan_huyen_id` INT NULL,
  `quan_huyen_ten` VARCHAR(100) NULL,
  `xa_phuong_id` INT NULL,
  `xa_phuong_ten` VARCHAR(100) NULL,
  `dia_chi_chi_tiet` TEXT NOT NULL,
  `ghn_district_id` INT NULL,
  `ghn_ward_code` VARCHAR(20) NULL,
  `is_default` BIT(1) NULL DEFAULT b'0',
  `is_deleted` BIT(1) NOT NULL DEFAULT b'0',
  PRIMARY KEY (`id`),
  KEY `idx_dia_chi_khach_hang_kh` (`khach_hang_id`),
  CONSTRAINT `fk_dia_chi_khach_hang_kh`
    FOREIGN KEY (`khach_hang_id`) REFERENCES `khach_hang` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- ton_kho ----------
CREATE TABLE `ton_kho` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `ngay_tao` DATETIME(6) NULL,
  `ngay_cap_nhat` DATETIME(6) NULL,
  `phu_kien_id` BIGINT NOT NULL,
  `kho_hang_id` BIGINT NOT NULL,
  `so_luong` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_ton_kho_phu_kien_kho` (`phu_kien_id`, `kho_hang_id`),
  KEY `idx_ton_kho_kho` (`kho_hang_id`),
  CONSTRAINT `fk_ton_kho_phu_kien`
    FOREIGN KEY (`phu_kien_id`) REFERENCES `phu_kien` (`id`),
  CONSTRAINT `fk_ton_kho_kho_hang`
    FOREIGN KEY (`kho_hang_id`) REFERENCES `kho_hang` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- lich_hen ----------
CREATE TABLE `lich_hen` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `loai_lich` VARCHAR(50) NULL,
  `nguoi_dung_id` BIGINT NULL,
  `oto_id` BIGINT NULL,
  `dich_vu_id` BIGINT NULL,
  `kho_hang_id` BIGINT NULL,
  `ho_ten` VARCHAR(255) NULL,
  `so_dien_thoai` VARCHAR(255) NULL,
  `email` VARCHAR(255) NULL,
  `ngay_hen` DATE NULL,
  `gio_hen` TIME NULL,
  `ghi_chu` TEXT NULL,
  `trang_thai` VARCHAR(50) NULL,
  `ngay_tao` DATETIME(6) NULL,
  PRIMARY KEY (`id`),
  KEY `idx_lich_hen_nguoi_dung` (`nguoi_dung_id`),
  KEY `idx_lich_hen_oto` (`oto_id`),
  KEY `idx_lich_hen_dich_vu` (`dich_vu_id`),
  KEY `idx_lich_hen_kho_hang` (`kho_hang_id`),
  CONSTRAINT `fk_lich_hen_nguoi_dung`
    FOREIGN KEY (`nguoi_dung_id`) REFERENCES `nguoi_dung` (`id`),
  CONSTRAINT `fk_lich_hen_oto`
    FOREIGN KEY (`oto_id`) REFERENCES `oto` (`id`),
  CONSTRAINT `fk_lich_hen_dich_vu`
    FOREIGN KEY (`dich_vu_id`) REFERENCES `dich_vu` (`id`),
  CONSTRAINT `fk_lich_hen_kho_hang`
    FOREIGN KEY (`kho_hang_id`) REFERENCES `kho_hang` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- gio_hang ----------
CREATE TABLE `gio_hang` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `ngay_tao` DATETIME(6) NULL,
  `ngay_cap_nhat` DATETIME(6) NULL,
  `khach_hang_id` BIGINT NOT NULL,
  `tong_tien` DECIMAL(15,2) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_gio_hang_khach_hang` (`khach_hang_id`),
  CONSTRAINT `fk_gio_hang_khach_hang`
    FOREIGN KEY (`khach_hang_id`) REFERENCES `khach_hang` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- chi_tiet_gio_hang ----------
CREATE TABLE `chi_tiet_gio_hang` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `ngay_tao` DATETIME(6) NULL,
  `ngay_cap_nhat` DATETIME(6) NULL,
  `gio_hang_id` BIGINT NOT NULL,
  `loai_san_pham` VARCHAR(50) NOT NULL,
  `oto_id` BIGINT NULL,
  `phu_kien_id` BIGINT NULL,
  `dich_vu_id` BIGINT NULL,
  `kho_hang_id` BIGINT NULL,
  `so_luong` INT NOT NULL DEFAULT 1,
  `don_gia` DECIMAL(15,2) NOT NULL,
  `thanh_tien` DECIMAL(15,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_ctgh_gio_hang` (`gio_hang_id`),
  KEY `idx_ctgh_oto` (`oto_id`),
  KEY `idx_ctgh_phu_kien` (`phu_kien_id`),
  KEY `idx_ctgh_dich_vu` (`dich_vu_id`),
  CONSTRAINT `fk_ctgh_gio_hang`
    FOREIGN KEY (`gio_hang_id`) REFERENCES `gio_hang` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ctgh_oto`
    FOREIGN KEY (`oto_id`) REFERENCES `oto` (`id`),
  CONSTRAINT `fk_ctgh_phu_kien`
    FOREIGN KEY (`phu_kien_id`) REFERENCES `phu_kien` (`id`),
  CONSTRAINT `fk_ctgh_dich_vu`
    FOREIGN KEY (`dich_vu_id`) REFERENCES `dich_vu` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- don_hang ----------
CREATE TABLE `don_hang` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `ngay_tao` DATETIME(6) NULL,
  `ngay_cap_nhat` DATETIME(6) NULL,
  `ma_don_hang` VARCHAR(30) NOT NULL,
  `khach_hang_id` BIGINT NOT NULL,
  `nhan_vien_xu_ly_id` BIGINT NULL,
  `tong_tien` DECIMAL(15,2) NOT NULL,
  `trang_thai` VARCHAR(50) NOT NULL,
  `ghi_chu` TEXT NULL,
  `dia_chi_giao_hang_id` BIGINT NULL,
  `phi_van_chuyen` DECIMAL(15,2) NULL,
  `ma_don_hang_ghn` VARCHAR(100) NULL,
  `kho_hang_id` BIGINT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_don_hang_ma` (`ma_don_hang`),
  KEY `idx_don_hang_khach_hang` (`khach_hang_id`),
  KEY `idx_don_hang_nhan_vien` (`nhan_vien_xu_ly_id`),
  KEY `idx_don_hang_dia_chi` (`dia_chi_giao_hang_id`),
  KEY `idx_don_hang_kho` (`kho_hang_id`),
  CONSTRAINT `fk_don_hang_khach_hang`
    FOREIGN KEY (`khach_hang_id`) REFERENCES `khach_hang` (`id`),
  CONSTRAINT `fk_don_hang_nhan_vien`
    FOREIGN KEY (`nhan_vien_xu_ly_id`) REFERENCES `nhan_vien` (`id`),
  CONSTRAINT `fk_don_hang_dia_chi`
    FOREIGN KEY (`dia_chi_giao_hang_id`) REFERENCES `dia_chi_khach_hang` (`id`),
  CONSTRAINT `fk_don_hang_kho`
    FOREIGN KEY (`kho_hang_id`) REFERENCES `kho_hang` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- chi_tiet_don_hang ----------
CREATE TABLE `chi_tiet_don_hang` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `ngay_tao` DATETIME(6) NULL,
  `ngay_cap_nhat` DATETIME(6) NULL,
  `don_hang_id` BIGINT NOT NULL,
  `loai_san_pham` VARCHAR(50) NOT NULL,
  `oto_id` BIGINT NULL,
  `phu_kien_id` BIGINT NULL,
  `dich_vu_id` BIGINT NULL,
  `kho_hang_id` BIGINT NULL,
  `so_luong` INT NOT NULL DEFAULT 1,
  `don_gia` DECIMAL(15,2) NOT NULL,
  `thanh_tien` DECIMAL(15,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_ctdh_don_hang` (`don_hang_id`),
  KEY `idx_ctdh_oto` (`oto_id`),
  KEY `idx_ctdh_phu_kien` (`phu_kien_id`),
  KEY `idx_ctdh_dich_vu` (`dich_vu_id`),
  CONSTRAINT `fk_ctdh_don_hang`
    FOREIGN KEY (`don_hang_id`) REFERENCES `don_hang` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ctdh_oto`
    FOREIGN KEY (`oto_id`) REFERENCES `oto` (`id`),
  CONSTRAINT `fk_ctdh_phu_kien`
    FOREIGN KEY (`phu_kien_id`) REFERENCES `phu_kien` (`id`),
  CONSTRAINT `fk_ctdh_dich_vu`
    FOREIGN KEY (`dich_vu_id`) REFERENCES `dich_vu` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- thanh_toan ----------
CREATE TABLE `thanh_toan` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `ngay_tao` DATETIME(6) NULL,
  `ngay_cap_nhat` DATETIME(6) NULL,
  `don_hang_id` BIGINT NOT NULL,
  `so_tien` DECIMAL(15,2) NOT NULL,
  `phuong_thuc` VARCHAR(50) NOT NULL,
  `ma_giao_dich` VARCHAR(100) NULL,
  `trang_thai` VARCHAR(50) NOT NULL,
  `noi_dung` VARCHAR(255) NULL,
  `url_thanh_toan` TEXT NULL,
  `du_lieu_phan_hoi` TEXT NULL,
  `ngay_thanh_toan` DATETIME(6) NULL,
  PRIMARY KEY (`id`),
  KEY `idx_thanh_toan_don_hang` (`don_hang_id`),
  CONSTRAINT `fk_thanh_toan_don_hang`
    FOREIGN KEY (`don_hang_id`) REFERENCES `don_hang` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- khieu_nai ----------
CREATE TABLE `khieu_nai` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `ngay_tao` DATETIME(6) NULL,
  `ngay_cap_nhat` DATETIME(6) NULL,
  `khach_hang_id` BIGINT NOT NULL,
  `don_hang_id` BIGINT NULL,
  `tieu_de` VARCHAR(200) NOT NULL,
  `noi_dung` TEXT NOT NULL,
  `trang_thai` VARCHAR(50) NOT NULL,
  `phan_hoi` TEXT NULL,
  `nhan_vien_xu_ly_id` BIGINT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_khieu_nai_khach_hang` (`khach_hang_id`),
  KEY `idx_khieu_nai_don_hang` (`don_hang_id`),
  KEY `idx_khieu_nai_nhan_vien` (`nhan_vien_xu_ly_id`),
  CONSTRAINT `fk_khieu_nai_khach_hang`
    FOREIGN KEY (`khach_hang_id`) REFERENCES `khach_hang` (`id`),
  CONSTRAINT `fk_khieu_nai_don_hang`
    FOREIGN KEY (`don_hang_id`) REFERENCES `don_hang` (`id`),
  CONSTRAINT `fk_khieu_nai_nhan_vien`
    FOREIGN KEY (`nhan_vien_xu_ly_id`) REFERENCES `nhan_vien` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- danh_gia ----------
CREATE TABLE `danh_gia` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `ngay_tao` DATETIME(6) NULL,
  `ngay_cap_nhat` DATETIME(6) NULL,
  `khach_hang_id` BIGINT NOT NULL,
  `loai_san_pham` VARCHAR(50) NOT NULL,
  `oto_id` BIGINT NULL,
  `phu_kien_id` BIGINT NULL,
  `dich_vu_id` BIGINT NULL,
  `diem_danh_gia` INT NOT NULL,
  `noi_dung` TEXT NULL,
  `trang_thai` BIT(1) NOT NULL DEFAULT b'1',
  `lich_hen_id` BIGINT NULL,
  `chi_tiet_don_hang_id` BIGINT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_danh_gia_lich_hen` (`lich_hen_id`),
  UNIQUE KEY `uk_danh_gia_ctdh` (`chi_tiet_don_hang_id`),
  KEY `idx_danh_gia_khach_hang` (`khach_hang_id`),
  KEY `idx_danh_gia_oto` (`oto_id`),
  KEY `idx_danh_gia_phu_kien` (`phu_kien_id`),
  KEY `idx_danh_gia_dich_vu` (`dich_vu_id`),
  CONSTRAINT `fk_danh_gia_khach_hang`
    FOREIGN KEY (`khach_hang_id`) REFERENCES `khach_hang` (`id`),
  CONSTRAINT `fk_danh_gia_oto`
    FOREIGN KEY (`oto_id`) REFERENCES `oto` (`id`),
  CONSTRAINT `fk_danh_gia_phu_kien`
    FOREIGN KEY (`phu_kien_id`) REFERENCES `phu_kien` (`id`),
  CONSTRAINT `fk_danh_gia_dich_vu`
    FOREIGN KEY (`dich_vu_id`) REFERENCES `dich_vu` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- danh_gia_oto ----------
CREATE TABLE `danh_gia_oto` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `ngay_tao` DATETIME(6) NULL,
  `ngay_cap_nhat` DATETIME(6) NULL,
  `nguoi_dung_id` BIGINT NOT NULL,
  `oto_id` BIGINT NOT NULL,
  `diem_danh_gia` INT NOT NULL,
  `binh_luan` TEXT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_nguoidung_oto_review` (`nguoi_dung_id`, `oto_id`),
  KEY `idx_danh_gia_oto_nd` (`nguoi_dung_id`),
  KEY `idx_danh_gia_oto_oto` (`oto_id`),
  CONSTRAINT `fk_danh_gia_oto_nguoi_dung`
    FOREIGN KEY (`nguoi_dung_id`) REFERENCES `nguoi_dung` (`id`),
  CONSTRAINT `fk_danh_gia_oto_oto`
    FOREIGN KEY (`oto_id`) REFERENCES `oto` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- media (polymorphic — KHONG FK doi_tuong_id) ----------
CREATE TABLE `media` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `ngay_tao` DATETIME(6) NULL,
  `ngay_cap_nhat` DATETIME(6) NULL,
  `loai_media` VARCHAR(50) NOT NULL,
  `loai_doi_tuong` VARCHAR(50) NOT NULL,
  `doi_tuong_id` BIGINT NOT NULL,
  `url` VARCHAR(500) NOT NULL,
  `public_id` VARCHAR(300) NOT NULL,
  `mo_ta` VARCHAR(255) NULL,
  `thu_tu` INT NULL DEFAULT 0,
  `dung_luong` BIGINT NULL,
  `dinh_dang` VARCHAR(20) NULL,
  `chieu_rong` INT NULL,
  `chieu_cao` INT NULL,
  `thoi_luong` DOUBLE NULL,
  PRIMARY KEY (`id`),
  KEY `idx_media_doi_tuong` (`loai_doi_tuong`, `doi_tuong_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- phien_chat ----------
CREATE TABLE `phien_chat` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `ngay_tao` DATETIME(6) NULL,
  `ngay_cap_nhat` DATETIME(6) NULL,
  `khach_hang_id` BIGINT NOT NULL,
  `nhan_vien_id` BIGINT NULL,
  `trang_thai` VARCHAR(50) NOT NULL,
  `ngay_ket_thuc` DATETIME(6) NULL,
  PRIMARY KEY (`id`),
  KEY `idx_phien_chat_kh` (`khach_hang_id`),
  KEY `idx_phien_chat_nv` (`nhan_vien_id`),
  CONSTRAINT `fk_phien_chat_khach_hang`
    FOREIGN KEY (`khach_hang_id`) REFERENCES `khach_hang` (`id`),
  CONSTRAINT `fk_phien_chat_nhan_vien`
    FOREIGN KEY (`nhan_vien_id`) REFERENCES `nhan_vien` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- tin_nhan ----------
CREATE TABLE `tin_nhan` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `ngay_tao` DATETIME(6) NULL,
  `ngay_cap_nhat` DATETIME(6) NULL,
  `phien_chat_id` BIGINT NOT NULL,
  `nguoi_gui_id` BIGINT NOT NULL,
  `noi_dung` TEXT NOT NULL,
  `loai_tin_nhan` VARCHAR(50) NOT NULL,
  `da_doc` BIT(1) NOT NULL DEFAULT b'0',
  `ngay_gui` DATETIME(6) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_tin_nhan_phien_chat` (`phien_chat_id`),
  KEY `idx_tin_nhan_nguoi_gui` (`nguoi_gui_id`),
  CONSTRAINT `fk_tin_nhan_phien_chat`
    FOREIGN KEY (`phien_chat_id`) REFERENCES `phien_chat` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_tin_nhan_nguoi_gui`
    FOREIGN KEY (`nguoi_gui_id`) REFERENCES `nguoi_dung` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
