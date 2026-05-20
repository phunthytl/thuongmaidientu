package com.sale_oto.carshop.service;

import com.sale_oto.carshop.dto.response.DashboardResponse;
import com.sale_oto.carshop.enums.LoaiSanPham;
import com.sale_oto.carshop.enums.TrangThaiDonHang;
import com.sale_oto.carshop.repository.ChiTietDonHangRepository;
import com.sale_oto.carshop.repository.DonHangRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final DonHangRepository donHangRepository;
    private final ChiTietDonHangRepository chiTietDonHangRepository;

    @Transactional(readOnly = true)
    public DashboardResponse.Kpi getKpi(int days) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime from = now.minusDays(days);
        LocalDateTime prevFrom = from.minusDays(days);
        LocalDateTime prevTo = from;

        BigDecimal revenue = nz(donHangRepository.sumRevenueBetween(from, now));
        BigDecimal prevRevenue = nz(donHangRepository.sumRevenueBetween(prevFrom, prevTo));

        long orders = donHangRepository.countBetween(from, now);
        long prevOrders = donHangRepository.countBetween(prevFrom, prevTo);

        long customers = donHangRepository.countDistinctCustomersBetween(from, now);
        long prevCustomers = donHangRepository.countDistinctCustomersBetween(prevFrom, prevTo);

        BigDecimal aov = orders > 0
                ? revenue.divide(BigDecimal.valueOf(orders), 0, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;
        BigDecimal prevAov = prevOrders > 0
                ? prevRevenue.divide(BigDecimal.valueOf(prevOrders), 0, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        return DashboardResponse.Kpi.builder()
                .tongDoanhThu(revenue)
                .doanhThuKyTruoc(prevRevenue)
                .doanhThuChangePercent(percentChange(revenue, prevRevenue))
                .soDonHang(orders)
                .soDonHangKyTruoc(prevOrders)
                .donHangChangePercent(percentChange(orders, prevOrders))
                .khachMoi(customers)
                .khachMoiKyTruoc(prevCustomers)
                .khachMoiChangePercent(percentChange(customers, prevCustomers))
                .aov(aov)
                .aovKyTruoc(prevAov)
                .aovChangePercent(percentChange(aov, prevAov))
                .build();
    }

    @Transactional(readOnly = true)
    public List<DashboardResponse.RevenueTrendPoint> getRevenueTrend(int days) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime from = now.minusDays(days - 1L)
                .toLocalDate().atStartOfDay();

        List<Object[]> rows = donHangRepository.findRevenueTrendBetween(from, now);
        Map<LocalDate, DashboardResponse.RevenueTrendPoint> map = new java.util.HashMap<>();
        for (Object[] r : rows) {
            LocalDate day = toLocalDate(r[0]);
            BigDecimal revenue = nz((BigDecimal) r[1]);
            Long count = ((Number) r[2]).longValue();
            map.put(day, DashboardResponse.RevenueTrendPoint.builder()
                    .ngay(day)
                    .doanhThu(revenue)
                    .soDonHang(count)
                    .build());
        }

        // Fill missing days with zero
        List<DashboardResponse.RevenueTrendPoint> trend = new ArrayList<>();
        LocalDate start = from.toLocalDate();
        LocalDate end = now.toLocalDate();
        for (LocalDate d = start; !d.isAfter(end); d = d.plusDays(1)) {
            trend.add(map.getOrDefault(d, DashboardResponse.RevenueTrendPoint.builder()
                    .ngay(d)
                    .doanhThu(BigDecimal.ZERO)
                    .soDonHang(0L)
                    .build()));
        }
        return trend;
    }

    @Transactional(readOnly = true)
    public List<DashboardResponse.OrderStatusStat> getOrderStatusStats(int days) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime from = now.minusDays(days);

        Map<TrangThaiDonHang, Long> map = new EnumMap<>(TrangThaiDonHang.class);
        for (Object[] r : donHangRepository.findOrderStatusStatsBetween(from, now)) {
            map.put((TrangThaiDonHang) r[0], ((Number) r[1]).longValue());
        }

        List<DashboardResponse.OrderStatusStat> result = new ArrayList<>();
        for (TrangThaiDonHang st : TrangThaiDonHang.values()) {
            result.add(DashboardResponse.OrderStatusStat.builder()
                    .trangThai(st)
                    .soLuong(map.getOrDefault(st, 0L))
                    .build());
        }
        return result;
    }

    @Transactional(readOnly = true)
    public List<DashboardResponse.TopProduct> getTopProducts(int days, int limit) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime from = now.minusDays(days);

        List<DashboardResponse.TopProduct> result = new ArrayList<>();
        for (Object[] r : chiTietDonHangRepository.findTopProductsBetween(from, now, PageRequest.of(0, limit))) {
            result.add(DashboardResponse.TopProduct.builder()
                    .loaiSanPham((LoaiSanPham) r[0])
                    .sanPhamId(r[1] == null ? null : ((Number) r[1]).longValue())
                    .tenSanPham((String) r[2])
                    .soLuongBan(r[3] == null ? 0L : ((Number) r[3]).longValue())
                    .doanhThu(nz((BigDecimal) r[4]))
                    .build());
        }
        return result;
    }

    @Transactional(readOnly = true)
    public List<DashboardResponse.RecentOrder> getRecentOrders() {
        return donHangRepository.findTop10ByOrderByNgayTaoDesc().stream()
                .map(dh -> DashboardResponse.RecentOrder.builder()
                        .id(dh.getId())
                        .maDonHang(dh.getMaDonHang())
                        .tenKhachHang(dh.getKhachHang() != null ? dh.getKhachHang().getHoTen() : null)
                        .tongTien(dh.getTongTien())
                        .trangThai(dh.getTrangThai())
                        .ngayTao(dh.getNgayTao())
                        .build())
                .toList();
    }

    // ========== helpers ==========

    private static BigDecimal nz(BigDecimal v) {
        return v == null ? BigDecimal.ZERO : v;
    }

    private static Double percentChange(BigDecimal current, BigDecimal prev) {
        if (prev == null || prev.compareTo(BigDecimal.ZERO) == 0) {
            return current != null && current.compareTo(BigDecimal.ZERO) > 0 ? 100.0 : 0.0;
        }
        return current.subtract(prev)
                .divide(prev, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .doubleValue();
    }

    private static Double percentChange(long current, long prev) {
        if (prev == 0) return current > 0 ? 100.0 : 0.0;
        return ((double) (current - prev) / prev) * 100.0;
    }

    private static LocalDate toLocalDate(Object dbDate) {
        if (dbDate instanceof LocalDate ld) return ld;
        if (dbDate instanceof Date sqlDate) return sqlDate.toLocalDate();
        if (dbDate instanceof java.util.Date utilDate) {
            return utilDate.toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDate();
        }
        return LocalDate.parse(dbDate.toString());
    }
}
