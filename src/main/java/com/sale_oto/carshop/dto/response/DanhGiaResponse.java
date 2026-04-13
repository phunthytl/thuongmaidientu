package com.sale_oto.carshop.dto.response;

import com.sale_oto.carshop.enums.LoaiSanPham;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class DanhGiaResponse {

    private Long id;
    private String tenKhachHang;
    private Long khachHangId;
    private LoaiSanPham loaiSanPham;
    private String tenSanPham;
    private Integer diemDanhGia;
    private String noiDung;
    private Boolean trangThai;
    private LocalDateTime ngayTao;
}
