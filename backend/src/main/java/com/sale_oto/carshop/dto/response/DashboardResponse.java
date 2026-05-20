package com.sale_oto.carshop.dto.response;

import com.sale_oto.carshop.enums.LoaiSanPham;
import com.sale_oto.carshop.enums.TrangThaiDonHang;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class DashboardResponse {

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Kpi {
        private BigDecimal tongDoanhThu;
        private BigDecimal doanhThuKyTruoc;
        private Double doanhThuChangePercent;

        private Long soDonHang;
        private Long soDonHangKyTruoc;
        private Double donHangChangePercent;

        private Long khachMoi;
        private Long khachMoiKyTruoc;
        private Double khachMoiChangePercent;

        private BigDecimal aov;
        private BigDecimal aovKyTruoc;
        private Double aovChangePercent;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RevenueTrendPoint {
        private LocalDate ngay;
        private BigDecimal doanhThu;
        private Long soDonHang;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class OrderStatusStat {
        private TrangThaiDonHang trangThai;
        private Long soLuong;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TopProduct {
        private LoaiSanPham loaiSanPham;
        private Long sanPhamId;
        private String tenSanPham;
        private Long soLuongBan;
        private BigDecimal doanhThu;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RecentOrder {
        private Long id;
        private String maDonHang;
        private String tenKhachHang;
        private BigDecimal tongTien;
        private TrangThaiDonHang trangThai;
        private LocalDateTime ngayTao;
    }
}
