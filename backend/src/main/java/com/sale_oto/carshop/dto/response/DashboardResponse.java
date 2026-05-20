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

public class DashboardResponse {

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Kpi {
        // Tổng (gồm cả 2 luồng)
        private BigDecimal tongDoanhThu;
        private BigDecimal doanhThuKyTruoc;
        private Double doanhThuChangePercent;

        // Phân rã doanh thu theo nguồn
        private BigDecimal doanhThuPhuKien;
        private BigDecimal doanhThuDichVu;

        // Tổng số giao dịch (đơn hàng + lịch hẹn)
        private Long soDonHang;
        private Long soDonHangKyTruoc;
        private Double donHangChangePercent;

        // Phân rã số giao dịch theo nguồn
        private Long soDonPhuKien;
        private Long soLuotDichVu;

        // Khách hàng (đã lọc trùng giữa 2 nguồn bằng Set)
        private Long khachMoi;
        private Long khachMoiKyTruoc;
        private Double khachMoiChangePercent;

        // Giá trị TB / giao dịch
        private BigDecimal aov;
        private BigDecimal aovKyTruoc;
        private Double aovChangePercent;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AppointmentStatusStat {
        private com.sale_oto.carshop.entity.LichHen.TrangThaiLichHen trangThai;
        private Long soLuong;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RevenueBreakdown {
        private BigDecimal phuKien;
        private BigDecimal dichVu;
        private BigDecimal tong;
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
