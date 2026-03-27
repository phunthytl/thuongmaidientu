# API Document - CarShop Backend

## 1) Thong tin chung

- Base URL: `/api`
- Response wrapper:
```json
{
  "status": 200,
  "message": "Thanh cong",
  "data": {}
}
```
- CORS:
  - Origins: `http://localhost:3000`, `http://localhost:5173`
  - Methods: `GET, POST, PUT, PATCH, DELETE, OPTIONS`

## 2) Xac thuc va phan quyen

- Auth su dung JWT (`Authorization: Bearer <token>`).
- Public:
  - `/api/auth/**`
  - `GET /api/oto/**`
  - `GET /api/phu-kien/**`
  - `GET /api/dich-vu/**`
  - `GET /api/danh-gia/**`
  - `GET /api/media/**`
- Admin + Nhan vien:
  - `POST|PUT|PATCH /api/oto/**`
  - `POST|PUT /api/phu-kien/**`
  - `POST|PUT /api/dich-vu/**`
  - `POST|DELETE /api/media/**`
  - `GET /api/don-hang`
  - `PATCH /api/don-hang/*/trang-thai`
  - `PATCH /api/don-hang/*/gan-nhan-vien/*`
  - `GET /api/khieu-nai`
  - `PATCH /api/khieu-nai/**`
- Admin only:
  - `/api/nhan-vien/**`
  - `DELETE /api/oto/**`
  - `DELETE /api/phu-kien/**`
  - `DELETE /api/dich-vu/**`
  - `/api/nguoi-dung/khach-hang/**`
  - `PATCH /api/nguoi-dung/*/trang-thai`
- Cac route khac: can dang nhap (`authenticated`).

## 3) Enum dung trong API

- `TrangThaiOTo`: `DANG_BAN`, `DA_BAN`, `NGUNG_BAN`, `DAT_TRUOC`
- `TrangThaiDonHang`: `CHO_XAC_NHAN`, `DA_XAC_NHAN`, `DANG_XU_LY`, `DANG_GIAO`, `HOAN_THANH`, `DA_HUY`
- `TrangThaiKhieuNai`: `MOI`, `DANG_XU_LY`, `DA_GIAI_QUYET`, `TU_CHOI`
- `LoaiSanPham`: `OTO`, `PHU_KIEN`, `DICH_VU`
- `ChucVu`: `QUAN_LY`, `NHAN_VIEN_BAN_HANG`, `KY_THUAT_VIEN`, `CHAM_SOC_KHACH_HANG`, `KE_TOAN`
- `LoaiDoiTuong` (media): `OTO`, `PHU_KIEN`, `DICH_VU`
- `LoaiMedia`: `IMAGE`, `VIDEO`

---

## 4) Danh sach endpoint

### 4.1 Auth (`/api/auth`)

- `POST /dang-nhap`
- `POST /dang-ky`
- `POST /refresh-token`
- `GET /me`

### 4.2 OTo (`/api/oto`)

- `POST /`
- `GET /{id}`
- `GET /`
- `GET /trang-thai/{trangThai}`
- `GET /hang-xe/{hangXe}`
- `GET /loc-gia?giaMin=&giaMax=`
- `GET /tim-kiem?keyword=`
- `GET /hang-xe`
- `PUT /{id}`
- `PATCH /{id}/trang-thai?trangThai=`
- `DELETE /{id}`

### 4.3 Phu kien (`/api/phu-kien`)

- `POST /`
- `GET /{id}`
- `GET /`
- `GET /tim-kiem?keyword=`
- `GET /loai`
- `PUT /{id}`
- `DELETE /{id}`

### 4.4 Dich vu (`/api/dich-vu`)

- `POST /`
- `GET /{id}`
- `GET /`
- `GET /tim-kiem?keyword=`
- `PUT /{id}`
- `DELETE /{id}`

### 4.5 Don hang (`/api/don-hang`)

- `POST /`
- `GET /{id}`
- `GET /ma/{maDonHang}`
- `GET /`
- `GET /khach-hang/{khachHangId}`
- `GET /trang-thai/{trangThai}`
- `GET /tim-kiem?keyword=`
- `PATCH /{id}/trang-thai?trangThai=`
- `PATCH /{donHangId}/gan-nhan-vien/{nhanVienId}`

### 4.6 Danh gia (`/api/danh-gia`)

- `POST /`
- `GET /oto/{otoId}`
- `GET /phu-kien/{phuKienId}`
- `GET /dich-vu/{dichVuId}`
- `GET /khach-hang/{khachHangId}`
- `DELETE /{id}`

### 4.7 Khieu nai (`/api/khieu-nai`)

- `POST /`
- `GET /{id}`
- `GET /`
- `GET /khach-hang/{khachHangId}`
- `GET /trang-thai/{trangThai}`
- `PATCH /{id}/phan-hoi?phanHoi=&nhanVienId=`
- `PATCH /{id}/trang-thai?trangThai=`

### 4.8 Nguoi dung (`/api/nguoi-dung`)

- `GET /{id}`
- `GET /khach-hang`
- `GET /khach-hang/tim-kiem?keyword=`
- `PATCH /{id}/trang-thai?trangThai=`

### 4.9 Nhan vien (`/api/nhan-vien`)

- `POST /`
- `GET /{id}`
- `GET /`
- `GET /chuc-vu/{chucVu}`
- `GET /tim-kiem?keyword=`
- `PUT /{id}`
- `DELETE /{id}`

### 4.10 Media (`/api/media`)

- `POST /upload` (multipart: `file`, `loaiDoiTuong`, `doiTuongId`, `moTa?`, `thuTu?`)
- `POST /upload-multiple` (multipart: `files`, `loaiDoiTuong`, `doiTuongId`, `moTa?`)
- `GET /{loaiDoiTuong}/{doiTuongId}`
- `GET /{loaiDoiTuong}/{doiTuongId}/images`
- `GET /{loaiDoiTuong}/{doiTuongId}/videos`
- `DELETE /{id}`
- `DELETE /{loaiDoiTuong}/{doiTuongId}`

---

## 5) Query chung cho endpoint pageable

Voi cac endpoint tra `Page<...>`:

- `page` (mac dinh: 0)
- `size`
- `sort` (vi du: `sort=ngayTao,desc`)
# API Document - CarShop Backend

## 1) Thong tin chung

- Base path API: `/api`
- Cau hinh CORS (tu `SecurityConfig`):
  - Allowed origins: `http://localhost:3000`, `http://localhost:5173`
  - Allowed methods: `GET, POST, PUT, PATCH, DELETE, OPTIONS`
  - Allowed headers: `*`
  - Exposed headers: `Authorization`
  - Apply cho: `/api/**`
- `WebConfig` chi ghi chu rang CORS da duoc cau hinh o `SecurityConfig`.

## 2) Xac thuc va phan quyen

### JWT

- He thong su dung JWT, stateless session.
- Cac endpoint khong nam trong danh sach `permitAll` se can token.

### Rule phan quyen tu `SecurityConfig`

- Public:
  - `/api/auth/**`
  - `GET /api/oto/**`
  - `GET /api/phu-kien/**`
  - `GET /api/dich-vu/**`
  - `GET /api/danh-gia/**`
- Admin only:
  - `/api/nhan-vien/**`
  - `DELETE /api/oto/**`
  - `DELETE /api/phu-kien/**`
  - `DELETE /api/dich-vu/**`
  - `/api/nguoi-dung/khach-hang/**`
  - `PATCH /api/nguoi-dung/*/trang-thai`
- Admin + Nhan vien:
  - `POST|PUT|PATCH /api/oto/**`
  - `POST|PUT /api/phu-kien/**`
  - `POST|PUT /api/dich-vu/**`
  - `GET /api/don-hang`
  - `PATCH /api/don-hang/*/trang-thai`
  - `PATCH /api/don-hang/*/gan-nhan-vien/*`
  - `GET /api/khieu-nai`
  - `PATCH /api/khieu-nai/**`
- Cac request con lai: `authenticated()`

## 3) Dinh dang response chung

Tat ca endpoint tra ve theo khuon:

```json
{
  "status": 200,
  "message": "Thanh cong",
  "data": {}
}
```

`status` va `message` thay doi theo tung truong hop (`200`, `201`, loi...).

## 4) Quy uoc chung khi goi API

- Header:
  - `Authorization: Bearer <access_token>` (voi endpoint can dang nhap)
  - `Content-Type: application/json` (voi request body JSON)
- Paging (`Pageable`) cho endpoint tra `Page<...>`:
  - `page` (default 0)
  - `size` (default theo Spring)
  - `sort` (vi du: `sort=createdAt,desc`)

## 5) Gia tri Enum su dung trong API

- `TrangThaiOTo`: `DANG_BAN`, `DA_BAN`, `NGUNG_BAN`, `DAT_TRUOC`
- `TrangThaiDonHang`: `CHO_XAC_NHAN`, `DA_XAC_NHAN`, `DANG_XU_LY`, `DANG_GIAO`, `HOAN_THANH`, `DA_HUY`
- `TrangThaiKhieuNai`: `MOI`, `DANG_XU_LY`, `DA_GIAI_QUYET`, `TU_CHOI`
- `LoaiSanPham`: `OTO`, `PHU_KIEN`, `DICH_VU`
- `ChucVu`: `QUAN_LY`, `NHAN_VIEN_BAN_HANG`, `KY_THUAT_VIEN`, `CHAM_SOC_KHACH_HANG`, `KE_TOAN`

---

## 6) Auth API (`/api/auth`)

### 6.1 POST `/api/auth/dang-nhap`

- Quyen: Public
- Body (`DangNhapRequest`):
  - `email` (string, required, format email)
  - `matKhau` (string, required)
- Response data: `AuthResponse`

### 6.2 POST `/api/auth/dang-ky`

- Quyen: Public
- Body (`DangKyRequest`):
  - `hoTen` (string, required, max 100)
  - `email` (string, required, format email)
  - `matKhau` (string, required, min 6)
  - `soDienThoai` (string, optional)
  - `diaChi` (string, optional)
- Response data: `AuthResponse`
- HTTP status thanh cong: `201`

### 6.3 POST `/api/auth/refresh-token`

- Quyen: Public
- Body (`RefreshTokenRequest`):
  - `refreshToken` (string, required)
- Response data: `AuthResponse`

### 6.4 GET `/api/auth/me`

- Quyen: Authenticated
- Body: khong
- Response data: `NguoiDungResponse`

---

## 7) OTo API (`/api/oto`)

### 7.1 POST `/api/oto`

- Quyen: `ADMIN` hoac `NHAN_VIEN`
- Body (`OToRequest`):
  - `tenXe` (string, required)
  - `hangXe` (string, required)
  - `dongXe` (string, optional)
  - `namSanXuat` (integer, optional)
  - `mauSac` (string, optional)
  - `dongCo` (string, optional)
  - `hopSo` (string, optional)
  - `nhienLieu` (string, optional)
  - `soKm` (integer, optional)
  - `gia` (number, required)
  - `soLuong` (integer, optional)
  - `moTa` (string, optional)
- Response data: `OToResponse`
- HTTP status thanh cong: `201`

### 7.2 GET `/api/oto/{id}`

- Quyen: Public
- Path param:
  - `id` (Long)
- Response data: `OToResponse`

### 7.3 GET `/api/oto`

- Quyen: Public
- Query: `page`, `size`, `sort`
- Response data: `Page<OToResponse>`

### 7.4 GET `/api/oto/trang-thai/{trangThai}`

- Quyen: Public
- Path param:
  - `trangThai` (`TrangThaiOTo`)
- Query: `page`, `size`, `sort`
- Response data: `Page<OToResponse>`

### 7.5 GET `/api/oto/hang-xe/{hangXe}`

- Quyen: Public
- Path param:
  - `hangXe` (String)
- Query: `page`, `size`, `sort`
- Response data: `Page<OToResponse>`

### 7.6 GET `/api/oto/loc-gia`

- Quyen: Public
- Query:
  - `giaMin` (BigDecimal, required)
  - `giaMax` (BigDecimal, required)
  - `page`, `size`, `sort`
- Response data: `Page<OToResponse>`

### 7.7 GET `/api/oto/tim-kiem`

- Quyen: Public
- Query:
  - `keyword` (String, required)
  - `page`, `size`, `sort`
- Response data: `Page<OToResponse>`

### 7.8 GET `/api/oto/hang-xe`

- Quyen: Public
- Response data: `List<String>`

### 7.9 PUT `/api/oto/{id}`

- Quyen: `ADMIN` hoac `NHAN_VIEN`
- Path param:
  - `id` (Long)
- Body: giong `OToRequest`
- Response data: `OToResponse`

### 7.10 PATCH `/api/oto/{id}/trang-thai`

- Quyen: `ADMIN` hoac `NHAN_VIEN`
- Path param:
  - `id` (Long)
- Query:
  - `trangThai` (`TrangThaiOTo`, required)
- Response data: `OToResponse`

### 7.11 DELETE `/api/oto/{id}`

- Quyen: `ADMIN`
- Path param:
  - `id` (Long)
- Response data: `null`

---

## 8) Phu kien API (`/api/phu-kien`)

### 8.1 POST `/api/phu-kien`

- Quyen: `ADMIN` hoac `NHAN_VIEN`
- Body (`PhuKienRequest`):
  - `tenPhuKien` (string, required)
  - `loaiPhuKien` (string, optional)
  - `hangSanXuat` (string, optional)
  - `gia` (number, required)
  - `soLuong` (integer, optional)
  - `moTa` (string, optional)
- Response data: `PhuKienResponse`
- HTTP status thanh cong: `201`

### 8.2 GET `/api/phu-kien/{id}`

- Quyen: Public
- Path param: `id` (Long)
- Response data: `PhuKienResponse`

### 8.3 GET `/api/phu-kien`

- Quyen: Public
- Query: `page`, `size`, `sort`
- Response data: `Page<PhuKienResponse>`

### 8.4 GET `/api/phu-kien/tim-kiem`

- Quyen: Public
- Query:
  - `keyword` (String, required)
  - `page`, `size`, `sort`
- Response data: `Page<PhuKienResponse>`

### 8.5 GET `/api/phu-kien/loai`

- Quyen: Public
- Response data: `List<String>`

### 8.6 PUT `/api/phu-kien/{id}`

- Quyen: `ADMIN` hoac `NHAN_VIEN`
- Path param: `id` (Long)
- Body: giong `PhuKienRequest`
- Response data: `PhuKienResponse`

### 8.7 DELETE `/api/phu-kien/{id}`

- Quyen: `ADMIN`
- Path param: `id` (Long)
- Response data: `null`

---

## 9) Dich vu API (`/api/dich-vu`)

### 9.1 POST `/api/dich-vu`

- Quyen: `ADMIN` hoac `NHAN_VIEN`
- Body (`DichVuRequest`):
  - `tenDichVu` (string, required)
  - `moTa` (string, optional)
  - `gia` (number, required)
  - `thoiGianUocTinh` (string, optional)
- Response data: `DichVuResponse`
- HTTP status thanh cong: `201`

### 9.2 GET `/api/dich-vu/{id}`

- Quyen: Public
- Path param: `id` (Long)
- Response data: `DichVuResponse`

### 9.3 GET `/api/dich-vu`

- Quyen: Public
- Query: `page`, `size`, `sort`
- Response data: `Page<DichVuResponse>`

### 9.4 GET `/api/dich-vu/tim-kiem`

- Quyen: Public
- Query:
  - `keyword` (String, required)
  - `page`, `size`, `sort`
- Response data: `Page<DichVuResponse>`

### 9.5 PUT `/api/dich-vu/{id}`

- Quyen: `ADMIN` hoac `NHAN_VIEN`
- Path param: `id` (Long)
- Body: giong `DichVuRequest`
- Response data: `DichVuResponse`

### 9.6 DELETE `/api/dich-vu/{id}`

- Quyen: `ADMIN`
- Path param: `id` (Long)
- Response data: `null`

---

## 10) Don hang API (`/api/don-hang`)

### 10.1 POST `/api/don-hang`

- Quyen: Authenticated
- Body (`DonHangRequest`):
  - `khachHangId` (Long, required)
  - `chiTietDonHangs` (List, required, toi thieu 1)
    - Item `ChiTietDonHangRequest`:
      - `loaiSanPham` (`LoaiSanPham`, required)
      - `otoId` (Long, optional)
      - `phuKienId` (Long, optional)
      - `dichVuId` (Long, optional)
      - `soLuong` (Integer, min 1, default 1)
  - `ghiChu` (String, optional)
  - `diaChiGiaoHang` (String, optional)
- Response data: `DonHangResponse`
- HTTP status thanh cong: `201`

### 10.2 GET `/api/don-hang/{id}`

- Quyen: Authenticated
- Path param: `id` (Long)
- Response data: `DonHangResponse`

### 10.3 GET `/api/don-hang/ma/{maDonHang}`

- Quyen: Authenticated
- Path param: `maDonHang` (String)
- Response data: `DonHangResponse`

### 10.4 GET `/api/don-hang`

- Quyen: `ADMIN` hoac `NHAN_VIEN`
- Query: `page`, `size`, `sort`
- Response data: `Page<DonHangResponse>`

### 10.5 GET `/api/don-hang/khach-hang/{khachHangId}`

- Quyen: Authenticated
- Path param: `khachHangId` (Long)
- Query: `page`, `size`, `sort`
- Response data: `Page<DonHangResponse>`

### 10.6 GET `/api/don-hang/trang-thai/{trangThai}`

- Quyen: Authenticated
- Path param: `trangThai` (`TrangThaiDonHang`)
- Query: `page`, `size`, `sort`
- Response data: `Page<DonHangResponse>`

### 10.7 GET `/api/don-hang/tim-kiem`

- Quyen: Authenticated
- Query:
  - `keyword` (String, required)
  - `page`, `size`, `sort`
- Response data: `Page<DonHangResponse>`

### 10.8 PATCH `/api/don-hang/{id}/trang-thai`

- Quyen: `ADMIN` hoac `NHAN_VIEN`
- Path param: `id` (Long)
- Query:
  - `trangThai` (`TrangThaiDonHang`, required)
- Response data: `DonHangResponse`

### 10.9 PATCH `/api/don-hang/{donHangId}/gan-nhan-vien/{nhanVienId}`

- Quyen: `ADMIN` hoac `NHAN_VIEN`
- Path params:
  - `donHangId` (Long)
  - `nhanVienId` (Long)
- Response data: `DonHangResponse`

---

## 11) Danh gia API (`/api/danh-gia`)

### 11.1 POST `/api/danh-gia`

- Quyen: Authenticated
- Body (`DanhGiaRequest`):
  - `khachHangId` (Long, required)
  - `loaiSanPham` (`LoaiSanPham`, required)
  - `otoId` (Long, optional)
  - `phuKienId` (Long, optional)
  - `dichVuId` (Long, optional)
  - `diemDanhGia` (Integer, required, 1..5)
  - `noiDung` (String, optional)
- Response data: `DanhGiaResponse`
- HTTP status thanh cong: `201`

### 11.2 GET `/api/danh-gia/oto/{otoId}`

- Quyen: Public
- Path param: `otoId` (Long)
- Query: `page`, `size`, `sort`
- Response data: `Page<DanhGiaResponse>`

### 11.3 GET `/api/danh-gia/phu-kien/{phuKienId}`

- Quyen: Public
- Path param: `phuKienId` (Long)
- Query: `page`, `size`, `sort`
- Response data: `Page<DanhGiaResponse>`

### 11.4 GET `/api/danh-gia/dich-vu/{dichVuId}`

- Quyen: Public
- Path param: `dichVuId` (Long)
- Query: `page`, `size`, `sort`
- Response data: `Page<DanhGiaResponse>`

### 11.5 GET `/api/danh-gia/khach-hang/{khachHangId}`

- Quyen: Public
- Path param: `khachHangId` (Long)
- Query: `page`, `size`, `sort`
- Response data: `Page<DanhGiaResponse>`

### 11.6 DELETE `/api/danh-gia/{id}`

- Quyen: Authenticated
- Path param: `id` (Long)
- Response data: `null`

---

## 12) Khieu nai API (`/api/khieu-nai`)

### 12.1 POST `/api/khieu-nai`

- Quyen: Authenticated
- Body (`KhieuNaiRequest`):
  - `khachHangId` (Long, required)
  - `donHangId` (Long, optional)
  - `tieuDe` (String, required)
  - `noiDung` (String, required)
- Response data: `KhieuNai` (entity)
- HTTP status thanh cong: `201`

### 12.2 GET `/api/khieu-nai/{id}`

- Quyen: Authenticated
- Path param: `id` (Long)
- Response data: `KhieuNai`

### 12.3 GET `/api/khieu-nai`

- Quyen: `ADMIN` hoac `NHAN_VIEN`
- Query: `page`, `size`, `sort`
- Response data: `Page<KhieuNai>`

### 12.4 GET `/api/khieu-nai/khach-hang/{khachHangId}`

- Quyen: Authenticated
- Path param: `khachHangId` (Long)
- Query: `page`, `size`, `sort`
- Response data: `Page<KhieuNai>`

### 12.5 GET `/api/khieu-nai/trang-thai/{trangThai}`

- Quyen: Authenticated
- Path param: `trangThai` (`TrangThaiKhieuNai`)
- Query: `page`, `size`, `sort`
- Response data: `Page<KhieuNai>`

### 12.6 PATCH `/api/khieu-nai/{id}/phan-hoi`

- Quyen: `ADMIN` hoac `NHAN_VIEN`
- Path param: `id` (Long)
- Query:
  - `phanHoi` (String, required)
  - `nhanVienId` (Long, required)
- Response data: `KhieuNai`

### 12.7 PATCH `/api/khieu-nai/{id}/trang-thai`

- Quyen: `ADMIN` hoac `NHAN_VIEN`
- Path param: `id` (Long)
- Query:
  - `trangThai` (`TrangThaiKhieuNai`, required)
- Response data: `KhieuNai`

---

## 13) Nhan vien API (`/api/nhan-vien`)

> Luu y: toan bo `/api/nhan-vien/**` la `ADMIN` theo SecurityConfig.

### 13.1 POST `/api/nhan-vien`

- Quyen: `ADMIN`
- Body (`NhanVienRequest`):
  - `hoTen` (String, required, max 100)
  - `email` (String, required, email)
  - `matKhau` (String, required, min 6)
  - `soDienThoai` (String, optional)
  - `diaChi` (String, optional)
  - `maNhanVien` (String, required)
  - `chucVu` (`ChucVu`, optional)
  - `phongBan` (String, optional)
  - `luong` (BigDecimal, optional)
  - `ngayVaoLam` (LocalDate, optional)
- Response data: `NhanVienResponse`
- HTTP status thanh cong: `201`

### 13.2 GET `/api/nhan-vien/{id}`

- Quyen: `ADMIN`
- Path param: `id` (Long)
- Response data: `NhanVienResponse`

### 13.3 GET `/api/nhan-vien`

- Quyen: `ADMIN`
- Query: `page`, `size`, `sort`
- Response data: `Page<NhanVienResponse>`

### 13.4 GET `/api/nhan-vien/chuc-vu/{chucVu}`

- Quyen: `ADMIN`
- Path param: `chucVu` (`ChucVu`)
- Query: `page`, `size`, `sort`
- Response data: `Page<NhanVienResponse>`

### 13.5 GET `/api/nhan-vien/tim-kiem`

- Quyen: `ADMIN`
- Query:
  - `keyword` (String, required)
  - `page`, `size`, `sort`
- Response data: `Page<NhanVienResponse>`

### 13.6 PUT `/api/nhan-vien/{id}`

- Quyen: `ADMIN`
- Path param: `id` (Long)
- Body: giong `NhanVienRequest`
- Response data: `NhanVienResponse`

### 13.7 DELETE `/api/nhan-vien/{id}`

- Quyen: `ADMIN`
- Path param: `id` (Long)
- Response data: `null`

---

## 14) Nguoi dung API (`/api/nguoi-dung`)

### 14.1 GET `/api/nguoi-dung/{id}`

- Quyen: Authenticated
- Path param: `id` (Long)
- Response data: `NguoiDungResponse`

### 14.2 GET `/api/nguoi-dung/khach-hang`

- Quyen: `ADMIN`
- Query: `page`, `size`, `sort`
- Response data: `Page<KhachHangResponse>`

### 14.3 GET `/api/nguoi-dung/khach-hang/tim-kiem`

- Quyen: `ADMIN`
- Query:
  - `keyword` (String, required)
  - `page`, `size`, `sort`
- Response data: `Page<KhachHangResponse>`

### 14.4 PATCH `/api/nguoi-dung/{id}/trang-thai`

- Quyen: `ADMIN`
- Path param: `id` (Long)
- Query:
  - `trangThai` (Boolean, required)
- Response data: `NguoiDungResponse`

---