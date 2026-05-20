package com.sale_oto.carshop.dto.response;

import com.sale_oto.carshop.enums.TrangThaiKhieuNai;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class KhieuNaiResponse {

    private Long id;
    private String tieuDe;
    private String noiDung;
    private TrangThaiKhieuNai trangThai;
    private String phanHoi;
    private LocalDateTime ngayTao;
    private LocalDateTime ngayCapNhat;

    private KhachHangSummary khachHang;
    private DonHangSummary donHang;
    private NhanVienSummary nhanVienXuLy;

    @Data
    @Builder
    public static class KhachHangSummary {
        private Long id;
        private String hoTen;
        private String soDienThoai;
        private String email;
    }

    @Data
    @Builder
    public static class DonHangSummary {
        private Long id;
        private String maDonHang;
    }

    @Data
    @Builder
    public static class NhanVienSummary {
        private Long id;
        private String hoTen;
    }
}
