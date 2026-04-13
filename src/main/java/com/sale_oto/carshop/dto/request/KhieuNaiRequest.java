package com.sale_oto.carshop.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class KhieuNaiRequest {

    @NotNull(message = "Khách hàng không được để trống")
    private Long khachHangId;

    private Long donHangId;

    @NotBlank(message = "Tiêu đề không được để trống")
    private String tieuDe;

    @NotBlank(message = "Nội dung không được để trống")
    private String noiDung;
}
