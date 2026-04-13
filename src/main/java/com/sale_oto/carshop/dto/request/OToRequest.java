package com.sale_oto.carshop.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class OToRequest {

    @NotBlank(message = "Tên xe không được để trống")
    private String tenXe;

    @NotBlank(message = "Hãng xe không được để trống")
    private String hangXe;

    private String dongXe;

    private Integer namSanXuat;

    private String mauSac;

    private String dongCo;

    private String hopSo;

    private String nhienLieu;

    private Integer soKm;

    @NotNull(message = "Giá không được để trống")
    private BigDecimal gia;

    private Integer soLuong;

    private String moTa;
}
