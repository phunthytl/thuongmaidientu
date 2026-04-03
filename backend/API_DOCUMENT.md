# API Document - CarShop Backend

## 1) Thông tin chung

- Base path API: `/api`
- Cấu hình CORS (từ `SecurityConfig`):
  - Allowed origins: `http://localhost:3000`, `http://localhost:5173`
  - Allowed methods: `GET, POST, PUT, PATCH, DELETE, OPTIONS`
  - Allowed headers: `*`
  - Exposed headers: `Authorization`
  - Apply cho: `/api/**`

## 2) Định dạng response chung

Tất cả các endpoint trả về theo khuôn sau:

```json
{
  "status": 200,
  "message": "Thành công",
  "data": {}
}
```

`status` và `message` thay đổi theo từng trường hợp (200, 201, lỗi...). Nếu gọi thành công trả về `data`, nếu lỗi có thể kèm theo `errors` (nếu validate xịt).

## 3) Xác thực và phân quyền

### JWT
- Hệ thống sử dụng JWT, stateless session.
- Client cần gửi header `Authorization: Bearer <access_token>` nếu endpoint không public.

### Rule phân quyền (SecurityConfig)
- **Public**:
  - `/api/auth/**`
  - `GET /api/oto/**`
  - `GET /api/phu-kien/**`
  - `GET /api/dich-vu/**`
  - `GET /api/danh-gia/**`
  - `GET /api/media/**`
- **Admin only (QUAN_LY)**:
  - `/api/nhan-vien/**`
  - `DELETE /api/oto/**`
  - `DELETE /api/phu-kien/**`
  - `DELETE /api/dich-vu/**`
  - `/api/nguoi-dung/khach-hang/**`
  - `PATCH /api/nguoi-dung/*/trang-thai`
- **Admin + Nhân viên**:
  - `POST|PUT|PATCH /api/oto/**`
  - `POST|PUT /api/phu-kien/**`
  - `POST|PUT /api/dich-vu/**`
  - `POST|DELETE /api/media/**`
  - `GET /api/don-hang`
  - `PATCH /api/don-hang/*/trang-thai`
  - `PATCH /api/don-hang/*/gan-nhan-vien/*`
  - `GET /api/khieu-nai`
  - `PATCH /api/khieu-nai/**`
- **Các request còn lại**: Cần đăng nhập (`authenticated()`).

## 4) Giá trị Enum sử dụng

Dưới đây là các giá trị được khai báo cho những trường sử dụng Enum trong REST:
- `TrangThaiOTo`: `DANG_BAN`, `DA_BAN`, `NGUNG_BAN`, `DAT_TRUOC`
- `TrangThaiDonHang`: `CHO_XAC_NHAN`, `DA_XAC_NHAN`, `DANG_XU_LY`, `DANG_GIAO`, `HOAN_THANH`, `DA_HUY`
- `TrangThaiKhieuNai`: `MOI`, `DANG_XU_LY`, `DA_GIAI_QUYET`, `TU_CHOI`
- `LoaiSanPham`: `OTO`, `PHU_KIEN`, `DICH_VU`
- `ChucVu`: `QUAN_LY`, `NHAN_VIEN_BAN_HANG`, `KY_THUAT_VIEN`, `CHAM_SOC_KHACH_HANG`, `KE_TOAN`
- `LoaiDoiTuong` (dành cho Media): `OTO`, `PHU_KIEN`, `DICH_VU`
- `LoaiMedia`: `IMAGE`, `VIDEO`

---

## 5) Quy ước tham số Endpoint Phân trang (Pageable)

- `page`: số thư tự trang (default 0).
- `size`: số lượng bản ghi trên một trang.
- `sort`: sắp xếp (ví dụ: `sort=ngayTao,desc`).

---

## 6) Danh sách API

### 6.1 Auth API (`/api/auth`)

- **POST /api/auth/dang-nhap** (Quyền: Public)
  - Body: `{ "email": "...", "matKhau": "..." }`
  - Response: `AuthResponse (accessToken, refreshToken)`
- **POST /api/auth/dang-ky** (Quyền: Public)
  - Body: `{ "hoTen": "...", "email": "...", "matKhau": "...", "soDienThoai": "...", "diaChi": "..." }`
  - Response: `AuthResponse`
- **POST /api/auth/refresh-token** (Quyền: Public)
  - Body: `{ "refreshToken": "..." }`
  - Response: `AuthResponse`
- **GET /api/auth/me** (Quyền: Authenticated)
  - Response: Thong tin nguoi dung hien tai thuoc lop `NguoiDungResponse`

### 6.2 OTo API (`/api/oto`)

- **POST /api/oto** (Quyền: Admin, Nhân viên)
  - Body: `tenXe, hangXe, dongXe, namSanXuat, mauSac, dongCo, hopSo, nhienLieu, soKm, gia(required), soLuong, moTa`
- **GET /api/oto/{id}** (Quyền: Public)
- **GET /api/oto** (Quyền: Public | Hỗ trợ phân trang)
- **GET /api/oto/trang-thai/{trangThai}** (Quyền: Public | Hỗ trợ phân trang)
- **GET /api/oto/hang-xe/{hangXe}** (Quyền: Public | Hỗ trợ phân trang)
- **GET /api/oto/loc-gia?giaMin=&giaMax=** (Quyền: Public | Hỗ trợ phân trang)
- **GET /api/oto/tim-kiem?keyword=** (Quyền: Public | Hỗ trợ phân trang)
- **GET /api/oto/hang-xe** (Quyền: Public | Danh sach hang xe hien co)
- **PUT /api/oto/{id}** (Quyền: Admin, Nhân viên)
  - Cập nhật thông tin toàn phần. Body giống lúc create.
- **PATCH /api/oto/{id}/trang-thai?trangThai=** (Quyền: Admin, Nhân viên)
- **DELETE /api/oto/{id}** (Quyền: Admin)

### 6.3 Phụ kiện API (`/api/phu-kien`)

- **POST /api/phu-kien** (Quyền: Admin, Nhân viên)
  - Body: `tenPhuKien(required), loaiPhuKien, hangSanXuat, gia(required), soLuong, moTa`
- **GET /api/phu-kien/{id}** (Quyền: Public)
- **GET /api/phu-kien** (Quyền: Public | Hỗ trợ phân trang)
- **GET /api/phu-kien/tim-kiem?keyword=** (Quyền: Public | Hỗ trợ phân trang)
- **GET /api/phu-kien/loai** (Quyền: Public | Danh sach The loai phu kien)
- **PUT /api/phu-kien/{id}** (Quyền: Admin, Nhân viên)
- **DELETE /api/phu-kien/{id}** (Quyền: Admin)

### 6.4 Dịch vụ API (`/api/dich-vu`)

- **POST /api/dich-vu** (Quyền: Admin, Nhân viên)
  - Body: `tenDichVu(required), moTa, gia(required), thoiGianUocTinh`
- **GET /api/dich-vu/{id}** (Quyền: Public)
- **GET /api/dich-vu** (Quyền: Public | Hỗ trợ phân trang)
- **GET /api/dich-vu/tim-kiem?keyword=** (Quyền: Public | Hỗ trợ phân trang)
- **PUT /api/dich-vu/{id}** (Quyền: Admin, Nhân viên)
- **DELETE /api/dich-vu/{id}** (Quyền: Admin)

### 6.5 Đơn hàng API (`/api/don-hang`)

- **POST /api/don-hang** (Quyền: Authenticated)
  - Body (`DonHangRequest`):
    - `khachHangId` (Long, required)
    - `chiTietDonHangs`: Mảng `[{ loaiSanPham, otoId?, phuKienId?, dichVuId?, soLuong }]`
    - `ghiChu`
    - `diaChiGiaoHang`
- **GET /api/don-hang/{id}** (Quyền: Authenticated)
- **GET /api/don-hang/ma/{maDonHang}** (Quyền: Authenticated)
- **GET /api/don-hang** (Quyền: Admin, Nhân viên | Hỗ trợ phân trang)
- **GET /api/don-hang/khach-hang/{khachHangId}** (Quyền: Authenticated | Hỗ trợ phân trang)
- **GET /api/don-hang/trang-thai/{trangThai}** (Quyền: Authenticated | Hỗ trợ phân trang)
- **GET /api/don-hang/tim-kiem?keyword=** (Quyền: Authenticated | Hỗ trợ phân trang)
- **PATCH /api/don-hang/{id}/trang-thai?trangThai=** (Quyền: Admin, Nhân viên)
- **PATCH /api/don-hang/{donHangId}/gan-nhan-vien/{nhanVienId}** (Quyền: Admin, Nhân viên)

### 6.6 Đánh giá API (`/api/danh-gia`)

- **POST /api/danh-gia** (Quyền: Authenticated)
  - Body: `khachHangId, loaiSanPham, otoId?, phuKienId?, dichVuId?, diemDanhGia(1-5), noiDung?`
- **GET /api/danh-gia/oto/{otoId}** (Quyền: Public | Hỗ trợ phân trang)
- **GET /api/danh-gia/phu-kien/{phuKienId}** (Quyền: Public | Hỗ trợ phân trang)
- **GET /api/danh-gia/dich-vu/{dichVuId}** (Quyền: Public | Hỗ trợ phân trang)
- **GET /api/danh-gia/khach-hang/{khachHangId}** (Quyền: Public | Hỗ trợ phân trang)
- **DELETE /api/danh-gia/{id}** (Quyền: Authenticated)

### 6.7 Khiếu nại API (`/api/khieu-nai`)

- **POST /api/khieu-nai** (Quyền: Authenticated)
  - Body: `khachHangId, donHangId?, tieuDe, noiDung`
- **GET /api/khieu-nai/{id}** (Quyền: Authenticated)
- **GET /api/khieu-nai** (Quyền: Admin, Nhân viên | Hỗ trợ phân trang)
- **GET /api/khieu-nai/khach-hang/{khachHangId}** (Quyền: Authenticated | Hỗ trợ phân trang)
- **GET /api/khieu-nai/trang-thai/{trangThai}** (Quyền: Authenticated | Hỗ trợ phân trang)
- **PATCH /api/khieu-nai/{id}/phan-hoi?phanHoi=&nhanVienId=** (Quyền: Admin, Nhân viên)
- **PATCH /api/khieu-nai/{id}/trang-thai?trangThai=** (Quyền: Admin, Nhân viên)

### 6.8 Nhân viên API (`/api/nhan-vien` - Admin Only)

- **POST /api/nhan-vien** (Tạo mới)
  - Body: `hoTen, email, matKhau, soDienThoai, diaChi, maNhanVien, chucVu, phongBan, luong, ngayVaoLam`
- **GET /api/nhan-vien/{id}**
- **GET /api/nhan-vien**
- **GET /api/nhan-vien/chuc-vu/{chucVu}**
- **GET /api/nhan-vien/tim-kiem?keyword=**
- **PUT /api/nhan-vien/{id}**
- **DELETE /api/nhan-vien/{id}**

### 6.9 Người dùng API (`/api/nguoi-dung`)

- **GET /api/nguoi-dung/{id}**
- **GET /api/nguoi-dung/khach-hang** (Quyền: Admin)
- **GET /api/nguoi-dung/khach-hang/tim-kiem?keyword=** (Quyền: Admin)
- **PATCH /api/nguoi-dung/{id}/trang-thai?trangThai=true/false** (Quyền: Admin - Khoa/Mo tai khoan)

### 6.10 Media API (`/api/media`)

- **POST /api/media/upload** (Quyền: Admin, Nhân viên | Định dạng: `multipart/form-data`)
  - Form Data: `file`, `loaiDoiTuong`, `doiTuongId`, `moTa?`, `thuTu?`
- **POST /api/media/upload-multiple** (Quyền: Admin, Nhân viên | Định dạng: `multipart/form-data`)
  - Form Data: `files` (List), `loaiDoiTuong`, `doiTuongId`, `moTa?`
- **GET /api/media/{loaiDoiTuong}/{doiTuongId}** (Quyền: Public)
- **GET /api/media/{loaiDoiTuong}/{doiTuongId}/images** (Quyền: Public | Lấy ds chi bao gom Ảnh)
- **GET /api/media/{loaiDoiTuong}/{doiTuongId}/videos** (Quyền: Public | Lấy ds chỉ bao gom Video)
- **DELETE /api/media/{id}** (Quyền: Admin, Nhân viên - Xóa theo ID media file)
- **DELETE /api/media/{loaiDoiTuong}/{doiTuongId}** (Quyền: Admin, Nhân viên - Xóa toàn bộ ảnh/video của ĐT)