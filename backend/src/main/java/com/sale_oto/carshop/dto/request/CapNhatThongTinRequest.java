package com.sale_oto.carshop.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CapNhatThongTinRequest {
    @NotBlank(message = "Họ tên không được để trống")
    private String hoTen;

    @NotBlank(message = "Số điện thoại không được để trống")
    private String soDienThoai;
}
