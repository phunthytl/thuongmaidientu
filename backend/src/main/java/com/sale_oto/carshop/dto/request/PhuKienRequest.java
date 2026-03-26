package com.sale_oto.carshop.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PhuKienRequest {

    @NotBlank(message = "Tên phụ kiện không được để trống")
    private String tenPhuKien;

    private String loaiPhuKien;

    private String hangSanXuat;

    @NotNull(message = "Giá không được để trống")
    private BigDecimal gia;

    private Integer soLuong;

    private String moTa;
}
