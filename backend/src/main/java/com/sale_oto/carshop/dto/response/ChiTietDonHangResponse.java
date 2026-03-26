package com.sale_oto.carshop.dto.response;

import com.sale_oto.carshop.enums.LoaiSanPham;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ChiTietDonHangResponse {

    private Long id;
    private LoaiSanPham loaiSanPham;
    private String tenSanPham;
    private Long sanPhamId;
    private Integer soLuong;
    private BigDecimal donGia;
    private BigDecimal thanhTien;
}
