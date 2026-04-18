# CarShop Backend - Hệ thống Quản lý Ô tô

Dự án Backend cho hệ thống Thương mại điện tử mua bán ô tô, phụ kiện và dịch vụ bảo dưỡng.

## 🚀 Hướng dẫn chạy dự án

### 1. Yêu cầu hệ thống
- Java 17+
- MySQL 8.0+
- Maven 3.8+

### 2. Cài đặt Database
- Tạo database tên: `sale_oto_db` (hoặc tên tùy chọn trong `application.properties`).
- Cấu hình username/password trong `src/main/resources/application.properties`.

### 3. Khởi chạy Server
Dùng lệnh Maven:
```bash
./mvnw spring-boot:run
```
Server sẽ chạy tại: `http://localhost:8081`

---

## 🔑 Tài khoản mặc định (Seed Data)
Hệ thống tự động tạo dữ liệu mẫu khi khởi chạy lần đầu:
- **Admin:** `admin@carshop.com` / `admin123`
- **Dữ liệu xe:** Toyota Camry 2.5Q, Honda CR-V L.

---

## ⭐ Chức năng trọng tâm: Đánh giá sản phẩm (Review)

Chức năng này cho phép người dùng (User) đánh giá các mẫu ô tô trong hệ thống.

### Các API chính

| Method | Endpoint | Quyền | Mô tả |
|---|---|---|---|
| `POST` | `/api/user/reviews` | Đăng nhập | Tạo đánh giá mới (1 user/1 xe/1 lần) |
| `GET` | `/api/user/reviews` | Đăng nhập | Xem danh sách đánh giá của tôi |
| `GET` | `/api/oto/{id}/reviews` | Public | Xem tất cả đánh giá của một xe |
| `GET` | `/api/oto/{id}/rating-summary` | Public | Xem điểm TB & tổng số review |

### Các bước kiểm tra nhanh bằng Postman:

1. **Đăng nhập:** `POST /api/auth/dang-nhap` bằng tài khoản Admin ở trên để lấy `accessToken`.
2. **Lấy danh sách xe:** `GET /api/oto` để lấy `id` của xe mẫu (ví dụ: `id: 1`).
3. **Gửi đánh giá:** `POST /api/user/reviews`
   - Tab **Authorization**: Chọn `Bearer Token` và dán `accessToken` vào.
   - Tab **Body (JSON)**:
     ```json
     {
       "otoId": 1,
       "diemDanhGia": 5,
       "binhLuan": "Xe chạy cực êm, đáng đồng tiền bát gạo!"
     }
     ```
4. **Xem kết quả:** `GET /api/oto/1/rating-summary` để thấy điểm trung bình đã được cập nhật.

---

## 🛠 Cấu trúc dự án
- `controller`: Tiếp nhận và điều hướng request.
- `service`: Xử lý nghiệp vụ (Validation, Logic đánh giá).
- `repository`: Tương tác với Database (MySQL).
- `entity`: Định nghĩa cấu trúc bảng dữ liệu.
- `dto`: Định dạng dữ liệu trao đổi (Request/Response).

---
*Dự án được xây dựng cho mục tiêu hoàn thành Buổi 1 - Xây dựng nền tảng Backend.*
