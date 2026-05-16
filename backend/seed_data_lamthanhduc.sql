-- Seed data prepared for Lam Thanh Duc
-- Scope: oto, phu_kien, dich_vu, media
-- Notes:
-- 1. This file avoids hard-coded IDs for media by resolving product IDs from product names.
-- 2. Prices are realistic reference values for demo use, not official final sale prices.
-- 3. Media URLs use public images from official brand pages where practical, plus representative
--    category images for accessories/services.

START TRANSACTION;

-- =========================
-- OTO
-- =========================
INSERT INTO oto (
    ngay_cap_nhat, ngay_tao, dong_co, dong_xe, gia, hang_xe, hop_so, mau_sac, mo_ta,
    nam_san_xuat, nhien_lieu, so_km, so_luong, ten_xe, trang_thai
) VALUES
    (NOW(), NOW(), '2.5L Hybrid', 'Camry', 1460000000.00, 'Toyota', 'CVT', 'Den', 'Sedan hang D, noi that rong, nhieu cong nghe an toan, phu hop di gia dinh va doanh nhan.', 2025, 'Xang + Dien', 0, 2, 'Toyota Camry 2.5HEV Q', 'DANG_BAN'),
    (NOW(), NOW(), '1.8L', 'Corolla Cross', 820000000.00, 'Toyota', 'CVT', 'Trang ngoc trai', 'SUV do thi 5 cho, van hanh de chiu, tiet kiem nhien lieu, phu hop nhu cau di lai hang ngay.', 2025, 'Xang', 0, 3, 'Toyota Corolla Cross 1.8V', 'DANG_BAN'),
    (NOW(), NOW(), '1.8L Hybrid', 'Corolla Cross', 865000000.00, 'Toyota', 'CVT', 'Do', 'Ban hybrid cua Corolla Cross, thiet ke hien dai, trang bi an toan day du va tiet kiem xang.', 2025, 'Xang + Dien', 0, 2, 'Toyota Corolla Cross 1.8HEV', 'DANG_BAN'),
    (NOW(), NOW(), '1.5L', 'Yaris Cross', 650000000.00, 'Toyota', 'CVT', 'Bac', 'SUV hang B gon gang, khoang sang gam tot, phu hop do thi va cac chuyen di cuoi tuan.', 2025, 'Xang', 0, 4, 'Toyota Yaris Cross', 'DANG_BAN'),
    (NOW(), NOW(), '1.5L Hybrid', 'Yaris Cross', 765000000.00, 'Toyota', 'CVT', 'Cam noc den', 'Phien ban Yaris Cross hybrid, noi that hien dai, tiet kiem nhien lieu va nhieu tinh nang ho tro lai.', 2025, 'Xang + Dien', 0, 2, 'Toyota Yaris Cross HEV', 'DANG_BAN'),
    (NOW(), NOW(), '1.5L', 'Vios', 545000000.00, 'Toyota', 'CVT', 'Trang', 'Sedan hang B pho bien, ben bi, de bao duong va chi phi su dung hop ly cho gia dinh nho.', 2024, 'Xang', 0, 5, 'Toyota Vios G CVT', 'DANG_BAN'),
    (NOW(), NOW(), '2.4L Diesel', 'Fortuner', 1185000000.00, 'Toyota', 'AT 6 cap', 'Xam', 'SUV 7 cho khung roi, may dau, phu hop di duong dai va nhu cau gia dinh dong nguoi.', 2025, 'Dau', 0, 2, 'Toyota Fortuner Legender 2.4AT 4x2', 'DANG_BAN'),
    (NOW(), NOW(), '1.5L', 'City', 569000000.00, 'Honda', 'CVT', 'Do', 'Sedan hang B co Honda SENSING, khong gian rong, lai linh hoat va muc gia de tiep can.', 2025, 'Xang', 0, 4, 'Honda City RS', 'DANG_BAN'),
    (NOW(), NOW(), '1.5L', 'BR-V', 705000000.00, 'Honda', 'CVT', 'Trang ngoc', 'MPV 7 cho co goi an toan Honda SENSING, thich hop cho gia dinh di pho va di xa.', 2025, 'Xang', 0, 3, 'Honda BR-V L', 'DANG_BAN'),
    (NOW(), NOW(), '1.5L Turbo', 'HR-V', 826000000.00, 'Honda', 'CVT', 'Vang cat', 'SUV hang B thiet ke tre trung, noi that thong minh, can bang giua gia va trang bi.', 2025, 'Xang', 0, 3, 'Honda HR-V L', 'DANG_BAN'),
    (NOW(), NOW(), '2.0L Hybrid', 'CR-V', 1259000000.00, 'Honda', 'e-CVT', 'Do do', 'SUV 5+2 cho, van hanh em, noi that cao cap, co ban hybrid va nhieu cong nghe an toan.', 2025, 'Xang + Dien', 0, 2, 'Honda CR-V e:HEV RS', 'DANG_BAN'),
    (NOW(), NOW(), '2.0L Hybrid', 'Civic', 999000000.00, 'Honda', 'e-CVT', 'Xam', 'Sedan hang C phong cach the thao, vo lang chac tay, khoang cabin hien dai va tiet kiem nhien lieu.', 2025, 'Xang + Dien', 0, 2, 'Honda Civic e:HEV RS', 'DANG_BAN'),
    (NOW(), NOW(), '2.0L', 'Mazda3', 699000000.00, 'Mazda', 'AT 6 cap', 'Do soul red', 'Sedan thiet ke KODO, noi that dep, chat luong hoan thien tot trong tam gia.', 2025, 'Xang', 0, 3, 'Mazda3 2.0 Premium', 'DANG_BAN'),
    (NOW(), NOW(), '2.5L', 'CX-5', 959000000.00, 'Mazda', 'AT 6 cap', 'Trang', 'SUV hang C duoc ua chuong nho cach am tot, noi that dep va lai de dieu khien.', 2025, 'Xang', 0, 4, 'Mazda CX-5 2.5 Signature Sport', 'DANG_BAN'),
    (NOW(), NOW(), '2.5L', 'CX-8', 1129000000.00, 'Mazda', 'AT 6 cap', 'Xanh dam', 'SUV 7 cho thiet ke lich lam, khong gian rong va phu hop gia dinh can xe da dung.', 2025, 'Xang', 0, 2, 'Mazda CX-8 Premium AWD', 'DANG_BAN'),
    (NOW(), NOW(), '1.5L', 'Accent', 569000000.00, 'Hyundai', 'CVT', 'Bac', 'Sedan gia tot, trang bi thuc dung, kha nang van hanh on dinh trong phan khuc hang B.', 2025, 'Xang', 0, 5, 'Hyundai Accent 1.5 AT Dac biet', 'DANG_BAN'),
    (NOW(), NOW(), '2.0L', 'Tucson', 989000000.00, 'Hyundai', 'AT 6 cap', 'Den', 'SUV hang C thiet ke sac net, noi that hien dai, phu hop nguoi dung tre va gia dinh.', 2025, 'Xang', 0, 3, 'Hyundai Tucson 2.0 Xang Dac biet', 'DANG_BAN'),
    (NOW(), NOW(), '2.5L Turbo', 'Santa Fe', 1369000000.00, 'Hyundai', 'AT 8 cap', 'Trang', 'SUV 7 cho cao cap, trang bi nhieu tinh nang an toan, phu hop gia dinh di du lich duong dai.', 2025, 'Xang', 0, 2, 'Hyundai Santa Fe 2.5 Turbo Calligraphy', 'DANG_BAN'),
    (NOW(), NOW(), '1.5L Turbo', 'Seltos', 799000000.00, 'Kia', 'DCT 7 cap', 'Vang', 'SUV do thi thiet ke bat mat, nhieu tinh nang giai tri va muc gia canh tranh.', 2025, 'Xang', 0, 4, 'Kia Seltos 1.5 Turbo GT-Line', 'DANG_BAN'),
    (NOW(), NOW(), '3.5L V6', 'Carnival', 1589000000.00, 'Kia', 'AT 8 cap', 'Xam xi mang', 'MPV cao cap rong rai, ghe sau thoai mai, phu hop gia dinh dong nguoi va don khach.', 2025, 'Xang', 0, 2, 'Kia Carnival 3.5G Premium', 'DANG_BAN'),
    (NOW(), NOW(), '2.0L Biturbo Diesel', 'Ranger', 1299000000.00, 'Ford', 'AT 10 cap', 'Cam', 'Ban tai manh me, kha nang van hanh da dia hinh, noi that dep va nhieu cong nghe.', 2025, 'Dau', 0, 3, 'Ford Ranger Wildtrak 2.0L 4x4 AT', 'DANG_BAN'),
    (NOW(), NOW(), '2.0L Turbo Diesel', 'Everest', 1468000000.00, 'Ford', 'AT 10 cap', 'Den', 'SUV 7 cho manh me, di duong dai on dinh, cach am tot va nhieu tinh nang ho tro lai.', 2025, 'Dau', 0, 2, 'Ford Everest Titanium+ 2.0L 4x4 AT', 'DANG_BAN'),
    (NOW(), NOW(), '1.5L MIVEC', 'Xpander Cross', 703000000.00, 'Mitsubishi', 'CVT', 'Trang', 'MPV gap SUV, khoang sang gam cao, rong rai va duoc ua chuong trong nhom gia dinh tre.', 2025, 'Xang', 0, 4, 'Mitsubishi Xpander Cross', 'DANG_BAN'),
    (NOW(), NOW(), '87.7 kWh', 'VF 8', 1179000000.00, 'VinFast', '1 cap', 'Xanh navy', 'SUV dien co khoang cabin rong, man hinh lon, phu hop nguoi dung can xe dien gia dinh.', 2025, 'Dien', 0, 2, 'VinFast VF 8 Plus', 'DANG_BAN');

-- =========================
-- PHU_KIEN
-- =========================
INSERT INTO phu_kien (
    ngay_cap_nhat, ngay_tao, gia, hang_san_xuat, loai_phu_kien, mo_ta,
    so_luong, ten_phu_kien, trang_thai, trong_luong
) VALUES
    (NOW(), NOW(), 3290000.00, '70mai', 'Camera hanh trinh', 'Camera truoc sau, ghi hinh 2K, ho tro ADAS va ket noi app.', 40, 'Camera hanh trinh 70mai A500S', b'1', 450),
    (NOW(), NOW(), 2190000.00, 'Vietmap', 'Camera hanh trinh', 'Camera Full HD, canh bao giao thong co ban, phu hop xe gia dinh.', 35, 'Camera hanh trinh Vietmap C61 Pro', b'1', 420),
    (NOW(), NOW(), 8990000.00, 'Zestech', 'Man hinh Android', 'Man hinh Android cho xe, ket noi camera, ban do va giai tri da phuong tien.', 18, 'Man hinh Android Zestech ZX10', b'1', 1800),
    (NOW(), NOW(), 6990000.00, 'Gotech', 'Man hinh Android', 'Man hinh giai tri thong minh, ket noi Apple CarPlay va Android Auto.', 20, 'Man hinh Android Gotech GT8 Max', b'1', 1750),
    (NOW(), NOW(), 1490000.00, 'ICAR', 'Camera lui', 'Camera lui goc rong, chat luong hinh anh ro net va de lap dat.', 45, 'Camera lui ICAR Elliview S3', b'1', 300),
    (NOW(), NOW(), 2290000.00, 'ICAR', 'Cam bien ap suat lop', 'Bo cam bien ap suat lop hien thi theo thoi gian thuc, canh bao ro ri va non lop.', 28, 'Cam bien ap suat lop ICAR Ellisafe C398', b'1', 240),
    (NOW(), NOW(), 2590000.00, 'Michelin', 'Lop xe', 'Lop Michelin cho xe du lich, do on dinh cao va bam duong tot khi di mua.', 30, 'Lop Michelin Primacy 4 215/55R17', b'1', 9800),
    (NOW(), NOW(), 2350000.00, 'Bridgestone', 'Lop xe', 'Lop xe phong thong danh cho sedan va CUV, kha nang em ai va ben bi.', 26, 'Lop Bridgestone Turanza T005A 225/50R18', b'1', 10100),
    (NOW(), NOW(), 1790000.00, '3M', 'Phim cach nhiet', 'Phim cach nhiet danh cho kinh lai va kinh suon, giam nong va tia UV.', 50, 'Phim cach nhiet 3M Crystalline goi co ban', b'1', 800),
    (NOW(), NOW(), 329000.00, 'Baseus', 'Gia do dien thoai', 'Gia do dien thoai kep cua gio, giu chac may va thao tac nhanh.', 120, 'Gia do dien thoai Baseus Air Vent', b'1', 180),
    (NOW(), NOW(), 459000.00, 'Baseus', 'Sac xe hoi', 'Sac nhanh 2 cong USB-C, cong suat den 65W, dung cho smartphone va tablet.', 85, 'Sac o to Baseus 65W USB-C', b'1', 160),
    (NOW(), NOW(), 1490000.00, 'Michelin', 'Tham lot san', 'Tham lot san 5D, de ve sinh, om sat form xe va giu khoang noi that sach.', 35, 'Tham lot san 5D sedan hang C', b'1', 3200),
    (NOW(), NOW(), 2690000.00, 'DaPro', 'Boc ghe da', 'Boc ghe da cong nghiep may chi noi, tang tham my va de lau chui.', 22, 'Boc ghe da cao cap 5 cho mau den', b'1', 6500),
    (NOW(), NOW(), 289000.00, 'Sparco', 'Boc vo lang', 'Boc vo lang da, cam nam chac tay, phong cach the thao.', 70, 'Boc vo lang Sparco da tron', b'1', 250),
    (NOW(), NOW(), 199000.00, 'OEM', 'Goi co', 'Goi tua co memory foam, giam moi khi di duong dai.', 95, 'Goi tua co memory foam cho ghe lai', b'1', 350),
    (NOW(), NOW(), 249000.00, 'OEM', 'Tui treo do', 'Tui treo sau ghe de dung khan giay, may tinh bang va vat dung nho.', 90, 'Tui treo lung ghe da nang', b'1', 280),
    (NOW(), NOW(), 359000.00, 'Bosch', 'Can gat mua', 'Can gat mua mem, gat sach, do on thap va de thay the.', 100, 'Can gat mua Bosch AeroTwin 24/18', b'1', 400),
    (NOW(), NOW(), 179000.00, 'Liqui Moly', 'Cham soc xe', 'Dung dich ve sinh kinh, han che vet mo va tang tam nhin khi troi mua.', 140, 'Dung dich ve sinh kinh Liqui Moly', b'1', 600),
    (NOW(), NOW(), 289000.00, '3M', 'Cham soc xe', 'Bo khan microfiber mem, phu hop lau son xe va noi that.', 150, 'Bo khan microfiber 3M 3 chiec', b'1', 250),
    (NOW(), NOW(), 990000.00, 'Xiaomi', 'Bom lop mini', 'May bom lop mini co man hinh dien tu, dung cho o to va xe may.', 55, 'May bom lop mini Xiaomi Portable Air Pump', b'1', 700),
    (NOW(), NOW(), 1890000.00, 'GS Battery', 'Ac quy', 'Ac quy danh cho sedan va CUV, dong khoi dong on dinh.', 20, 'Ac quy GS MF DIN45L 12V', b'1', 14500),
    (NOW(), NOW(), 469000.00, 'Stanley', 'Dung cu cuu ho', 'Bo day cau binh va kep dien co tui dung gon gang.', 65, 'Bo day cau binh Stanley 500A', b'1', 1400),
    (NOW(), NOW(), 359000.00, 'OEM', 'Bat phu xe', 'Bat phu xe chong nang mua, dung cho sedan va CUV co', 55, 'Bat phu xe chong nang size M', b'1', 1100),
    (NOW(), NOW(), 1390000.00, 'Philips', 'Den LED', 'Bong den LED tang sang, mau anh sang trang va tiet kiem dien.', 40, 'Den LED Philips Ultinon Pro6000 H11', b'1', 220),
    (NOW(), NOW(), 299000.00, 'OEM', 'Nuoc hoa xe hoi', 'Nuoc hoa xe hoi mui fresh linen, thiet ke gon dep.', 120, 'Nuoc hoa xe hoi kieu kep cua gio', b'1', 180),
    (NOW(), NOW(), 269000.00, 'Turtle Wax', 'Cham soc xe', 'Dung dich duong taplo, tao be mat sach va han che bam bui.', 100, 'Dung dich duong taplo Turtle Wax', b'1', 500),
    (NOW(), NOW(), 1190000.00, 'OEM', 'Camera 360', 'Mat camera roi de thay the cho he thong camera quanh xe.', 24, 'Mat camera 360 do phan giai HD', b'1', 280),
    (NOW(), NOW(), 399000.00, 'Anker', 'Sac xe hoi', 'Tau sac nhanh o to 2 cong, ho tro PD va bao ve qua dong.', 90, 'Sac o to Anker PowerDrive PD+2', b'1', 150),
    (NOW(), NOW(), 259000.00, 'OEM', 'Lot cop xe', 'Tam lot cop xe chong tham nuoc, de xep do va de ve sinh.', 80, 'Tam lot cop xe chong tham SUV hang C', b'1', 1300),
    (NOW(), NOW(), 189000.00, 'OEM', 'Moc treo', 'Moc treo do sau ghe, dung tui xach va vat dung nho gon gang.', 160, 'Moc treo do sau ghe hop kim 2 chiec', b'1', 140),
    (NOW(), NOW(), 599000.00, 'BlackVue', 'The nho camera', 'The nho toc do cao danh cho camera hanh trinh, dung luong 128GB.', 75, 'The nho camera hanh trinh 128GB', b'1', 80),
    (NOW(), NOW(), 449000.00, 'OEM', 'Hop ty tay', 'Hop ty tay bo sung cho hang ghe truoc, tang khong gian de vat dung.', 34, 'Hop ty tay phu cho sedan hang B', b'1', 1600),
    (NOW(), NOW(), 269000.00, 'OEM', 'Den noi that', 'Bo den LED noi that 4 vi tri, de lap dat va tang tinh tham my.', 85, 'Bo den LED noi that 4 vi tri mau trang', b'1', 220),
    (NOW(), NOW(), 699000.00, 'OEM', 'May hut bui', 'May hut bui mini cam tay, hop voi viec lam sach xe nhanh.', 48, 'May hut bui mini cam tay cho o to', b'1', 900),
    (NOW(), NOW(), 329000.00, 'OEM', 'Loc gio dieu hoa', 'Loc gio dieu hoa than hoat tinh, giam mui va bui min trong cabin.', 110, 'Loc gio dieu hoa than hoat tinh hang C', b'1', 260);

-- =========================
-- DICH_VU
-- =========================
INSERT INTO dich_vu (
    ngay_cap_nhat, ngay_tao, gia, mo_ta, ten_dich_vu, thoi_gian_uoc_tinh, trang_thai
) VALUES
    (NOW(), NOW(), 950000.00, 'Goi bao duong dinh ky co ban gom thay dau may, kiem tra loc gio, muc nuoc va he thong phanh.', 'Bao duong dinh ky 5.000 km', '90 phut', b'1'),
    (NOW(), NOW(), 1650000.00, 'Bao duong moc 10.000 km cho xe gia dinh, bo sung kiem tra he thong dien va loc dieu hoa.', 'Bao duong dinh ky 10.000 km', '120 phut', b'1'),
    (NOW(), NOW(), 750000.00, 'Thay dau dong co va loc dau danh cho sedan, CUV va SUV co dung tich may pho bien.', 'Thay dau dong co tong hop', '45 phut', b'1'),
    (NOW(), NOW(), 650000.00, 'Ve sinh khoang noi that, hut bui ghe, san, taplo va cac vi tri su dung thuong xuyen.', 'Ve sinh noi that co ban', '90 phut', b'1'),
    (NOW(), NOW(), 950000.00, 'Lam sach chi tiet khoang may bang dung dich chuyen dung, han che bam ban va mui kho chiu.', 'Ve sinh khoang may', '75 phut', b'1'),
    (NOW(), NOW(), 3990000.00, 'Danh bong va phu ceramic 1 lop, tang do bong va ho tro de ve sinh than xe.', 'Phu ceramic 1 lop', '6 gio', b'1'),
    (NOW(), NOW(), 8500000.00, 'Goi phu ceramic toan xe cao cap, tang kha nang chong bam nuoc va bao ve lop son.', 'Phu ceramic cao cap 3 lop', '2 ngay', b'1'),
    (NOW(), NOW(), 550000.00, 'Can bang dong 4 banh xe, giam rung lac khi chay toc do cao.', 'Can bang dong lop', '60 phut', b'1'),
    (NOW(), NOW(), 350000.00, 'Kiem tra he thong phanh, do mon bo thang va tu van thay the neu can.', 'Kiem tra he thong phanh', '45 phut', b'1'),
    (NOW(), NOW(), 1200000.00, 'Danh bong son xe 1 buoc giup xoa vet xoay nhe va tang do bong be mat.', 'Danh bong son xe 1 buoc', '4 gio', b'1'),
    (NOW(), NOW(), 450000.00, 'Khu mui khoi noi that bang ozone, phu hop xe thuong cho gia dinh va xe dich vu.', 'Khu mui noi that bang ozone', '45 phut', b'1'),
    (NOW(), NOW(), 600000.00, 'Bao duong dieu hoa gom kiem tra gas, ve sinh gian lanh va dan nong co ban.', 'Bao duong he thong dieu hoa', '75 phut', b'1'),
    (NOW(), NOW(), 320000.00, 'Kiem tra tong quat truoc chuyen di dai gom ap suat lop, den, ac quy va cac muc chat long.', 'Kiem tra tong quat truoc chuyen di', '30 phut', b'1'),
    (NOW(), NOW(), 1400000.00, 'Can chinh thuoc lai banh xe giup xe van hanh on dinh va han che mon lop khong deu.', 'Can chinh goc dat banh xe', '60 phut', b'1');

-- =========================
-- MEDIA
-- =========================
-- Car images
INSERT INTO media (
    ngay_cap_nhat, ngay_tao, chieu_cao, chieu_rong, dinh_dang, doi_tuong_id, dung_luong,
    loai_doi_tuong, loai_media, mo_ta, public_id, thoi_luong, thu_tu, url
)
SELECT NOW(), NOW(), 400, 1000, 'png', o.id, NULL, 'OTO', 'IMAGE',
       'Toyota Yaris Cross exterior image', 'seed/toyota-yaris-cross-1', NULL, 1,
       'https://www.toyota.com.vn/media/wuieo1yn/gia-xe-toyota-yaris-cross-1.jpg?height=333.3333333333333&width=500'
FROM oto o
WHERE o.ten_xe = 'Toyota Yaris Cross'
  AND NOT EXISTS (SELECT 1 FROM media m WHERE m.public_id = 'seed/toyota-yaris-cross-1');

INSERT INTO media (
    ngay_cap_nhat, ngay_tao, chieu_cao, chieu_rong, dinh_dang, doi_tuong_id, dung_luong,
    loai_doi_tuong, loai_media, mo_ta, public_id, thoi_luong, thu_tu, url
)
SELECT NOW(), NOW(), 400, 1000, 'png', o.id, NULL, 'OTO', 'IMAGE',
       'Toyota Yaris Cross cabin image', 'seed/toyota-yaris-cross-hev-1', NULL, 1,
       'https://www.toyota.com.vn/media/5loprm4h/gia-xe-toyota-yaris-cross-4.jpg?height=333.3333333333333&width=500'
FROM oto o
WHERE o.ten_xe = 'Toyota Yaris Cross HEV'
  AND NOT EXISTS (SELECT 1 FROM media m WHERE m.public_id = 'seed/toyota-yaris-cross-hev-1');

INSERT INTO media (
    ngay_cap_nhat, ngay_tao, chieu_cao, chieu_rong, dinh_dang, doi_tuong_id, dung_luong,
    loai_doi_tuong, loai_media, mo_ta, public_id, thoi_luong, thu_tu, url
)
SELECT NOW(), NOW(), 400, 1000, 'png', o.id, NULL, 'OTO', 'IMAGE',
       'Toyota Corolla Cross image', 'seed/toyota-corolla-cross-1', NULL, 1,
       'https://www.toyota.com.vn/media/wuieo1yn/gia-xe-toyota-yaris-cross-1.jpg?height=333.3333333333333&width=500'
FROM oto o
WHERE o.ten_xe = 'Toyota Corolla Cross 1.8V'
  AND NOT EXISTS (SELECT 1 FROM media m WHERE m.public_id = 'seed/toyota-corolla-cross-1');

INSERT INTO media (
    ngay_cap_nhat, ngay_tao, chieu_cao, chieu_rong, dinh_dang, doi_tuong_id, dung_luong,
    loai_doi_tuong, loai_media, mo_ta, public_id, thoi_luong, thu_tu, url
)
SELECT NOW(), NOW(), 400, 1000, 'png', o.id, NULL, 'OTO', 'IMAGE',
       'Toyota Corolla Cross hybrid image', 'seed/toyota-corolla-cross-hev-1', NULL, 1,
       'https://www.toyota.com.vn/media/wuieo1yn/gia-xe-toyota-yaris-cross-1.jpg?height=333.3333333333333&width=500'
FROM oto o
WHERE o.ten_xe = 'Toyota Corolla Cross 1.8HEV'
  AND NOT EXISTS (SELECT 1 FROM media m WHERE m.public_id = 'seed/toyota-corolla-cross-hev-1');

INSERT INTO media (
    ngay_cap_nhat, ngay_tao, chieu_cao, chieu_rong, dinh_dang, doi_tuong_id, dung_luong,
    loai_doi_tuong, loai_media, mo_ta, public_id, thoi_luong, thu_tu, url
)
SELECT NOW(), NOW(), 400, 1000, 'png', o.id, NULL, 'OTO', 'IMAGE',
       'Honda City hero image', 'seed/honda-city-rs-1', NULL, 1,
       'https://cdn.honda.com.vn/automobiles/October2024/2W6sOZo9eoj3a1LPNLZL.png'
FROM oto o
WHERE o.ten_xe = 'Honda City RS'
  AND NOT EXISTS (SELECT 1 FROM media m WHERE m.public_id = 'seed/honda-city-rs-1');

INSERT INTO media (
    ngay_cap_nhat, ngay_tao, chieu_cao, chieu_rong, dinh_dang, doi_tuong_id, dung_luong,
    loai_doi_tuong, loai_media, mo_ta, public_id, thoi_luong, thu_tu, url
)
SELECT NOW(), NOW(), 400, 1000, 'png', o.id, NULL, 'OTO', 'IMAGE',
       'Honda BR-V hero image', 'seed/honda-brv-l-1', NULL, 1,
       'https://cdn.honda.com.vn/automobiles/October2024/qku1lCjhFcnHtLochSE4.png'
FROM oto o
WHERE o.ten_xe = 'Honda BR-V L'
  AND NOT EXISTS (SELECT 1 FROM media m WHERE m.public_id = 'seed/honda-brv-l-1');

INSERT INTO media (
    ngay_cap_nhat, ngay_tao, chieu_cao, chieu_rong, dinh_dang, doi_tuong_id, dung_luong,
    loai_doi_tuong, loai_media, mo_ta, public_id, thoi_luong, thu_tu, url
)
SELECT NOW(), NOW(), 400, 1000, 'png', o.id, NULL, 'OTO', 'IMAGE',
       'Honda HR-V hero image', 'seed/honda-hrv-l-1', NULL, 1,
       'https://cdn.honda.com.vn/automobiles/April2025/mftNfgWHVfND1LCLBg6g.png'
FROM oto o
WHERE o.ten_xe = 'Honda HR-V L'
  AND NOT EXISTS (SELECT 1 FROM media m WHERE m.public_id = 'seed/honda-hrv-l-1');

INSERT INTO media (
    ngay_cap_nhat, ngay_tao, chieu_cao, chieu_rong, dinh_dang, doi_tuong_id, dung_luong,
    loai_doi_tuong, loai_media, mo_ta, public_id, thoi_luong, thu_tu, url
)
SELECT NOW(), NOW(), 400, 1000, 'png', o.id, NULL, 'OTO', 'IMAGE',
       'Honda CR-V hero image', 'seed/honda-crv-hev-rs-1', NULL, 1,
       'https://cdn.honda.com.vn/home_banner_automobile/February2026/bQd04OvWaavdyG9Tbyia.png'
FROM oto o
WHERE o.ten_xe = 'Honda CR-V e:HEV RS'
  AND NOT EXISTS (SELECT 1 FROM media m WHERE m.public_id = 'seed/honda-crv-hev-rs-1');

INSERT INTO media (
    ngay_cap_nhat, ngay_tao, chieu_cao, chieu_rong, dinh_dang, doi_tuong_id, dung_luong,
    loai_doi_tuong, loai_media, mo_ta, public_id, thoi_luong, thu_tu, url
)
SELECT NOW(), NOW(), 400, 1000, 'png', o.id, NULL, 'OTO', 'IMAGE',
       'Honda Civic hero image', 'seed/honda-civic-hev-rs-1', NULL, 1,
       'https://cdn.honda.com.vn/automobiles/October2024/2W6sOZo9eoj3a1LPNLZL.png'
FROM oto o
WHERE o.ten_xe = 'Honda Civic e:HEV RS'
  AND NOT EXISTS (SELECT 1 FROM media m WHERE m.public_id = 'seed/honda-civic-hev-rs-1');

INSERT INTO media (
    ngay_cap_nhat, ngay_tao, chieu_cao, chieu_rong, dinh_dang, doi_tuong_id, dung_luong,
    loai_doi_tuong, loai_media, mo_ta, public_id, thoi_luong, thu_tu, url
)
SELECT NOW(), NOW(), 333, 500, 'jpg', o.id, NULL, 'OTO', 'IMAGE',
       'Representative SUV image', 'seed/ford-ranger-wildtrak-1', NULL, 1,
       'https://www.toyota.com.vn/media/wuieo1yn/gia-xe-toyota-yaris-cross-1.jpg?height=333.3333333333333&width=500'
FROM oto o
WHERE o.ten_xe = 'Ford Ranger Wildtrak 2.0L 4x4 AT'
  AND NOT EXISTS (SELECT 1 FROM media m WHERE m.public_id = 'seed/ford-ranger-wildtrak-1');

-- Accessory images
INSERT INTO media (
    ngay_cap_nhat, ngay_tao, chieu_cao, chieu_rong, dinh_dang, doi_tuong_id, dung_luong,
    loai_doi_tuong, loai_media, mo_ta, public_id, thoi_luong, thu_tu, url
)
SELECT NOW(), NOW(), 720, 1280, 'jpg', p.id, NULL, 'PHU_KIEN', 'IMAGE',
       'Accessory category image', 'seed/phu-kien-camera-hanh-trinh-70mai-a500s-1', NULL, 1,
       'https://www.honda.com.vn/images/o-to/landing-page-phu-kien.jpg'
FROM phu_kien p
WHERE p.ten_phu_kien = 'Camera hanh trinh 70mai A500S'
  AND NOT EXISTS (SELECT 1 FROM media m WHERE m.public_id = 'seed/phu-kien-camera-hanh-trinh-70mai-a500s-1');

INSERT INTO media (
    ngay_cap_nhat, ngay_tao, chieu_cao, chieu_rong, dinh_dang, doi_tuong_id, dung_luong,
    loai_doi_tuong, loai_media, mo_ta, public_id, thoi_luong, thu_tu, url
)
SELECT NOW(), NOW(), 720, 1280, 'jpg', p.id, NULL, 'PHU_KIEN', 'IMAGE',
       'Accessory category image', 'seed/phu-kien-man-hinh-zestech-zx10-1', NULL, 1,
       'https://www.honda.com.vn/images/o-to/landing-page-phu-kien.jpg'
FROM phu_kien p
WHERE p.ten_phu_kien = 'Man hinh Android Zestech ZX10'
  AND NOT EXISTS (SELECT 1 FROM media m WHERE m.public_id = 'seed/phu-kien-man-hinh-zestech-zx10-1');

INSERT INTO media (
    ngay_cap_nhat, ngay_tao, chieu_cao, chieu_rong, dinh_dang, doi_tuong_id, dung_luong,
    loai_doi_tuong, loai_media, mo_ta, public_id, thoi_luong, thu_tu, url
)
SELECT NOW(), NOW(), 720, 1280, 'jpg', p.id, NULL, 'PHU_KIEN', 'IMAGE',
       'Accessory category image', 'seed/phu-kien-lop-michelin-primacy4-1', NULL, 1,
       'https://www.honda.com.vn/images/o-to/landing-page-phu-kien.jpg'
FROM phu_kien p
WHERE p.ten_phu_kien = 'Lop Michelin Primacy 4 215/55R17'
  AND NOT EXISTS (SELECT 1 FROM media m WHERE m.public_id = 'seed/phu-kien-lop-michelin-primacy4-1');

INSERT INTO media (
    ngay_cap_nhat, ngay_tao, chieu_cao, chieu_rong, dinh_dang, doi_tuong_id, dung_luong,
    loai_doi_tuong, loai_media, mo_ta, public_id, thoi_luong, thu_tu, url
)
SELECT NOW(), NOW(), 720, 1280, 'jpg', p.id, NULL, 'PHU_KIEN', 'IMAGE',
       'Accessory category image', 'seed/phu-kien-phim-cach-nhiet-3m-1', NULL, 1,
       'https://www.honda.com.vn/images/o-to/landing-page-phu-kien.jpg'
FROM phu_kien p
WHERE p.ten_phu_kien = 'Phim cach nhiet 3M Crystalline goi co ban'
  AND NOT EXISTS (SELECT 1 FROM media m WHERE m.public_id = 'seed/phu-kien-phim-cach-nhiet-3m-1');

INSERT INTO media (
    ngay_cap_nhat, ngay_tao, chieu_cao, chieu_rong, dinh_dang, doi_tuong_id, dung_luong,
    loai_doi_tuong, loai_media, mo_ta, public_id, thoi_luong, thu_tu, url
)
SELECT NOW(), NOW(), 720, 1280, 'jpg', p.id, NULL, 'PHU_KIEN', 'IMAGE',
       'Accessory category image', 'seed/phu-kien-sac-xe-hoi-baseus-1', NULL, 1,
       'https://www.honda.com.vn/images/o-to/landing-page-phu-kien.jpg'
FROM phu_kien p
WHERE p.ten_phu_kien = 'Sac o to Baseus 65W USB-C'
  AND NOT EXISTS (SELECT 1 FROM media m WHERE m.public_id = 'seed/phu-kien-sac-xe-hoi-baseus-1');

-- Service images
INSERT INTO media (
    ngay_cap_nhat, ngay_tao, chieu_cao, chieu_rong, dinh_dang, doi_tuong_id, dung_luong,
    loai_doi_tuong, loai_media, mo_ta, public_id, thoi_luong, thu_tu, url
)
SELECT NOW(), NOW(), 720, 1280, 'jpg', d.id, NULL, 'DICH_VU', 'IMAGE',
       'Service category image', 'seed/dich-vu-bao-duong-5000-1', NULL, 1,
       'https://www.honda.com.vn/images/o-to/landing-page-service.jpg'
FROM dich_vu d
WHERE d.ten_dich_vu = 'Bao duong dinh ky 5.000 km'
  AND NOT EXISTS (SELECT 1 FROM media m WHERE m.public_id = 'seed/dich-vu-bao-duong-5000-1');

INSERT INTO media (
    ngay_cap_nhat, ngay_tao, chieu_cao, chieu_rong, dinh_dang, doi_tuong_id, dung_luong,
    loai_doi_tuong, loai_media, mo_ta, public_id, thoi_luong, thu_tu, url
)
SELECT NOW(), NOW(), 720, 1280, 'jpg', d.id, NULL, 'DICH_VU', 'IMAGE',
       'Service category image', 'seed/dich-vu-thay-dau-dong-co-1', NULL, 1,
       'https://www.honda.com.vn/images/o-to/landing-page-service.jpg'
FROM dich_vu d
WHERE d.ten_dich_vu = 'Thay dau dong co tong hop'
  AND NOT EXISTS (SELECT 1 FROM media m WHERE m.public_id = 'seed/dich-vu-thay-dau-dong-co-1');

INSERT INTO media (
    ngay_cap_nhat, ngay_tao, chieu_cao, chieu_rong, dinh_dang, doi_tuong_id, dung_luong,
    loai_doi_tuong, loai_media, mo_ta, public_id, thoi_luong, thu_tu, url
)
SELECT NOW(), NOW(), 720, 1280, 'jpg', d.id, NULL, 'DICH_VU', 'IMAGE',
       'Service category image', 'seed/dich-vu-ve-sinh-noi-that-1', NULL, 1,
       'https://www.honda.com.vn/images/o-to/landing-page-service.jpg'
FROM dich_vu d
WHERE d.ten_dich_vu = 'Ve sinh noi that co ban'
  AND NOT EXISTS (SELECT 1 FROM media m WHERE m.public_id = 'seed/dich-vu-ve-sinh-noi-that-1');

INSERT INTO media (
    ngay_cap_nhat, ngay_tao, chieu_cao, chieu_rong, dinh_dang, doi_tuong_id, dung_luong,
    loai_doi_tuong, loai_media, mo_ta, public_id, thoi_luong, thu_tu, url
)
SELECT NOW(), NOW(), 720, 1280, 'jpg', d.id, NULL, 'DICH_VU', 'IMAGE',
       'Service category image', 'seed/dich-vu-phu-ceramic-1', NULL, 1,
       'https://www.honda.com.vn/images/o-to/landing-page-service.jpg'
FROM dich_vu d
WHERE d.ten_dich_vu = 'Phu ceramic 1 lop'
  AND NOT EXISTS (SELECT 1 FROM media m WHERE m.public_id = 'seed/dich-vu-phu-ceramic-1');

INSERT INTO media (
    ngay_cap_nhat, ngay_tao, chieu_cao, chieu_rong, dinh_dang, doi_tuong_id, dung_luong,
    loai_doi_tuong, loai_media, mo_ta, public_id, thoi_luong, thu_tu, url
)
SELECT NOW(), NOW(), 720, 1280, 'jpg', d.id, NULL, 'DICH_VU', 'IMAGE',
       'Service category image', 'seed/dich-vu-bao-duong-dieu-hoa-1', NULL, 1,
       'https://www.honda.com.vn/images/o-to/landing-page-service.jpg'
FROM dich_vu d
WHERE d.ten_dich_vu = 'Bao duong he thong dieu hoa'
  AND NOT EXISTS (SELECT 1 FROM media m WHERE m.public_id = 'seed/dich-vu-bao-duong-dieu-hoa-1');

-- =========================
-- EXTENDED OTO
-- =========================
INSERT INTO oto (
    ngay_cap_nhat, ngay_tao, dong_co, dong_xe, gia, hang_xe, hop_so, mau_sac, mo_ta,
    nam_san_xuat, nhien_lieu, so_km, so_luong, ten_xe, trang_thai
) VALUES
    (NOW(), NOW(), '1.5L', 'Veloz Cross', 638000000.00, 'Toyota', 'CVT', 'Trang ngoc trai', 'MPV 7 cho thuc dung, khoang cabin linh hoat va de su dung cho gia dinh.', 2025, 'Xang', 0, 4, 'Toyota Veloz Cross CVT', 'DANG_BAN'),
    (NOW(), NOW(), '2.0L', 'Civic', 789000000.00, 'Honda', 'CVT', 'Den anh', 'Sedan hang C thiet ke tre, khung gam chac chan va kha nang van hanh can bang.', 2025, 'Xang', 0, 3, 'Honda Civic G', 'DANG_BAN'),
    (NOW(), NOW(), '1.5L', 'HR-V', 699000000.00, 'Honda', 'CVT', 'Xam', 'SUV do thi gon gang, trang bi an toan co ban va phu hop nguoi mua xe lan dau.', 2025, 'Xang', 0, 3, 'Honda HR-V G', 'DANG_BAN'),
    (NOW(), NOW(), '1.5L', 'Creta', 699000000.00, 'Hyundai', 'IVT', 'Do', 'SUV hang B thiet ke trung tinh, danh cho nhu cau di chuyen hang ngay va gia dinh nho.', 2025, 'Xang', 0, 4, 'Hyundai Creta Dac biet', 'DANG_BAN'),
    (NOW(), NOW(), '2.0L', 'Elantra', 769000000.00, 'Hyundai', 'AT 6 cap', 'Trang', 'Sedan co thiet ke the thao, khoang noi that rong va trang bi kha day du.', 2025, 'Xang', 0, 3, 'Hyundai Elantra 2.0 AT', 'DANG_BAN'),
    (NOW(), NOW(), '1.5L', 'K3', 669000000.00, 'Kia', 'CVT', 'Xanh', 'Sedan hang C thiet ke bat mat, trang bi man hinh lon va de tiep can trong tam gia.', 2025, 'Xang', 0, 4, 'Kia K3 1.5 Luxury', 'DANG_BAN'),
    (NOW(), NOW(), '2.0L', 'Sportage', 919000000.00, 'Kia', 'AT 6 cap', 'Xam', 'SUV hang C noi that hien dai, ghe ngoi thoai mai va trang bi an toan tot.', 2025, 'Xang', 0, 3, 'Kia Sportage 2.0G Premium', 'DANG_BAN'),
    (NOW(), NOW(), '1.5L', 'Mazda2', 509000000.00, 'Mazda', 'AT 6 cap', 'Do', 'Sedan hang B thiet ke nho gon, chat luong hoan thien kha tot trong tam gia.', 2025, 'Xang', 0, 4, 'Mazda2 1.5 Luxury', 'DANG_BAN'),
    (NOW(), NOW(), '2.0L', 'CX-30', 749000000.00, 'Mazda', 'AT 6 cap', 'Trang', 'CUV co thiet ke thoi trang, phu hop nguoi dung tre uu tien phong cach.', 2025, 'Xang', 0, 3, 'Mazda CX-30 Luxury', 'DANG_BAN'),
    (NOW(), NOW(), '1.5L EcoBoost', 'Territory', 889000000.00, 'Ford', 'DCT 7 cap', 'Den', 'SUV hang C rong rai, kha nang cach am tot va giao dien noi that hien dai.', 2025, 'Xang', 0, 3, 'Ford Territory Titanium X', 'DANG_BAN'),
    (NOW(), NOW(), '1.5L', 'Attrage', 490000000.00, 'Mitsubishi', 'CVT', 'Bac', 'Sedan tiet kiem nhien lieu, phu hop chay dich vu va gia dinh can chi phi hop ly.', 2025, 'Xang', 0, 5, 'Mitsubishi Attrage CVT Premium', 'DANG_BAN'),
    (NOW(), NOW(), '2.4L', 'Outlander', 950000000.00, 'Mitsubishi', 'CVT', 'Trang', 'SUV 7 cho co ban, noi that thuc dung va kha nang su dung linh hoat.', 2024, 'Xang', 0, 2, 'Mitsubishi Outlander 2.4 CVT Premium', 'DANG_BAN'),
    (NOW(), NOW(), 'Electric', 'VF 6', 689000000.00, 'VinFast', '1 cap', 'Do', 'SUV dien do thi co kich thuoc gon, giao dien dieu khien hien dai va chi phi van hanh thap.', 2025, 'Dien', 0, 4, 'VinFast VF 6 Plus', 'DANG_BAN'),
    (NOW(), NOW(), 'Electric', 'VF 7', 999000000.00, 'VinFast', '1 cap', 'Trang', 'SUV dien thiet ke ca tinh, khoang cabin rong va man hinh giai tri lon.', 2025, 'Dien', 0, 3, 'VinFast VF 7 Plus', 'DANG_BAN'),
    (NOW(), NOW(), '1.2L Turbo', 'Raize', 552000000.00, 'Toyota', 'CVT', 'Vang cat', 'SUV hang A gon nhe, de xoay tro va phu hop duong pho dong duc.', 2024, 'Xang', 0, 4, 'Toyota Raize Turbo', 'DANG_BAN'),
    (NOW(), NOW(), '1.5L', 'City Hatchback', 589000000.00, 'Honda', 'CVT', 'Xanh', 'Ban hatchback linh hoat, phong cach tre trung va khoang hanh ly thuc dung.', 2025, 'Xang', 0, 2, 'Honda City Hatchback RS', 'DANG_BAN');

-- =========================
-- EXTENDED PHU_KIEN
-- =========================
INSERT INTO phu_kien (
    ngay_cap_nhat, ngay_tao, gia, hang_san_xuat, loai_phu_kien, mo_ta,
    so_luong, ten_phu_kien, trang_thai, trong_luong
) VALUES
    (NOW(), NOW(), 249000.00, 'Wurth', 'Cham soc xe', 'Bot rua xe khong cham, tao be mat sach va han che xoay son.', 120, 'Dung dich rua xe khong cham Wurth', b'1', 1000),
    (NOW(), NOW(), 189000.00, 'Sonax', 'Cham soc xe', 'Nuoc rua kinh tap trung vao kha nang lam sach nhanh va de bay hoi.', 130, 'Nuoc rua kinh Sonax Clear View', b'1', 850),
    (NOW(), NOW(), 1890000.00, 'OEM', 'Bec buoc len xuong', 'Bec buoc cho SUV, tang tinh tham my va ho tro len xuong xe.', 18, 'Bec buoc len xuong cho SUV hang C', b'1', 8500),
    (NOW(), NOW(), 1590000.00, 'OEM', 'Gia noc', 'Gia noc nhom cho CUV, phu hop de gan hop do va vat dung du lich.', 16, 'Gia noc nhom cho SUV 5 cho', b'1', 6200),
    (NOW(), NOW(), 2790000.00, 'Thule', 'Hop de do', 'Hop de do tren noc xe phu hop chuyen di xa va du lich gia dinh.', 8, 'Hop de do noc xe Thule Ocean 100', b'1', 14500),
    (NOW(), NOW(), 990000.00, 'OEM', 'Camera cap le', 'Bo camera hanh trinh sau de mo rong he thong ghi hinh truoc sau.', 32, 'Camera sau bo sung cho camera hanh trinh', b'1', 260),
    (NOW(), NOW(), 149000.00, 'OEM', 'Mieng dan chong xuoc', 'Mieng dan bao ve tay nam cua va canh cua khoi vet va cham nhe.', 180, 'Mieng dan chong xuoc tay nam cua', b'1', 90),
    (NOW(), NOW(), 399000.00, 'OEM', 'Op bac len xuong', 'Nep bac cua bang inox, tang tham my va de ve sinh.', 65, 'Nep bac cua inox 4 canh', b'1', 700),
    (NOW(), NOW(), 1290000.00, 'Pioneer', 'Loa xe hoi', 'Cap loa co ban nang cap am thanh khoang cabin.', 20, 'Cap loa Pioneer 2 duong tieng', b'1', 2100),
    (NOW(), NOW(), 3290000.00, 'JBL', 'Loa sub', 'Loa sub gam ghe giup tang am tram cho he thong giai tri tren xe.', 12, 'Loa sub gam ghe JBL BassPro SL2', b'1', 5400),
    (NOW(), NOW(), 219000.00, 'OEM', 'Rem cua xe', 'Rem che nang cua sau, de lap dat va phu hop xe gia dinh co tre nho.', 90, 'Rem che nang cua sau nam cham', b'1', 300),
    (NOW(), NOW(), 179000.00, 'OEM', 'Thung rac mini', 'Thung rac mini goi gon, de trong hoc de do hoac canh cua.', 140, 'Thung rac mini cho o to co nap', b'1', 220),
    (NOW(), NOW(), 499000.00, 'OEM', 'Dem hoi hoi', 'Dem hoi hoi su dung cho chuyen di xa va nghi tam tren xe.', 40, 'Nem hoi hoi mini cho ghe sau', b'1', 1300),
    (NOW(), NOW(), 269000.00, 'OEM', 'Bat chong loa', 'Bat chong loa noi that chong bui va nep dan de lap nhanh.', 70, 'Bat chong loa taplo da nang', b'1', 500),
    (NOW(), NOW(), 359000.00, 'OEM', 'Tu dong mo cop', 'Bo day va lo xo ho tro mo cop sau cho sedan.', 26, 'Bo ho tro mo cop sau tu dong', b'1', 850),
    (NOW(), NOW(), 199000.00, 'OEM', 'Lot ly', 'Bo lot ly cao su chong truot danh cho vi tri de coc tren xe.', 160, 'Bo lot ly cao su chong truot', b'1', 120),
    (NOW(), NOW(), 279000.00, 'OEM', 'Khay co', 'Khay chia ngan cho hoc ty tay, giup sap xep vat dung gon gang.', 120, 'Khay chia ngan hoc ty tay', b'1', 180),
    (NOW(), NOW(), 229000.00, 'OEM', 'Day an toan ghe', 'Dau khoa gia lap canh bao day an toan cho vi tri khong co nguoi ngoi.', 150, 'Dau khoa day an toan gia lap', b'1', 100),
    (NOW(), NOW(), 599000.00, 'OEM', 'May khuu mui', 'May khuu mui mini danh cho khoang cabin nho, su dung nguon USB.', 38, 'May khuu mui mini cho o to', b'1', 600),
    (NOW(), NOW(), 329000.00, 'OEM', 'Quat mini', 'Quat mini quay 360 do, phu hop cho hang ghe sau.', 88, 'Quat mini kep cua gio dieu hoa', b'1', 320),
    (NOW(), NOW(), 459000.00, 'OEM', 'May loc khong khi', 'May loc khong khi mini cho cabin, co bo loc thay the.', 30, 'May loc khong khi mini cabin', b'1', 950),
    (NOW(), NOW(), 189000.00, 'OEM', 'Den pin cuu ho', 'Den pin su dung khi su co ban dem, co nam cham de dinh than xe.', 130, 'Den pin cuu ho da nang nam cham', b'1', 260),
    (NOW(), NOW(), 699000.00, 'Bosch', 'Bugi', 'Bo bugi danh cho dong co xang pho bien, giup khoi dong on dinh.', 60, 'Bo bugi Bosch iridium 4 may', b'1', 400),
    (NOW(), NOW(), 249000.00, 'OEM', 'Loc dau', 'Loc dau thay the cho dong co xang phan khuc sedan va SUV co.', 100, 'Loc dau dong co thay the', b'1', 220),
    (NOW(), NOW(), 389000.00, 'OEM', 'Loc gio dong co', 'Loc gio dong co loai day, giup toi uu luong gio nap.', 95, 'Loc gio dong co SUV hang C', b'1', 320);

-- =========================
-- EXTENDED DICH_VU
-- =========================
INSERT INTO dich_vu (
    ngay_cap_nhat, ngay_tao, gia, mo_ta, ten_dich_vu, thoi_gian_uoc_tinh, trang_thai
) VALUES
    (NOW(), NOW(), 1800000.00, 'Ve sinh kim phun va buong dot cho dong co xang, cai thien do muot khi van hanh.', 'Ve sinh kim phun va buong dot', '120 phut', b'1'),
    (NOW(), NOW(), 520000.00, 'Dao lop dinh ky de can bang mon giua cac banh xe.', 'Dao lop dinh ky 4 banh', '40 phut', b'1'),
    (NOW(), NOW(), 2500000.00, 'Thay dau hop so tu dong va kiem tra ro ri co ban.', 'Bao duong hop so tu dong', '150 phut', b'1'),
    (NOW(), NOW(), 890000.00, 'Phu dung dich chong bam nuoc cho kinh lai va kinh suon.', 'Phu nano kinh xe', '60 phut', b'1'),
    (NOW(), NOW(), 780000.00, 'Ve sinh khoang gam, giam bun dat bam duoi san xe.', 'Ve sinh gam xe', '90 phut', b'1'),
    (NOW(), NOW(), 1650000.00, 'Danh bong den pha giup den trong hon va cai thien do sang khi di dem.', 'Phuc hoi den pha bi o', '90 phut', b'1'),
    (NOW(), NOW(), 420000.00, 'Kiem tra ac quy, may phat va he thong khoi dong.', 'Kiem tra he thong dien co ban', '30 phut', b'1'),
    (NOW(), NOW(), 1100000.00, 'Thay loc gio dong co va loc gio dieu hoa ket hop ve sinh khoang hut gio.', 'Combo thay loc gio va ve sinh hut gio', '60 phut', b'1'),
    (NOW(), NOW(), 1300000.00, 'Phu dung dich bao ve khoang may va chi tiet nhua cao su.', 'Duong khoang may chuyen sau', '120 phut', b'1'),
    (NOW(), NOW(), 490000.00, 'Ve sinh phanh, loai bo bui phanh va kiem tra do mon bo thang.', 'Ve sinh cum phanh 4 banh', '60 phut', b'1'),
    (NOW(), NOW(), 2400000.00, 'Phu goi cham soc tong the gom rua xe, hut bui, danh bong nhe va duong noi that.', 'Goi cham soc xe tong the', '5 gio', b'1');

-- =========================
-- EXTENDED MEDIA
-- =========================
INSERT INTO media (
    ngay_cap_nhat, ngay_tao, chieu_cao, chieu_rong, dinh_dang, doi_tuong_id, dung_luong,
    loai_doi_tuong, loai_media, mo_ta, public_id, thoi_luong, thu_tu, url
)
SELECT NOW(), NOW(), 400, 1000, 'png', o.id, NULL, 'OTO', 'IMAGE',
       'Representative Honda image', CONCAT('seed/', REPLACE(LOWER(o.ten_xe), ' ', '-'), '-hero'), NULL, 1,
       'https://cdn.honda.com.vn/automobiles/October2024/2W6sOZo9eoj3a1LPNLZL.png'
FROM oto o
WHERE o.ten_xe IN ('Honda Civic G', 'Honda HR-V G', 'Honda City Hatchback RS')
  AND NOT EXISTS (
      SELECT 1 FROM media m
      WHERE m.public_id = CONCAT('seed/', REPLACE(LOWER(o.ten_xe), ' ', '-'), '-hero')
  );

INSERT INTO media (
    ngay_cap_nhat, ngay_tao, chieu_cao, chieu_rong, dinh_dang, doi_tuong_id, dung_luong,
    loai_doi_tuong, loai_media, mo_ta, public_id, thoi_luong, thu_tu, url
)
SELECT NOW(), NOW(), 333, 500, 'jpg', o.id, NULL, 'OTO', 'IMAGE',
       'Representative Toyota image', CONCAT('seed/', REPLACE(LOWER(o.ten_xe), ' ', '-'), '-hero'), NULL, 1,
       'https://www.toyota.com.vn/media/wuieo1yn/gia-xe-toyota-yaris-cross-1.jpg?height=333.3333333333333&width=500'
FROM oto o
WHERE o.ten_xe IN ('Toyota Veloz Cross CVT', 'Toyota Vios G CVT', 'Toyota Raize Turbo')
  AND NOT EXISTS (
      SELECT 1 FROM media m
      WHERE m.public_id = CONCAT('seed/', REPLACE(LOWER(o.ten_xe), ' ', '-'), '-hero')
  );

INSERT INTO media (
    ngay_cap_nhat, ngay_tao, chieu_cao, chieu_rong, dinh_dang, doi_tuong_id, dung_luong,
    loai_doi_tuong, loai_media, mo_ta, public_id, thoi_luong, thu_tu, url
)
SELECT NOW(), NOW(), 333, 500, 'jpg', o.id, NULL, 'OTO', 'IMAGE',
       'Representative car image', CONCAT('seed/', REPLACE(LOWER(o.ten_xe), ' ', '-'), '-rep'), NULL, 1,
       'https://www.toyota.com.vn/media/wuieo1yn/gia-xe-toyota-yaris-cross-1.jpg?height=333.3333333333333&width=500'
FROM oto o
WHERE o.ten_xe IN (
    'Mazda2 1.5 Luxury',
    'Mazda CX-30 Luxury',
    'Hyundai Creta Dac biet',
    'Hyundai Elantra 2.0 AT',
    'Kia K3 1.5 Luxury',
    'Kia Sportage 2.0G Premium',
    'Ford Territory Titanium X',
    'Mitsubishi Attrage CVT Premium',
    'Mitsubishi Outlander 2.4 CVT Premium',
    'VinFast VF 6 Plus',
    'VinFast VF 7 Plus'
)
  AND NOT EXISTS (
      SELECT 1 FROM media m
      WHERE m.public_id = CONCAT('seed/', REPLACE(LOWER(o.ten_xe), ' ', '-'), '-rep')
  );

INSERT INTO media (
    ngay_cap_nhat, ngay_tao, chieu_cao, chieu_rong, dinh_dang, doi_tuong_id, dung_luong,
    loai_doi_tuong, loai_media, mo_ta, public_id, thoi_luong, thu_tu, url
)
SELECT NOW(), NOW(), 720, 1280, 'jpg', p.id, NULL, 'PHU_KIEN', 'IMAGE',
       'Accessory representative image', CONCAT('seed/', REPLACE(LOWER(p.ten_phu_kien), ' ', '-'), '-rep'), NULL, 1,
       'https://www.honda.com.vn/images/o-to/landing-page-phu-kien.jpg'
FROM phu_kien p
WHERE p.ten_phu_kien IN (
    'Boc ghe da cao cap 5 cho mau den',
    'May bom lop mini Xiaomi Portable Air Pump',
    'Ac quy GS MF DIN45L 12V',
    'Bo day cau binh Stanley 500A',
    'May hut bui mini cam tay cho o to',
    'Hop ty tay phu cho sedan hang B',
    'Quat mini kep cua gio dieu hoa',
    'May loc khong khi mini cabin',
    'Loa sub gam ghe JBL BassPro SL2',
    'Gia noc nhom cho SUV 5 cho'
)
  AND NOT EXISTS (
      SELECT 1 FROM media m
      WHERE m.public_id = CONCAT('seed/', REPLACE(LOWER(p.ten_phu_kien), ' ', '-'), '-rep')
  );

INSERT INTO media (
    ngay_cap_nhat, ngay_tao, chieu_cao, chieu_rong, dinh_dang, doi_tuong_id, dung_luong,
    loai_doi_tuong, loai_media, mo_ta, public_id, thoi_luong, thu_tu, url
)
SELECT NOW(), NOW(), 720, 1280, 'jpg', d.id, NULL, 'DICH_VU', 'IMAGE',
       'Service representative image', CONCAT('seed/', REPLACE(LOWER(d.ten_dich_vu), ' ', '-'), '-rep'), NULL, 1,
       'https://www.honda.com.vn/images/o-to/landing-page-service.jpg'
FROM dich_vu d
WHERE d.ten_dich_vu IN (
    'Bao duong hop so tu dong',
    'Ve sinh kim phun va buong dot',
    'Phu nano kinh xe',
    'Ve sinh gam xe',
    'Phuc hoi den pha bi o',
    'Goi cham soc xe tong the'
)
  AND NOT EXISTS (
      SELECT 1 FROM media m
      WHERE m.public_id = CONCAT('seed/', REPLACE(LOWER(d.ten_dich_vu), ' ', '-'), '-rep')
  );

-- Fill remaining records without media so list/detail pages look complete in demo
INSERT INTO media (
    ngay_cap_nhat, ngay_tao, chieu_cao, chieu_rong, dinh_dang, doi_tuong_id, dung_luong,
    loai_doi_tuong, loai_media, mo_ta, public_id, thoi_luong, thu_tu, url
)
SELECT NOW(), NOW(), 333, 500, 'jpg', o.id, NULL, 'OTO', 'IMAGE',
       'Fallback car image for demo coverage',
       CONCAT('seed/fallback-oto-', o.id),
       NULL,
       1,
       'https://www.toyota.com.vn/media/wuieo1yn/gia-xe-toyota-yaris-cross-1.jpg?height=333.3333333333333&width=500'
FROM oto o
LEFT JOIN media m ON m.loai_doi_tuong = 'OTO' AND m.doi_tuong_id = o.id
WHERE m.id IS NULL;

INSERT INTO media (
    ngay_cap_nhat, ngay_tao, chieu_cao, chieu_rong, dinh_dang, doi_tuong_id, dung_luong,
    loai_doi_tuong, loai_media, mo_ta, public_id, thoi_luong, thu_tu, url
)
SELECT NOW(), NOW(), 720, 1280, 'jpg', p.id, NULL, 'PHU_KIEN', 'IMAGE',
       'Fallback accessory image for demo coverage',
       CONCAT('seed/fallback-phu-kien-', p.id),
       NULL,
       1,
       'https://www.honda.com.vn/images/o-to/landing-page-phu-kien.jpg'
FROM phu_kien p
LEFT JOIN media m ON m.loai_doi_tuong = 'PHU_KIEN' AND m.doi_tuong_id = p.id
WHERE m.id IS NULL;

INSERT INTO media (
    ngay_cap_nhat, ngay_tao, chieu_cao, chieu_rong, dinh_dang, doi_tuong_id, dung_luong,
    loai_doi_tuong, loai_media, mo_ta, public_id, thoi_luong, thu_tu, url
)
SELECT NOW(), NOW(), 720, 1280, 'jpg', d.id, NULL, 'DICH_VU', 'IMAGE',
       'Fallback service image for demo coverage',
       CONCAT('seed/fallback-dich-vu-', d.id),
       NULL,
       1,
       'https://www.honda.com.vn/images/o-to/landing-page-service.jpg'
FROM dich_vu d
LEFT JOIN media m ON m.loai_doi_tuong = 'DICH_VU' AND m.doi_tuong_id = d.id
WHERE m.id IS NULL;

COMMIT;
