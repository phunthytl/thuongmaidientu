package com.sale_oto.carshop.dto.response;

import com.sale_oto.carshop.enums.LoaiSanPham;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ChiTietGioHangResponse {

    private Long id;
    private LoaiSanPham loaiSanPham;
    private Long sanPhamId;
    private String tenSanPham;
    private String hinhAnh;
    private Integer soLuong;
    private BigDecimal donGia;
    private BigDecimal thanhTien;
    private Long khoHangId;
}
