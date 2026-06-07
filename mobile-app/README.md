# CarShop Mobile

App mobile cho khách hàng, dùng Expo React Native và gọi REST API từ backend Spring Boot hiện tại.

## Bước chạy app

1. Chạy backend ở cổng `8080`.
2. Cài dependency:

```powershell
cd mobile-app
npm install
```

3. Cấu hình API nếu cần:

```powershell
Copy-Item .env.example .env
```

- Android Emulator: `http://10.0.2.2:8080/api`
- Máy thật cùng Wi-Fi: đổi thành `http://<IP-may-tinh>:8080/api`
- iOS Simulator: có thể dùng `http://localhost:8080/api`

4. Chạy app:

```powershell
npm start
```

## Tính năng đã dựng

- Đăng nhập, đăng ký, lưu token, tự refresh token.
- Trang chủ: xe nổi bật, phụ kiện mới, danh mục nhanh.
- Tìm kiếm/lọc/sắp xếp sản phẩm.
- Chi tiết sản phẩm, ảnh, giá, mô tả, tồn kho, đánh giá.
- Giỏ hàng: thêm, xóa, cập nhật số lượng.
- Thanh toán: chọn kho, địa chỉ, tạo đơn.
- Quản lý đơn hàng và chi tiết đơn.
- Đánh giá sản phẩm.
- Yêu thích sản phẩm lưu local trên máy.
- Thông báo dạng local/in-app để sẵn màn hình, có thể nối FCM sau.

## Ghi chú API

Backend hiện tại đang dùng địa chỉ theo route:

```text
GET/POST /api/khach-hang/{khachHangId}/dia-chi
PUT/DELETE /api/khach-hang/{khachHangId}/dia-chi/{id}
```

Không phải `/api/dia-chi` như tài liệu cũ.

## Test xác nhận thanh toán VNPay trên mobile web

Khi chạy app mobile bằng Chrome ở `http://localhost:8081`, backend cần redirect kết quả VNPay về app mobile:

```properties
VNPAY_FRONTEND_RETURN_URL=http://localhost:8081/payment-result
```

Nếu muốn test trên web React cũ thì đổi lại:

```properties
VNPAY_FRONTEND_RETURN_URL=http://localhost:3000/thanh-toan/ket-qua
```

Sau khi đổi `.env` backend, cần restart Spring Boot.
