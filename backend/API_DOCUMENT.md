# API Document - CarShop Backend
> **Phiên bản:** v2.0 | **Cập nhật:** 2026-04-06 | **Tích hợp GHN & Đa Kho**

## 1) Thông tin chung

- **Base URL:** `http://localhost:8080/api`
- **Content-Type:** `application/json`
- **CORS origins:** `http://localhost:3000`, `http://localhost:5173`
- **Methods:** `GET, POST, PUT, PATCH, DELETE, OPTIONS`

---

## 2) Định dạng Response chung

```json
{
  "status": 200,
  "message": "Thành công",
  "data": {}
}
```

Lỗi validation trả thêm `"errors": [...]`.

---

## 3) Xác thực & Phân quyền

### JWT
- Gửi header: `Authorization: Bearer <access_token>`

### Rule phân quyền
| Quyền | Endpoint |
|---|---|
| **Public** | `GET /api/oto/**`, `GET /api/phu-kien/**`, `GET /api/dich-vu/**`, `GET /api/danh-gia/**`, `GET /api/media/**`, `/api/auth/**`, `GET /api/kho-hang/**`, `/api/ghn/**`, `/api/webhook/ghn/**` |
| **Admin Only** | `/api/nhan-vien/**`, `DELETE /api/oto/**`, `DELETE /api/phu-kien/**`, `DELETE /api/dich-vu/**`, `/api/nguoi-dung/khach-hang/**`, `PATCH /api/nguoi-dung/*/trang-thai` |
| **Admin + NV** | `POST\|PUT\|PATCH /api/oto/**`, `POST\|PUT /api/phu-kien/**`, `POST\|PUT /api/dich-vu/**`, `GET /api/don-hang`, `PATCH /api/don-hang/*/trang-thai`, `POST\|DELETE /api/media/**` |
| **Authenticated** | Còn lại |

---

## 4) Enum Values

| Enum | Giá trị |
|---|---|
| `TrangThaiOTo` | `DANG_BAN`, `DA_BAN`, `NGUNG_BAN`, `DAT_TRUOC` |
| `TrangThaiDonHang` | `CHO_XAC_NHAN`, `DA_XAC_NHAN`, `DANG_XU_LY`, `DANG_GIAO`, `HOAN_THANH`, `DA_HUY` |
| `TrangThaiKhieuNai` | `MOI`, `DANG_XU_LY`, `DA_GIAI_QUYET`, `TU_CHOI` |
| `TrangThaiThanhToan` | `CHO_THANH_TOAN`, `DA_THANH_TOAN`, `THAT_BAI`, `HOAN_TIEN` |
| `LoaiSanPham` | `OTO`, `PHU_KIEN`, `DICH_VU` |
| `ChucVu` | `QUAN_LY`, `NHAN_VIEN_BAN_HANG`, `KY_THUAT_VIEN`, `CHAM_SOC_KHACH_HANG`, `KE_TOAN` |
| `PhuongThucThanhToan` | `TIEN_MAT`, `VNPAY`, `MOMO`, `CHUYEN_KHOAN` |
| `HangThanhVien` | `DONG`, `BAC`, `VANG`, `KIM_CUONG` |

---

## 5) Phân trang (Pageable)

Query params: `?page=0&size=10&sort=ngayTao,desc`

---

## 6) Danh sách API

### 6.1 Auth `/api/auth`

| Method | Endpoint | Quyền | Mô tả |
|---|---|---|---|
| POST | `/dang-nhap` | Public | Đăng nhập |
| POST | `/dang-ky` | Public | Đăng ký tài khoản khách hàng |
| POST | `/refresh-token` | Public | Làm mới access token |
| GET | `/me` | Authenticated | Thông tin người dùng hiện tại |

**Body đăng nhập:**
```json
{ "email": "admin@carshop.com", "matKhau": "123456" }
```

**Body đăng ký:**
```json
{ "hoTen": "...", "email": "...", "matKhau": "...", "soDienThoai": "..." }
```

---

### 6.2 Ô tô `/api/oto`

| Method | Endpoint | Quyền |
|---|---|---|
| POST | `/` | Admin, NV |
| GET | `/{id}` | Public |
| GET | `/` | Public + Phân trang |
| GET | `/trang-thai/{trangThai}` | Public + Phân trang |
| GET | `/hang-xe/{hangXe}` | Public + Phân trang |
| GET | `/loc-gia?giaMin=&giaMax=` | Public + Phân trang |
| GET | `/tim-kiem?keyword=` | Public + Phân trang |
| GET | `/hang-xe` | Public — Danh sách hãng xe |
| PUT | `/{id}` | Admin, NV |
| PATCH | `/{id}/trang-thai?trangThai=` | Admin, NV |
| DELETE | `/{id}` | Admin |

---

### 6.3 Phụ kiện `/api/phu-kien`

| Method | Endpoint | Quyền |
|---|---|---|
| POST | `/` | Admin, NV |
| GET | `/{id}` | Public |
| GET | `/` | Public + Phân trang |
| GET | `/tim-kiem?keyword=` | Public + Phân trang |
| GET | `/loai` | Public — Danh sách loại phụ kiện |
| PUT | `/{id}` | Admin, NV |
| DELETE | `/{id}` | Admin |

**Body tạo phụ kiện (bắt buộc có `trongLuong` để GHN tính cước):**
```json
{
  "tenPhuKien": "Lốp xe Michelin",
  "loaiPhuKien": "Lốp xe",
  "hangSanXuat": "Michelin",
  "gia": 1250000,
  "soLuong": 50,
  "trongLuong": 9500,
  "moTa": "..."
}
```

---

### 6.4 Dịch vụ `/api/dich-vu`

| Method | Endpoint | Quyền |
|---|---|---|
| POST | `/` | Admin, NV |
| GET | `/{id}` | Public |
| GET | `/` | Public + Phân trang |
| GET | `/tim-kiem?keyword=` | Public + Phân trang |
| PUT | `/{id}` | Admin, NV |
| DELETE | `/{id}` | Admin |

---

### 6.5 Kho hàng `/api/kho-hang` ⭐ MỚI

| Method | Endpoint | Quyền | Mô tả |
|---|---|---|---|
| GET | `/` | Public | Danh sách 3 kho (HN, ĐN, HCM) |
| GET | `/{id}` | Public | Chi tiết 1 kho |

**Response mẫu:**
```json
{
  "id": 1,
  "tenKho": "Kho Hà Nội",
  "nguoiLienHe": "Nguyễn Văn Hùng",
  "soDienThoai": "0901100001",
  "tinhThanhId": 1,
  "tinhThanhTen": "Hà Nội",
  "xaPhuongId": 1001,
  "xaPhuongTen": "Phường Yên Sở",
  "diaChiChiTiet": "Số 15 Đường Giải Phóng, Phường Yên Sở, Quận Hoàng Mai",
  "trangThai": true
}
```

> **Lưu ý:** `ghnDistrictId`, `ghnWardCode` không expose ra client — chỉ dùng nội bộ gọi GHN API.

---

### 6.6 Đơn hàng `/api/don-hang` ⭐ ĐÃ CẬP NHẬT

| Method | Endpoint | Quyền |
|---|---|---|
| POST | `/` | Authenticated |
| GET | `/{id}` | Authenticated |
| GET | `/ma/{maDonHang}` | Authenticated |
| GET | `/` | Admin, NV + Phân trang |
| GET | `/khach-hang/{khachHangId}` | Authenticated + Phân trang |
| GET | `/trang-thai/{trangThai}` | Authenticated + Phân trang |
| GET | `/tim-kiem?keyword=` | Authenticated + Phân trang |
| PATCH | `/{id}/trang-thai?trangThai=` | Admin, NV — **Tự động tạo đơn GHN khi → DA_XAC_NHAN** |
| PATCH | `/{donHangId}/gan-nhan-vien/{nhanVienId}` | Admin, NV |

**Body tạo đơn (POST):**
```json
{
  "khachHangId": 10,
  "diaChiGiaoHangId": 1,
  "khoHangId": 1,
  "ghiChu": "Giao giờ hành chính",
  "chiTietDonHangs": [
    { "loaiSanPham": "PHU_KIEN", "phuKienId": 1, "soLuong": 2 },
    { "loaiSanPham": "OTO",      "otoId": 3,      "soLuong": 1 }
  ]
}
```

**Response đơn hàng (GET):**
```json
{
  "id": 1,
  "maDonHang": "DH-2026-0001",
  "maDonHangGhn": "GHNXXXXXXX",
  "trangThai": "DA_XAC_NHAN",
  "tongTien": 1280000,
  "phiVanChuyen": 30000,
  "tenKhachHang": "Nguyễn Văn An",
  "soDienThoaiKhachHang": "0911000001",
  "emailKhachHang": "an.kh@gmail.com",
  "diaChiGiaoHang": {
    "tenNguoiNhan": "Nguyễn Văn An",
    "soDienThoai": "0911000001",
    "tinhThanhId": 1,
    "tinhThanhTen": "Hà Nội",
    "xaPhuongId": 1001,
    "xaPhuongTen": "Phường Yên Sở",
    "diaChiChiTiet": "12 Phố Giải Phóng..."
  },
  "khoXuatHang": {
    "tenKho": "Kho Hà Nội",
    "tinhThanhTen": "Hà Nội",
    "diaChiChiTiet": "..."
  },
  "chiTietDonHangs": [...],
  "thanhToan": { ... }
}
```

> **Luồng GHN tự động:** Khi admin cập nhật trạng thái đơn → `DA_XAC_NHAN`, hệ thống tự gọi `GHN API create` và lưu `maDonHangGhn` vào DB.

---

### 6.7 Địa chỉ khách hàng `/api/dia-chi` ⭐ ĐÃ CẬP NHẬT

| Method | Endpoint | Quyền |
|---|---|---|
| GET | `/khach-hang/{khachHangId}` | Authenticated |
| POST | `/khach-hang/{khachHangId}` | Authenticated |
| PUT | `/{id}` | Authenticated |
| DELETE | `/{id}` | Authenticated |

**Body tạo/cập nhật địa chỉ (cấu trúc 34 tỉnh thành mới, không còn quận/huyện):**
```json
{
  "tenNguoiNhan": "Nguyễn Văn An",
  "soDienThoai": "0911000001",
  "tinhThanhId": 1,
  "tinhThanhTen": "Hà Nội",
  "xaPhuongId": 1001,
  "xaPhuongTen": "Phường Yên Sở",
  "diaChiChiTiet": "12 Phố Giải Phóng, Phường Yên Sở, Quận Hoàng Mai",
  "ghnDistrictId": 1490,
  "ghnWardCode": "1A0814",
  "isDefault": true
}
```

> **Quan trọng:** `ghnDistrictId` và `ghnWardCode` là mã địa chỉ theo hệ thống GHN (khác với mã 34 tỉnh thành mới), cần tra cứu qua API proxy GHN để lấy đúng mã.

---

### 6.8 GHN Proxy `/api/ghn` ⭐ MỚI

| Method | Endpoint | Quyền | Mô tả |
|---|---|---|---|
| GET | `/tinh-thanh` | Public | Danh sách tỉnh/thành GHN |
| GET | `/quan-huyen?provinceId=` | Public | Danh sách quận/huyện GHN theo tỉnh |
| GET | `/phuong-xa?districtId=` | Public | Danh sách phường/xã GHN theo quận |
| POST | `/tinh-phi` | Public | Tính phí vận chuyển GHN |

**Body tính phí:**
```json
{
  "toDistrictId": 1490,
  "toWardCode": "1A0814",
  "weight": 500,
  "khoHangId": 1
}
```

---

### 6.9 GHN Webhook `/api/webhook/ghn`

| Method | Endpoint | Quyền | Mô tả |
|---|---|---|---|
| POST | `/` | Public (GHN gọi về) | Nhận cập nhật trạng thái vận đơn từ GHN |

> Endpoint này được GHN gọi tự động khi trạng thái giao hàng thay đổi. Cần cấu hình URL trong dashboard GHN Sandbox (dùng Ngrok khi dev local).

---

### 6.10 Đánh giá `/api/danh-gia`

| Method | Endpoint | Quyền |
|---|---|---|
| POST | `/` | Authenticated |
| GET | `/oto/{otoId}` | Public + Phân trang |
| GET | `/phu-kien/{phuKienId}` | Public + Phân trang |
| GET | `/dich-vu/{dichVuId}` | Public + Phân trang |
| GET | `/khach-hang/{khachHangId}` | Public + Phân trang |
| DELETE | `/{id}` | Authenticated |

---

### 6.11 Khiếu nại `/api/khieu-nai`

| Method | Endpoint | Quyền |
|---|---|---|
| POST | `/` | Authenticated |
| GET | `/{id}` | Authenticated |
| GET | `/` | Admin, NV + Phân trang |
| GET | `/khach-hang/{khachHangId}` | Authenticated + Phân trang |
| GET | `/trang-thai/{trangThai}` | Authenticated + Phân trang |
| PATCH | `/{id}/phan-hoi?phanHoi=&nhanVienId=` | Admin, NV |
| PATCH | `/{id}/trang-thai?trangThai=` | Admin, NV |

---

### 6.12 Nhân viên `/api/nhan-vien` (Admin Only)

| Method | Endpoint |
|---|---|
| POST | `/` |
| GET | `/{id}` |
| GET | `/` |
| GET | `/chuc-vu/{chucVu}` |
| GET | `/tim-kiem?keyword=` |
| PUT | `/{id}` |
| DELETE | `/{id}` |

---

### 6.13 Người dùng `/api/nguoi-dung`

| Method | Endpoint | Quyền |
|---|---|---|
| GET | `/{id}` | Authenticated |
| GET | `/khach-hang` | Admin |
| GET | `/khach-hang/tim-kiem?keyword=` | Admin |
| PATCH | `/{id}/trang-thai?trangThai=true\|false` | Admin |

---

### 6.14 Media `/api/media`

| Method | Endpoint | Quyền |
|---|---|---|
| POST | `/upload` | Admin, NV — `multipart/form-data` |
| POST | `/upload-multiple` | Admin, NV — `multipart/form-data` |
| GET | `/{loaiDoiTuong}/{doiTuongId}` | Public |
| GET | `/{loaiDoiTuong}/{doiTuongId}/images` | Public |
| GET | `/{loaiDoiTuong}/{doiTuongId}/videos` | Public |
| DELETE | `/{id}` | Admin, NV |
| DELETE | `/{loaiDoiTuong}/{doiTuongId}` | Admin, NV |

---

## 7) Mã địa chỉ GHN (Sandbox)

Dữ liệu GHN Sandbox được verify trực tiếp từ API:

| Khu vực | Province ID | District ID | Ward Code | Phường/Xã |
|---|---|---|---|---|
| HN — Hoàng Mai | 201 | 1490 | `1A0814` | Phường Yên Sở |
| HN — Hoàng Mai | 201 | 1490 | `1A0802` | Phường Định Công |
| HN — Hoàng Mai | 201 | 1490 | `1A0804` | Phường Hoàng Liệt |
| HN — Hoàng Mai | 201 | 1490 | `1A0809` | Phường Thanh Trì |
| ĐN — Sơn Trà | 518 | 1823 | `640706` | Xã Tân Thành |
| ĐN — Sơn Trà | 518 | 1823 | `640705` | Xã Hiệp Lợi |
| ĐN — Sơn Trà | 518 | 1823 | `640703` | Phường Ngã Bảy |
| HCM — Quận 12 | 202 | 1454 | `21211` | Phường Trung Mỹ Tây |
| HCM — Quận 12 | 202 | 1454 | `21210` | Phường Thới An |

> **Lưu ý thiết kế:** Hệ thống dùng 2 hệ mã địa chỉ song song:
> - **Mã 34 tỉnh thành mới** (`tinhThanhId`, `xaPhuongId`): dùng để hiển thị UI, không có cấp huyện.
> - **Mã GHN** (`ghnDistrictId`, `ghnWardCode`): dùng để gọi API GHN tính cước + tạo đơn vận chuyển.

---

## 8) Luồng tích hợp GHN (Multi-Warehouse)

```
Khách chọn kho  →  Checkout  →  Tạo đơn hàng
       ↓                              ↓
  KhoHang.id                   DonHang.khoHangId
                                      ↓
                    Admin duyệt → PATCH trang-thai = DA_XAC_NHAN
                                      ↓
                           GhnService.createOrder()
                           from_* = KhoHang GHN IDs
                           to_*   = DiaChiKhachHang GHN IDs
                                      ↓
                           Lưu maDonHangGhn vào DonHang
                                      ↓
                    GHN Webhook → tự động cập nhật trạng thái
```