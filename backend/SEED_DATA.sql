USE carshop_db;

-- =============================================
-- CLEANUP: Xóa sạch trước khi INSERT
-- =============================================
SET FOREIGN_KEY_CHECKS=0;

TRUNCATE TABLE thanh_toan;
TRUNCATE TABLE chi_tiet_don_hang;
TRUNCATE TABLE don_hang;
TRUNCATE TABLE dia_chi_khach_hang;
TRUNCATE TABLE kho_hang;
TRUNCATE TABLE nhan_vien;
TRUNCATE TABLE khach_hang;
TRUNCATE TABLE nguoi_dung;
TRUNCATE TABLE oto;
TRUNCATE TABLE phu_kien;

SET FOREIGN_KEY_CHECKS=1;

-- =============================================
-- SEED DATA v2.0 - Khớp 100% Entity hiện tại
-- =============================================

-- =============================================
-- 1. KHO HÀNG (3 trạm: HN, ĐN, HCM)
-- tinh_thanh_id: 1=HN, 2=HCM, 3=ĐN (mã nội bộ 34 tỉnh)
-- ghn_*: mã GHN riêng dùng để tính cước + tạo đơn
-- =============================================
INSERT INTO kho_hang (id, ten_kho, nguoi_lien_he, so_dien_thoai,
    tinh_thanh_id, tinh_thanh_ten, xa_phuong_id, xa_phuong_ten,
    dia_chi_chi_tiet, trang_thai,
    ghn_province_id, ghn_district_id, ghn_ward_code, ghn_shop_id,
    ngay_tao, ngay_cap_nhat)
VALUES
(1, 'Kho Hà Nội',           'Nguyễn Văn Hùng',  '0901100001',
    1,  'Hà Nội',           1001, 'Phường Yên Sở',
    'Số 15 Đường Giải Phóng, Phường Yên Sở, Quận Hoàng Mai, Hà Nội',  1,
    201, 1490, '1A0814', NULL, NOW(), NOW()),

(2, 'Kho Đà Nẵng',          'Trần Thị Lan',     '0902200002',
    3,  'Đà Nẵng',          3001, 'Xã Tân Thành',
    'Số 32 Lê Đình Lý, Xã Tân Thành, Quận Sơn Trà, Đà Nẵng',   1,
    518, 1823, '640706', NULL, NOW(), NOW()),

(3, 'Kho TP Hồ Chí Minh',  'Phạm Minh Tuấn',   '0903300003',
    2,  'TP Hồ Chí Minh',  2001, 'Phường Trung Mỹ Tây',
    'Số 118 Lê Thánh Tôn, Phường Trung Mỹ Tây, Quận 12, TP.HCM', 1,
    202, 1454, '21211', NULL, NOW(), NOW());

-- =============================================
-- 2. NGƯỜI DÙNG (1 Admin + 3 NV + 6 KH)
-- mat_khau = BCrypt của "123456"
-- vai_tro: ADMIN | NHAN_VIEN | KHACH_HANG
-- loai_nguoi_dung: discriminator JOINED inheritance
-- =============================================
INSERT INTO nguoi_dung (id, ho_ten, email, mat_khau, so_dien_thoai, vai_tro, trang_thai, loai_nguoi_dung, ngay_tao, ngay_cap_nhat)
VALUES
(1,  'Admin Carshop',       'admin@carshop.com',      '$2a$10$N.zmdr9zkP1Tc03RFPh8reUvYJDmF4jNFdLZajr5P9m.sVJrJSiui', '0900000001', 'ADMIN',      1, 'NHAN_VIEN',  NOW(), NOW()),
(2,  'Nguyễn Thành Đạt',   'dat.nv@carshop.com',     '$2a$10$N.zmdr9zkP1Tc03RFPh8reUvYJDmF4jNFdLZajr5P9m.sVJrJSiui', '0900000002', 'NHAN_VIEN',  1, 'NHAN_VIEN',  NOW(), NOW()),
(3,  'Lê Thị Hoa',         'hoa.nv@carshop.com',     '$2a$10$N.zmdr9zkP1Tc03RFPh8reUvYJDmF4jNFdLZajr5P9m.sVJrJSiui', '0900000003', 'NHAN_VIEN',  1, 'NHAN_VIEN',  NOW(), NOW()),
(4,  'Trần Văn Bình',      'binh.nv@carshop.com',    '$2a$10$N.zmdr9zkP1Tc03RFPh8reUvYJDmF4jNFdLZajr5P9m.sVJrJSiui', '0900000004', 'NHAN_VIEN',  1, 'NHAN_VIEN',  NOW(), NOW()),
(10, 'Nguyễn Văn An',      'an.kh@gmail.com',        '$2a$10$N.zmdr9zkP1Tc03RFPh8reUvYJDmF4jNFdLZajr5P9m.sVJrJSiui', '0911000001', 'KHACH_HANG', 1, 'KHACH_HANG', NOW(), NOW()),
(11, 'Trần Thị Bảo',       'bao.kh@gmail.com',       '$2a$10$N.zmdr9zkP1Tc03RFPh8reUvYJDmF4jNFdLZajr5P9m.sVJrJSiui', '0911000002', 'KHACH_HANG', 1, 'KHACH_HANG', NOW(), NOW()),
(12, 'Lê Hoàng Cường',     'cuong.kh@gmail.com',     '$2a$10$N.zmdr9zkP1Tc03RFPh8reUvYJDmF4jNFdLZajr5P9m.sVJrJSiui', '0911000003', 'KHACH_HANG', 1, 'KHACH_HANG', NOW(), NOW()),
(13, 'Phạm Thị Dung',      'dung.kh@gmail.com',      '$2a$10$N.zmdr9zkP1Tc03RFPh8reUvYJDmF4jNFdLZajr5P9m.sVJrJSiui', '0911000004', 'KHACH_HANG', 1, 'KHACH_HANG', NOW(), NOW()),
(14, 'Hoàng Văn Em',       'em.kh@gmail.com',        '$2a$10$N.zmdr9zkP1Tc03RFPh8reUvYJDmF4jNFdLZajr5P9m.sVJrJSiui', '0911000005', 'KHACH_HANG', 1, 'KHACH_HANG', NOW(), NOW()),
(15, 'Vũ Thị Phương',      'phuong.kh@gmail.com',    '$2a$10$N.zmdr9zkP1Tc03RFPh8reUvYJDmF4jNFdLZajr5P9m.sVJrJSiui', '0911000006', 'KHACH_HANG', 1, 'KHACH_HANG', NOW(), NOW());

-- =============================================
-- 3. NHÂN VIÊN (joined table với nguoi_dung)
-- =============================================
INSERT INTO nhan_vien (id, ma_nhan_vien, chuc_vu, phong_ban, luong, ngay_vao_lam)
VALUES
(1, 'NV-ADMIN-001', 'QUAN_LY',             'Ban Giám Đốc',  30000000, '2022-01-01'),
(2, 'NV-2025-002',  'NHAN_VIEN_BAN_HANG',  'Kinh Doanh',    12000000, '2023-05-01'),
(3, 'NV-2025-003',  'CHAM_SOC_KHACH_HANG', 'CSKH',          10000000, '2024-01-15'),
(4, 'NV-2025-004',  'KY_THUAT_VIEN',       'Kỹ Thuật',      11000000, '2024-03-01');

-- =============================================
-- 4. KHÁCH HÀNG (joined table với nguoi_dung)
-- =============================================
INSERT INTO khach_hang (id, diem_tich_luy, hang_thanh_vien)
VALUES
(10,  500, 'BAC'),
(11, 1200, 'VANG'),
(12,  200, 'DONG'),
(13,  800, 'BAC'),
(14,    0, 'DONG'),
(15, 3500, 'KIM_CUONG');

-- =============================================
-- 5. ĐỊA CHỈ KHÁCH HÀNG
-- tinh_thanh_id: mã 34 tỉnh thành mới (dùng để hiển thị UI)
-- ghn_district_id + ghn_ward_code: mã GHN để tính cước + tạo đơn
--   HN Đống Đa:   district=1490, ward=1B0608
--   HCM Q.1:      district=1454, ward=1B0802
--   ĐN Sơn Trà:   district=1823, ward=1B2424
-- =============================================
INSERT INTO dia_chi_khach_hang (id, khach_hang_id, ten_nguoi_nhan, so_dien_thoai,
    tinh_thanh_id, tinh_thanh_ten, xa_phuong_id, xa_phuong_ten,
    dia_chi_chi_tiet, ghn_district_id, ghn_ward_code, is_default, ngay_tao, ngay_cap_nhat)
VALUES
(1,  10, 'Nguyễn Văn An',   '0911000001', 1, 'Hà Nội',          1001, 'Phường Yên Sở',        '12 Phố Giải Phóng, Phường Yên Sở, Quận Hoàng Mai, Hà Nội',  1490, '1A0814', 1, NOW(), NOW()),
(2,  10, 'Nguyễn Văn An',   '0911000001', 2, 'TP Hồ Chí Minh', 2001, 'Phường Trung Mỹ Tây', '88 Nguyễn Huệ, Phường Trung Mỹ Tây, Quận 12, TP.HCM',  1454, '21211',  0, NOW(), NOW()),
(3,  11, 'Trần Thị Bảo',    '0911000002', 1, 'Hà Nội',          1002, 'Phường Định Công',     '45 Trần Đại Nghĩa, Phường Định Công, Quận Hoàng Mai, Hà Nội',   1490, '1A0802', 1, NOW(), NOW()),
(4,  12, 'Lê Hoàng Cường',  '0911000003', 3, 'Đà Nẵng',         3001, 'Xã Tân Thành',         '67 Bạch Đằng, Xã Tân Thành, Quận Sơn Trà, Đà Nẵng',          1823, '640706', 1, NOW(), NOW()),
(5,  13, 'Phạm Thị Dung',   '0911000004', 2, 'TP Hồ Chí Minh', 2001, 'Phường Trung Mỹ Tây', '99 Đinh Tiên Hoàng, Phường Trung Mỹ Tây, Quận 12, TP.HCM',  1454, '21211',  1, NOW(), NOW()),
(6,  14, 'Hoàng Văn Em',    '0911000005', 1, 'Hà Nội',          1003, 'Phường Hoàng Liệt',    '23 Lê Trọng Tấn, Phường Hoàng Liệt, Quận Hoàng Mai, Hà Nội',  1490, '1A0804', 1, NOW(), NOW()),
(7,  15, 'Vũ Thị Phương',   '0911000006', 3, 'Đà Nẵng',         3002, 'Xã Hiệp Lợi',          '11 Nguyễn Chí Thanh, Xã Hiệp Lợi, Quận Sơn Trà, Đà Nẵng',       1823, '640705', 1, NOW(), NOW()),
(8,  15, 'Vũ Thị Phương',   '0911000006', 2, 'TP Hồ Chí Minh', 2002, 'Phường Thọi An',       '55 Lý Tự Trọng, Phường Thọi An, Quận 12, TP.HCM',          1454, '21210',  0, NOW(), NOW()),
(9,  13, 'Phạm Thị Dung',   '0911000004', 3, 'Đà Nẵng',         3003, 'Phường Ngã Bảy',      '7 Hùng Vương, Phường Ngã Bảy, Quận Sơn Trà, Đà Nẵng',        1823, '640703', 0, NOW(), NOW()),
(10, 12, 'Lê Hoàng Cường',  '0911000003', 1, 'Hà Nội',          1004, 'Phường Thanh Trì',    '5 Tôn Đức Thắng, Phường Thanh Trì, Quận Hoàng Mai, Hà Nội',  1490, '1A0809', 0, NOW(), NOW());


-- =============================================
-- 6. ÔTÔ (10 xe)
-- =============================================
INSERT INTO oto (id, ten_xe, hang_xe, dong_xe, nam_san_xuat, mau_sac, dong_co, hop_so, nhien_lieu, so_km, gia, so_luong, mo_ta, trang_thai, ngay_tao, ngay_cap_nhat)
VALUES
(1,  'Toyota Camry 2.5Q',         'Toyota',    'Camry',    2023, 'Đen',   '2.5L 4-cylinder', 'Tự Động', 'Xăng',  0, 1390000000, 2, 'Sedan cao cấp đầy đủ option',      'DANG_BAN', NOW(), NOW()),
(2,  'Honda CR-V L',              'Honda',     'CR-V',     2023, 'Trắng', '1.5L Turbo',      'Tự Động', 'Xăng',  0, 1218000000, 3, 'SUV 5+2 chỗ, an toàn cao',        'DANG_BAN', NOW(), NOW()),
(3,  'Kia Sorento Signature',     'Kia',       'Sorento',  2024, 'Xám',   '2.2L Diesel',     'Tự Động', 'Dầu',   0, 1349000000, 1, 'Crossover 7 chỗ cao cấp',         'DANG_BAN', NOW(), NOW()),
(4,  'Ford Ranger Wildtrak',      'Ford',      'Ranger',   2023, 'Xanh',  '2.0L Biturbo',    'Tự Động', 'Dầu',   0,  962000000, 4, 'Bán tải địa hình bền bỉ',         'DANG_BAN', NOW(), NOW()),
(5,  'Mercedes C200 Avantgarde',  'Mercedes',  'C-Class',  2023, 'Đen',   '1.5L M254',       'Tự Động', 'Xăng',  0, 1939000000, 1, 'Sedan thương gia hạng sang',      'DANG_BAN', NOW(), NOW()),
(6,  'VinFast VF8 Plus',          'VinFast',   'VF8',      2023, 'Trắng', 'Electric Dual',   'Tự Động', 'Điện',  0, 1187000000, 5, 'SUV điện thuần Việt tự hào',      'DANG_BAN', NOW(), NOW()),
(7,  'Hyundai Tucson 2.0 ATH',    'Hyundai',   'Tucson',   2023, 'Đỏ',    '2.0L MPI',        'Tự Động', 'Xăng',  0,  862000000, 3, 'SUV hạng C đa dụng ăn khách',    'DANG_BAN', NOW(), NOW()),
(8,  'Mazda CX-5 Premium',        'Mazda',     'CX-5',     2023, 'Bạc',   '2.5L SkyActiv',   'Tự Động', 'Xăng',  0,  989000000, 2, 'Thiết kế Nhật tinh tế KODO',      'DANG_BAN', NOW(), NOW()),
(9,  'Mitsubishi Xpander Cross',  'Mitsubishi','Xpander',  2023, 'Đen',   '1.5L MIVEC',      'Tự Động', 'Xăng',  0,  702000000, 6, 'MPV 7 chỗ đa năng phổ thông',    'DANG_BAN', NOW(), NOW()),
(10, 'Toyota Fortuner Legender',  'Toyota',    'Fortuner', 2023, 'Bạc',   '2.8L 1GD-FTV',    'Tự Động', 'Dầu',   0, 1356000000, 2, 'SUV 7 chỗ đỉnh phân khúc D',     'DANG_BAN', NOW(), NOW());

-- =============================================
-- 7. PHỤ KIỆN (10 món, có trong_luong để GHN tính cước)
-- =============================================
INSERT INTO phu_kien (id, ten_phu_kien, loai_phu_kien, hang_san_xuat, gia, so_luong, trong_luong, mo_ta, trang_thai, ngay_tao, ngay_cap_nhat)
VALUES
(1,  'Lốp xe Michelin 215/60R16',    'Lốp xe',     'Michelin',    1250000,  50,  9500, 'Lốp xe nguyên bản Michelin bền bỉ',       1, NOW(), NOW()),
(2,  'Lọc gió động cơ Toyota',       'Bộ lọc',     'Toyota',       350000,  80,   350, 'Lọc gió chính hãng Toyota',               1, NOW(), NOW()),
(3,  'Dầu nhớt Castrol 5W-30 (4L)',  'Dầu nhớt',   'Castrol',      280000, 100,   800, 'Dầu động cơ tổng hợp cao cấp',            1, NOW(), NOW()),
(4,  'Camera lùi 360 độ HD',          'Camera',     'Mafin',       1800000,  30,   650, 'Camera toàn cảnh 360 độ chống nước IP67', 1, NOW(), NOW()),
(5,  'Cảm biến áp suất lốp TPMS',    'Cảm biến',   'Aukey',        890000,  40,   200, 'Bộ 4 cảm biến áp suất lốp không dây',    1, NOW(), NOW()),
(6,  'Thảm lót sàn 3D Toyota Camry', 'Thảm lót',   'ToyotaGear',  1500000,  25,  3000, 'Thảm cao su 3D full bộ chính hãng',      1, NOW(), NOW()),
(7,  'Gương chiếu hậu gập điện',     'Gương',      'GenericPro',   420000,  60,   450, 'Gương chiếu hậu gập điện thay thế',      1, NOW(), NOW()),
(8,  'Đèn LED nội thất 12V bộ 4',    'Đèn',        'Osram',        320000, 120,   300, 'Đèn LED khoang xe ánh sáng trắng 6000K', 1, NOW(), NOW()),
(9,  'Bình ắc quy GS 55Ah 12V',      'Ắc quy',     'GS Battery',  2300000,  15, 16000, 'Ắc quy ô tô chính hãng GS Nhật Bản',    1, NOW(), NOW()),
(10, 'Bộ kẹp điện cứu hộ Stanley',   'Dụng cụ',    'Stanley',      450000,  70,  1200, 'Kẹp kích điện ắc quy ô tô chuyên dụng', 1, NOW(), NOW());

-- =============================================
-- 8. ĐƠN HÀNG (10 đơn, đa dạng trạng thái)
-- Đơn PHỤ KIỆN: có kho_hang_id + dia_chi_giao_hang_id
-- Đơn ÔTÔ: dia_chi=NULL (khách ra showroom), kho=NULL
-- =============================================
INSERT INTO don_hang (id, ma_don_hang, khach_hang_id, nhan_vien_xu_ly_id,
    dia_chi_giao_hang_id, kho_hang_id, trang_thai, tong_tien, phi_van_chuyen,
    ghi_chu, ma_don_hang_ghn, ngay_tao, ngay_cap_nhat)
VALUES
-- #1: Phụ kiện | Kho HN → KH HN | CHỜ XÁC NHẬN ← TEST GHN
(1,  'DH-2026-0001', 10, 2, 1, 1, 'CHO_XAC_NHAN',   1250000,       0, 'Giao giờ hành chính',    NULL, NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 2 DAY),
-- #2: Phụ kiện | Kho HCM → KH HCM | CHỜ XÁC NHẬN ← TEST GHN
(2,  'DH-2026-0002', 11, 3, 3, 3, 'CHO_XAC_NHAN',   2690000,       0, 'Gọi trước khi đến',       NULL, NOW() - INTERVAL 1 DAY, NOW() - INTERVAL 1 DAY),
-- #3: Phụ kiện | Kho ĐN → KH ĐN | ĐÃ XÁC NHẬN
(3,  'DH-2026-0003', 12, 2, 4, 2, 'DA_XAC_NHAN',    1870000,   25000, NULL,                       NULL, NOW() - INTERVAL 5 DAY, NOW() - INTERVAL 4 DAY),
-- #4: Ô tô | Khách ra showroom | ĐÃ XÁC NHẬN
(4,  'DH-2026-0004', 13, NULL, NULL, NULL, 'DA_XAC_NHAN', 1390000000, 0, 'Khách ra showroom nhận xe', NULL, NOW() - INTERVAL 7 DAY, NOW() - INTERVAL 6 DAY),
-- #5: Phụ kiện | Kho HN → KH HN | ĐANG GIAO
(5,  'DH-2026-0005', 14, 2, 6, 1, 'DANG_GIAO',       920000,   30000, NULL,                 'GHNTESTHN001', NOW() - INTERVAL 4 DAY, NOW() - INTERVAL 1 DAY),
-- #6: Phụ kiện | Kho HCM → KH HCM | HOÀN THÀNH
(6,  'DH-2026-0006', 15, 3, 7, 3, 'HOAN_THANH',     2720000,   22000, NULL,                 'GHNTESTHCM02', NOW() - INTERVAL 10 DAY, NOW() - INTERVAL 2 DAY),
-- #7: Ô tô + Phụ kiện | Kho HN | ĐANG XỬ LÝ
(7,  'DH-2026-0007', 10, 4, 1, 1, 'DANG_XU_LY',  1219800000,       0, 'Kèm phụ kiện lắp sẵn',   NULL, NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 3 DAY),
-- #8: Phụ kiện | ĐÃ HỦY
(8,  'DH-2026-0008', 12, NULL, 4, 2, 'DA_HUY',       890000,        0, 'Khách đổi ý',             NULL, NOW() - INTERVAL 8 DAY, NOW() - INTERVAL 7 DAY),
-- #9: Phụ kiện | Kho ĐN → KH ĐN | CHỜ XÁC NHẬN ← TEST GHN
(9,  'DH-2026-0009', 15, 2, 7, 2, 'CHO_XAC_NHAN',  1600000,        0, 'Đóng gói cẩn thận',       NULL, NOW(), NOW()),
-- #10: Phụ kiện | Kho HCM → KH HCM | CHỜ XÁC NHẬN ← TEST GHN
(10, 'DH-2026-0010', 13, 3, 5, 3, 'CHO_XAC_NHAN',  3420000,        0, NULL,                       NULL, NOW(), NOW());

-- =============================================
-- 9. CHI TIẾT ĐƠN HÀNG
-- =============================================
INSERT INTO chi_tiet_don_hang (id, don_hang_id, oto_id, phu_kien_id, dich_vu_id, so_luong, don_gia, thanh_tien, loai_san_pham, ngay_tao, ngay_cap_nhat)
VALUES
-- Đơn 1: Lốp Michelin
(1,  1, NULL, 1, NULL, 1,  1250000,  1250000, 'PHU_KIEN', NOW(), NOW()),
-- Đơn 2: Dầu nhớt x2 + Lọc gió x2 + Thảm lót
(2,  2, NULL, 3, NULL, 2,   280000,   560000, 'PHU_KIEN', NOW(), NOW()),
(3,  2, NULL, 2, NULL, 2,   350000,   700000, 'PHU_KIEN', NOW(), NOW()),
(4,  2, NULL, 6, NULL, 1,  1500000,  1500000, 'PHU_KIEN', NOW(), NOW()),
-- Đơn 3: Camera + Gương x2
(5,  3, NULL, 4, NULL, 1,  1800000,  1800000, 'PHU_KIEN', NOW(), NOW()),
(6,  3, NULL, 7, NULL, 2,   420000,   420000, 'PHU_KIEN', NOW(), NOW()),
-- Đơn 4: Ô tô Camry
(7,  4, 1,   NULL, NULL, 1, 1390000000, 1390000000, 'OTO', NOW(), NOW()),
-- Đơn 5: Đèn LED x2 + Kẹp cứu hộ
(8,  5, NULL, 8, NULL, 2,   320000,   640000, 'PHU_KIEN', NOW(), NOW()),
(9,  5, NULL,10, NULL, 1,   450000,   450000, 'PHU_KIEN', NOW(), NOW()),
-- Đơn 6: Ắc quy + Thảm lót
(10, 6, NULL, 9, NULL, 1,  2300000,  2300000, 'PHU_KIEN', NOW(), NOW()),
(11, 6, NULL, 7, NULL, 1,   420000,   420000, 'PHU_KIEN', NOW(), NOW()),
-- Đơn 7: Ô tô CR-V + Cảm biến x2
(12, 7, 2,   NULL, NULL, 1, 1218000000, 1218000000, 'OTO', NOW(), NOW()),
(13, 7, NULL, 5, NULL, 2,   890000,  1800000, 'PHU_KIEN', NOW(), NOW()),
-- Đơn 8: Cảm biến (đã hủy)
(14, 8, NULL, 5, NULL, 1,   890000,   890000, 'PHU_KIEN', NOW(), NOW()),
-- Đơn 9: Lốp + Cảm biến (Kho ĐN)
(15, 9, NULL, 1, NULL, 1,  1250000,  1250000, 'PHU_KIEN', NOW(), NOW()),
(16, 9, NULL, 5, NULL, 1,   890000,   890000, 'PHU_KIEN', NOW(), NOW()),
-- Đơn 10: Ắc quy + Dầu nhớt x4 (Kho HCM)
(17,10, NULL, 9, NULL, 1,  2300000,  2300000, 'PHU_KIEN', NOW(), NOW()),
(18,10, NULL, 3, NULL, 4,   280000,  1120000, 'PHU_KIEN', NOW(), NOW());

-- =============================================
-- 10. THANH TOÁN (đa phương thức)
-- =============================================
INSERT INTO thanh_toan (id, don_hang_id, so_tien, phuong_thuc, ma_giao_dich, trang_thai, noi_dung, ngay_thanh_toan, ngay_tao, ngay_cap_nhat)
VALUES
(1,  1,   1250000,    'TIEN_MAT',    NULL,           'CHO_THANH_TOAN', 'COD khi nhận hàng',           NULL,                   NOW(), NOW()),
(2,  2,   2690000,    'MOMO',        'MOMO20260002',  'DA_THANH_TOAN',  'Thanh toán qua MoMo',         NOW() - INTERVAL 1 DAY, NOW(), NOW()),
(3,  3,   1895000,    'VNPAY',       'VP20260003',    'DA_THANH_TOAN',  'Thanh toán VNPay online',     NOW() - INTERVAL 4 DAY, NOW(), NOW()),
(4,  4,   1390000000, 'CHUYEN_KHOAN','CK20260004',    'DA_THANH_TOAN',  'Chuyển khoản 100% tiền xe',   NOW() - INTERVAL 6 DAY, NOW(), NOW()),
(5,  5,   950000,     'TIEN_MAT',    NULL,            'DA_THANH_TOAN',  'COD thu khi giao',            NOW() - INTERVAL 1 DAY, NOW(), NOW()),
(6,  6,   2742000,    'TIEN_MAT',    NULL,            'DA_THANH_TOAN',  'COD thu + phí ship',          NOW() - INTERVAL 2 DAY, NOW(), NOW()),
(7,  9,   1600000,    'TIEN_MAT',    NULL,            'CHO_THANH_TOAN', 'COD khi nhận hàng',           NULL,                   NOW(), NOW()),
(8,  10,  3420000,    'MOMO',        'MOMO20260010',  'DA_THANH_TOAN',  'Đã thanh toán online MoMo',   NOW(),                  NOW(), NOW());

-- =============================================
-- XONG! Đơn sẵn TEST GHN (CHO_XAC_NHAN + có phụ kiện + có địa chỉ + có kho):
-- #1 : Kho HN  (ghn_district=1490, ward=1B0608) → KH Hà Nội
-- #2 : Kho HCM (ghn_district=1454, ward=1B0802) → KH TP.HCM
-- #9 : Kho ĐN  (ghn_district=1823, ward=1B2424) → KH Đà Nẵng
-- #10: Kho HCM (ghn_district=1454, ward=1B0802) → KH TP.HCM
-- =============================================
