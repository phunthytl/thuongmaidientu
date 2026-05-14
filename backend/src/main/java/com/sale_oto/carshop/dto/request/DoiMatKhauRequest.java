package com.sale_oto.carshop.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DoiMatKhauRequest {
    @NotBlank(message = "Mật khẩu cũ không được để trống")
    private String matKhauCu;

    @NotBlank(message = "Mật khẩu mới không được để trống")
    private String matKhauMoi;
}
