# Build Frontend Admin - Minimalist Luxury

## Goal
Tạo trang quản trị (Admin Dashboard) theo phong cách Minimalist Luxury bằng Pure Tailwind CSS, tập trung vào khung Layout, xác thực (Auth), và phân hệ Kho sản phẩm (Ô tô, Phụ kiện, Dịch vụ).

## Architecture & State
- **Routing:** react-router-dom v7
- **Styling:** Tailwind CSS v4 (Pure)
- **Palette:** Trắng (Nền), Đen Lì/Xám Chì (Text & Accent), Vàng Đồng/Bạc (High-end accents).
- **Typography:** Lora (Serif) + Manrope (Sans).

## Tasks
- [x] Task 1: Khởi tạo cấu trúc `src` (Thư mục components, pages, utils, hooks). → Verify: Thư mục `src` tồn tại.
- [x] Task 2: Thiết lập Tailwind CSS v4 (theme, colors, fonts tại `index.css`). → Verify: Biến màu áp dụng thành công.
- [x] Task 3: Xây dựng Layout `MinimalistAdminLayout` (Top bar + Side/Off-canvas Menu siêu tối giản). → Verify: Render được khung giao diện không đổ bóng (no shadow), nền màu sáng sang trọng.
- [x] Task 4: Làm trang Login cho NhanVien/Admin (Form đăng nhập Minimalist Luxury). → Verify: Form hiển thị sắc nét.
- [x] Task 5: Làm UI các trang Quản lý Kho sản phẩm (Oto, PhuKien, DichVu) dạng Bảng dữ liệu Typography Brutalism (Tối giản viền). → Verify: Render bảng tĩnh thành công.
- [x] Task 6: Tích hợp Routing vào `App.jsx` & `index.jsx`. → Verify: App render được.

## Done When
- [x] Hệ thống hiển thị giao diện Admin hoàn chỉnh, phong cách đẳng cấp.
- [x] Định tuyến Auth -> Dashboard -> Sản phẩm mượt mà.

## Phase 2: Data Flow & Security (Hoàn thành)
- [x] Task 7: Cài đặt thư viện `axios`, `zustand`.
- [x] Task 8: Xây dựng `src/services/api.js` (Interceptors, Refresh Token).
- [x] Task 9: Xây dựng Zustand Auth Store phân loại theo `VaiTro`.
- [x] Task 10: Xây dựng Auth Guard `ProtectedRoute.jsx` kiểm tra role `ADMIN` để vào `/admin`.
- [x] Task 11: Tạo `/login` cho khách hàng và phân biệt kết nối với `/admin/login`.
