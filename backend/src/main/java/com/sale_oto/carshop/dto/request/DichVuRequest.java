package com.sale_oto.carshop.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class DichVuRequest {

    @NotBlank(message = "Tên dịch vụ không được để trống")
    private String tenDichVu;

    private String moTa;

    @NotNull(message = "Giá không được để trống")
    private BigDecimal gia;

    private String thoiGianUocTinh;
}
