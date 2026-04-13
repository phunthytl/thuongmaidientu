package com.sale_oto.carshop.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class DonHangRequest {

    @NotNull(message = "Khách hàng không được để trống")
    private Long khachHangId;

    @NotEmpty(message = "Đơn hàng phải có ít nhất 1 sản phẩm")
    private List<ChiTietDonHangRequest> chiTietDonHangs;

    private String ghiChu;

    private Long diaChiGiaoHangId;
}
