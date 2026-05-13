# Tài liệu Kiểm thử (Test Cases) - Hệ thống CarShop

Dưới đây là danh sách các kịch bản kiểm thử (test cases) dựa trên các chức năng đã được triển khai trong hệ thống, bao gồm cả vai trò **Khách hàng (User)** và **Quản trị viên (Admin)**.

---

## 1. Xác thực & Phân quyền (Authentication & Authorization)

| STT | Chức năng | Mô tả test case | Dữ liệu đầu vào | Bước thực hiện | Kết quả mong đợi | Trạng thái |
|:---:|:---|:---|:---|:---|:---|:---:|
| 1 | Đăng nhập | Đăng nhập thành công (Client) | email: user@test.com, matKhau: 123456 | 1. Truy cập trang Đăng nhập.<br>2. Nhập email và mật khẩu đúng.<br>3. Nhấn "Đăng nhập". | Chuyển hướng về trang chủ, hiển thị thông tin user ở header. | |
| 2 | Đăng nhập | Đăng nhập thất bại (Sai mật khẩu) | email: user@test.com, matKhau: abcxyz | 1. Truy cập trang Đăng nhập.<br>2. Nhập email đúng, mật khẩu sai.<br>3. Nhấn "Đăng nhập". | Hiển thị thông báo lỗi "Sai email hoặc mật khẩu". | |
| 3 | Đăng ký | Đăng ký tài khoản mới thành công | HoTen, Email, MatKhau, SDT hợp lệ | 1. Truy cập trang Đăng ký.<br>2. Điền đầy đủ thông tin.<br>3. Nhấn "Đăng ký". | Hiển thị thông báo thành công, chuyển hướng đến trang Đăng nhập. | |
| 4 | Đăng ký | Đăng ký thất bại (Email đã tồn tại) | Email đã có trong hệ thống | 1. Truy cập trang Đăng ký.<br>2. Nhập email đã được đăng ký trước đó.<br>3. Nhấn "Đăng ký". | Hiển thị lỗi "Email đã được sử dụng". | |
| 5 | Phân quyền | Truy cập trang Admin bằng tài khoản Client | Token của tài khoản ROLE_USER | 1. Đăng nhập bằng tài khoản khách hàng.<br>2. Cố gắng truy cập link `/admin/dashboard`. | Hệ thống từ chối truy cập (403 Forbidden) hoặc chuyển hướng về trang chủ. | |
| 19 | Refresh Token | Tự động làm mới phiên làm việc | Token sắp hết hạn | 1. Sử dụng hệ thống khi token gần hết hạn.<br>2. Thực hiện một hành động (ví dụ: Load Profile). | Hệ thống tự động gọi API `/refresh-token` và tiếp tục hoạt động không cần đăng nhập lại. | |

---

## 2. Quản lý Sản phẩm (Dành cho Khách hàng)

| STT | Chức năng | Mô tả test case | Dữ liệu đầu vào | Bước thực hiện | Kết quả mong đợi | Trạng thái |
|:---:|:---|:---|:---|:---|:---|:---:|
| 6 | Tìm kiếm | Tìm kiếm xe theo từ khóa | Keyword: "Toyota" | 1. Vào trang Danh sách xe.<br>2. Nhập "Toyota" vào thanh tìm kiếm.<br>3. Nhấn Enter. | Hiển thị danh sách các xe có tên hoặc mô tả chứa từ "Toyota". | |
| 7 | Lọc sản phẩm | Lọc xe theo khoảng giá | Giá từ 500tr - 1 tỷ | 1. Vào trang Danh sách xe.<br>2. Chọn khoảng giá 500.000.000 - 1.000.000.000.<br>3. Nhấn Lọc. | Danh sách chỉ hiển thị các xe có giá trong khoảng đã chọn. | |
| 8 | Xem chi tiết | Xem chi tiết ô tô | ID xe hợp lệ | 1. Click vào một xe bất kỳ từ danh sách. | Hiển thị đầy đủ thông số kỹ thuật, giá, hình ảnh và mô tả của xe. | |

---

## 3. Giỏ hàng & Thanh toán (Shopping Cart & Checkout)

| STT | Chức năng | Mô tả test case | Dữ liệu đầu vào | Bước thực hiện | Kết quả mong đợi | Trạng thái |
|:---:|:---|:---|:---|:---|:---|:---:|
| 9 | Giỏ hàng | Thêm phụ kiện vào giỏ hàng | Phụ kiện: "Lốp xe Michelin" | 1. Vào chi tiết phụ kiện.<br>2. Chọn số lượng.<br>3. Nhấn "Thêm vào giỏ hàng". | Hiển thị thông báo thành công, số lượng item trên icon giỏ hàng tăng lên. | |
| 10 | Thanh toán | Tính phí vận chuyển tự động (GHN) | Địa chỉ: Quận 1, HCM | 1. Vào trang Thanh toán.<br>2. Chọn địa chỉ giao hàng.<br>3. Chọn kho xuất hàng (HN/ĐN/HCM). | Phí vận chuyển được tính dựa trên API GHN và hiển thị vào tổng tiền. | |
| 11 | Đặt hàng | Đặt hàng thành công | Thông tin giao hàng đầy đủ | 1. Kiểm tra lại giỏ hàng.<br>2. Nhấn "Đặt hàng". | Tạo đơn hàng thành công, hiển thị mã đơn hàng, chuyển về trang Lịch sử đơn hàng. | |
| 20 | Giỏ hàng | Xóa sản phẩm khỏi giỏ hàng | 1 sản phẩm trong giỏ | 1. Vào trang Giỏ hàng.<br>2. Nhấn nút "Xóa" (biểu tượng thùng rác). | Sản phẩm biến mất khỏi giỏ hàng, tổng tiền cập nhật lại. | |
| 21 | Giỏ hàng | Cập nhật số lượng sản phẩm | Tăng số lượng từ 1 lên 2 | 1. Vào trang Giỏ hàng.<br>2. Thay đổi số lượng của một phụ kiện. | Tổng tiền của item và tổng tiền giỏ hàng cập nhật ngay lập tức. | |

---

## 4. Quản trị hệ thống (Dành cho Admin/Nhân viên)

| STT | Chức năng | Mô tả test case | Dữ liệu đầu vào | Bước thực hiện | Kết quả mong đợi | Trạng thái |
|:---:|:---|:---|:---|:---|:---|:---:|
| 12 | Thêm xe mới | Admin thêm xe mới thành công | Thông tin xe đầy đủ | 1. Vào trang Quản lý xe -> Thêm mới.<br>2. Nhập thông tin, upload ảnh.<br>3. Nhấn Lưu. | Xe mới xuất hiện trong danh sách quản lý và hiển thị trên trang chủ client. | |
| 13 | Quản lý đơn hàng | Cập nhật trạng thái đơn hàng | Trạng thái: "Đã xác nhận" | 1. Chọn 1 đơn hàng "Chờ xác nhận".<br>2. Đổi trạng thái sang "Đã xác nhận".<br>3. Nhấn Cập nhật. | Đơn hàng đổi trạng thái, hệ thống tự động tạo vận đơn GHN (nếu là phụ kiện). | |
| 14 | Quản lý kho | Kiểm tra tồn kho sau khi đặt hàng | Sản phẩm A, số lượng 1 | 1. Khách hàng đặt mua 1 sản phẩm A.<br>2. Admin kiểm tra số lượng tồn kho của sản phẩm A. | Số lượng tồn kho giảm đi 1 so với ban đầu. | |
| 22 | Thêm xe mới | Thất bại do thiếu trường bắt buộc | Để trống "Tên xe" hoặc "Giá" | 1. Vào trang Thêm xe.<br>2. Để trống các trường dấu *.<br>3. Nhấn "Xác nhận". | Hệ thống báo lỗi "Vui lòng nhập đầy đủ thông tin bắt buộc" hoặc báo lỗi ở từng ô nhập. | |
| 23 | Quản lý User | Chặn/Mở chặn tài khoản khách hàng | User ID cụ thể | 1. Vào trang Quản lý khách hàng.<br>2. Nhấn vào icon khóa/mở khóa. | Trạng thái hoạt động của user thay đổi, user bị khóa sẽ không thể đăng nhập. | |
| 24 | Quản lý Nhân viên | Thêm nhân viên mới thành công | HoTen, Email, ChucVu hợp lệ | 1. Vào Quản lý nhân viên -> Thêm mới.<br>2. Nhập thông tin và phân quyền (ROLE_NV). | Nhân viên mới có thể dùng email đó để đăng nhập vào trang Admin. | |

---

## 5. Tài khoản & Thông tin cá nhân (Profile)

| STT | Chức năng | Mô tả test case | Dữ liệu đầu vào | Bước thực hiện | Kết quả mong đợi | Trạng thái |
|:---:|:---|:---|:---|:---|:---|:---:|
| 15 | Địa chỉ | Thêm địa chỉ giao hàng mới | Tên, SDT, Tỉnh/Thành GHN | 1. Vào Profile -> Sổ địa chỉ.<br>2. Nhấn "Thêm địa chỉ".<br>3. Nhập thông tin. | Địa chỉ mới được lưu vào danh sách và có thể chọn khi thanh toán. | |
| 16 | Đánh giá | Gửi đánh giá sản phẩm | Nội dung, số sao | 1. Vào chi tiết sản phẩm đã mua.<br>2. Nhập đánh giá.<br>3. Nhấn Gửi. | Đánh giá hiển thị ở phần bình luận của sản phẩm. | |
| 17 | Khiếu nại | Khách hàng gửi khiếu nại | Nội dung khiếu nại, hình ảnh | 1. Vào trang Khiếu nại (hoặc từ chi tiết đơn hàng).<br>2. Nhập lý do và mô tả.<br>3. Nhấn Gửi. | Khiếu nại được tạo ở trạng thái "Mới", hiển thị trong danh sách của Admin. | |
| 18 | Theo dõi đơn hàng | Kiểm tra hành trình đơn hàng | Mã đơn hàng GHN | 1. Vào Lịch sử đơn hàng.<br>2. Nhấn vào đơn hàng đang giao. | Hiển thị thông tin hành trình từ API GHN (nếu đã có mã vận đơn). | |
