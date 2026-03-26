package com.sale_oto.carshop.dto.response;

import com.sale_oto.carshop.enums.TrangThaiDonHang;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class DonHangResponse {

    private Long id;
    private String maDonHang;
    private String tenKhachHang;
    private Long khachHangId;
    private String tenNhanVienXuLy;
    private Long nhanVienXuLyId;
    private BigDecimal tongTien;
    private TrangThaiDonHang trangThai;
    private String ghiChu;
    private String diaChiGiaoHang;
    private List<ChiTietDonHangResponse> chiTietDonHangs;
    private LocalDateTime ngayTao;
    private LocalDateTime ngayCapNhat;
}
