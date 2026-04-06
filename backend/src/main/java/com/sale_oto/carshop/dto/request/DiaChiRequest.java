package com.sale_oto.carshop.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DiaChiRequest {
    @NotBlank(message = "Tên người nhận không được để trống")
    private String tenNguoiNhan;

    @NotBlank(message = "Số điện thoại không được để trống")
    private String soDienThoai;

    @NotNull(message = "Tỉnh/Thành phố không được trống")
    private Integer tinhThanhId;

    private String tinhThanhTen;

    // Xã/Phường theo cấu trúc 34 tỉnh thành mới (không có huyện)
    private Integer xaPhuongId;

    private String xaPhuongTen;

    @NotBlank(message = "Địa chỉ chi tiết không được trống")
    private String diaChiChiTiet;

    // Mã GHN dùng để tính cước + tạo đơn (khác với mã 34 tỉnh thành mới)
    private Integer ghnDistrictId;
    private String ghnWardCode;

    private Boolean isDefault;
}
