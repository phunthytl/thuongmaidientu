package com.sale_oto.carshop.service;

import com.sale_oto.carshop.dto.response.DashboardResponse;
import com.sale_oto.carshop.enums.LoaiSanPham;
import com.sale_oto.carshop.enums.TrangThaiDonHang;
import com.sale_oto.carshop.repository.ChiTietDonHangRepository;
import com.sale_oto.carshop.repository.DonHangRepository;
import com.sale_oto.carshop.repository.LichHenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.EnumMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final DonHangRepository donHangRepository;
    private final ChiTietDonHangRepository chiTietDonHangRepository;
    private final LichHenRepository lichHenRepository;

    @Transactional(readOnly = true)
    public DashboardResponse.Kpi getKpi(int days) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime from = now.minusDays(days);
        LocalDateTime prevFrom = from.minusDays(days);
        LocalDateTime prevTo = from;

        // ===== Doanh thu phân rã theo nguồn =====
        BigDecimal revenuePhuKien = nz(donHangRepository.sumRevenueBetween(from, now));
        BigDecimal revenueDichVu  = nz(lichHenRepository.sumServiceRevenueBetween(from, now));
        BigDecimal revenue = revenuePhuKien.add(revenueDichVu);

        BigDecimal prevRevenuePhuKien = nz(donHangRepository.sumRevenueBetween(prevFrom, prevTo));
        BigDecimal prevRevenueDichVu  = nz(lichHenRepository.sumServiceRevenueBetween(prevFrom, prevTo));
        BigDecimal prevRevenue = prevRevenuePhuKien.add(prevRevenueDichVu);

        // ===== Số giao dịch phân rã =====
        long soDonPhuKien = donHangRepository.countBetween(from, now);
        long soLuotDichVu = lichHenRepository.countServiceBetween(from, now);
        long orders = soDonPhuKien + soLuotDichVu;
        long prevOrders = donHangRepository.countBetween(prevFrom, prevTo)
                        + lichHenRepository.countServiceBetween(prevFrom, prevTo);

        // ===== Khách hàng: UNION DISTINCT (dùng Set để lọc trùng giữa 2 nguồn) =====
        long customers = countUnionCustomers(from, now);
        long prevCustomers = countUnionCustomers(prevFrom, prevTo);

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
                .doanhThuPhuKien(revenuePhuKien)
                .doanhThuDichVu(revenueDichVu)
                .soDonHang(orders)
                .soDonHangKyTruoc(prevOrders)
                .donHangChangePercent(percentChange(orders, prevOrders))
                .soDonPhuKien(soDonPhuKien)
                .soLuotDichVu(soLuotDichVu)
                .khachMoi(customers)
                .khachMoiKyTruoc(prevCustomers)
                .khachMoiChangePercent(percentChange(customers, prevCustomers))
                .aov(aov)
                .aovKyTruoc(prevAov)
                .aovChangePercent(percentChange(aov, prevAov))
                .build();
    }

    /**
     * Đếm khách hàng UNIQUE giữa 2 nguồn (đơn hàng + lịch hẹn dịch vụ).
     * Dùng Set để loại trùng — 1 khách vừa mua phụ kiện vừa đặt lịch chỉ tính 1.
     */
    private long countUnionCustomers(LocalDateTime from, LocalDateTime to) {
        Set<Long> ids = new HashSet<>(donHangRepository.findDistinctCustomerIdsBetween(from, to));
        ids.addAll(lichHenRepository.findDistinctServiceCustomerIdsBetween(from, to));
        return ids.size();
    }

    @Transactional(readOnly = true)
    public List<DashboardResponse.RevenueTrendPoint> getRevenueTrend(int days) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime from = now.minusDays(days - 1L)
                .toLocalDate().atStartOfDay();

        // Gộp 2 nguồn: DonHang + LichHen DICH_VU
        Map<LocalDate, BigDecimal> revMap = new java.util.HashMap<>();
        Map<LocalDate, Long> countMap = new java.util.HashMap<>();

        for (Object[] r : donHangRepository.findRevenueTrendBetween(from, now)) {
            LocalDate day = toLocalDate(r[0]);
            revMap.merge(day, nz((BigDecimal) r[1]), BigDecimal::add);
            countMap.merge(day, ((Number) r[2]).longValue(), Long::sum);
        }
        for (Object[] r : lichHenRepository.findServiceRevenueTrendBetween(from, now)) {
            LocalDate day = toLocalDate(r[0]);
            revMap.merge(day, nz((BigDecimal) r[1]), BigDecimal::add);
            countMap.merge(day, ((Number) r[2]).longValue(), Long::sum);
        }

        // Fill missing days with zero
        List<DashboardResponse.RevenueTrendPoint> trend = new ArrayList<>();
        LocalDate start = from.toLocalDate();
        LocalDate end = now.toLocalDate();
        for (LocalDate d = start; !d.isAfter(end); d = d.plusDays(1)) {
            trend.add(DashboardResponse.RevenueTrendPoint.builder()
                    .ngay(d)
                    .doanhThu(revMap.getOrDefault(d, BigDecimal.ZERO))
                    .soDonHang(countMap.getOrDefault(d, 0L))
                    .build());
        }
        return trend;
    }

    @Transactional(readOnly = true)
    public List<DashboardResponse.AppointmentStatusStat> getAppointmentStatusStats(int days) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime from = now.minusDays(days);

        Map<com.sale_oto.carshop.entity.LichHen.TrangThaiLichHen, Long> map = new java.util.EnumMap<>(com.sale_oto.carshop.entity.LichHen.TrangThaiLichHen.class);
        for (Object[] r : lichHenRepository.findAppointmentStatusStatsBetween(from, now)) {
            map.put((com.sale_oto.carshop.entity.LichHen.TrangThaiLichHen) r[0], ((Number) r[1]).longValue());
        }

        List<DashboardResponse.AppointmentStatusStat> result = new ArrayList<>();
        for (com.sale_oto.carshop.entity.LichHen.TrangThaiLichHen st : com.sale_oto.carshop.entity.LichHen.TrangThaiLichHen.values()) {
            result.add(DashboardResponse.AppointmentStatusStat.builder()
                    .trangThai(st)
                    .soLuong(map.getOrDefault(st, 0L))
                    .build());
        }
        return result;
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

        // Lấy nhiều hơn từ mỗi nguồn để có đủ candidate khi sort gộp
        int fetchSize = Math.max(limit * 2, 10);

        List<DashboardResponse.TopProduct> result = new ArrayList<>();

        // Top từ ChiTietDonHang (Ô tô + Phụ kiện + Dịch vụ mua qua đơn hàng)
        for (Object[] r : chiTietDonHangRepository.findTopProductsBetween(from, now, PageRequest.of(0, fetchSize))) {
            result.add(DashboardResponse.TopProduct.builder()
                    .loaiSanPham((LoaiSanPham) r[0])
                    .sanPhamId(r[1] == null ? null : ((Number) r[1]).longValue())
                    .tenSanPham((String) r[2])
                    .soLuongBan(r[3] == null ? 0L : ((Number) r[3]).longValue())
                    .doanhThu(nz((BigDecimal) r[4]))
                    .build());
        }

        // Top từ LichHen (Dịch vụ booking)
        for (Object[] r : lichHenRepository.findTopServicesBetween(from, now, PageRequest.of(0, fetchSize))) {
            Long dvId = r[0] == null ? null : ((Number) r[0]).longValue();
            String dvName = (String) r[1];
            Long count = r[2] == null ? 0L : ((Number) r[2]).longValue();
            BigDecimal rev = nz((BigDecimal) r[3]);

            // Nếu đã có DICH_VU cùng id trong list trên (mua qua đơn) → cộng dồn
            DashboardResponse.TopProduct existing = result.stream()
                    .filter(p -> p.getLoaiSanPham() == LoaiSanPham.DICH_VU
                            && dvId != null && dvId.equals(p.getSanPhamId()))
                    .findFirst().orElse(null);

            if (existing != null) {
                existing.setSoLuongBan(existing.getSoLuongBan() + count);
                existing.setDoanhThu(existing.getDoanhThu().add(rev));
            } else {
                result.add(DashboardResponse.TopProduct.builder()
                        .loaiSanPham(LoaiSanPham.DICH_VU)
                        .sanPhamId(dvId)
                        .tenSanPham(dvName)
                        .soLuongBan(count)
                        .doanhThu(rev)
                        .build());
            }
        }

        // Sort gộp theo SỐ LƯỢNG BÁN desc (chuẩn "bán chạy" của TMĐT),
        // doanh thu làm tiêu chí phụ khi số lượng bằng nhau. Lấy top N.
        result.sort(Comparator
                .comparingLong(DashboardResponse.TopProduct::getSoLuongBan).reversed()
                .thenComparing(DashboardResponse.TopProduct::getDoanhThu, Comparator.reverseOrder()));
        return result.size() > limit ? result.subList(0, limit) : result;
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
        if (dbDate == null) return LocalDate.now();
        if (dbDate instanceof LocalDate ld) return ld;
        if (dbDate instanceof Date sqlDate) return sqlDate.toLocalDate();
        if (dbDate instanceof java.util.Date utilDate) {
            return utilDate.toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDate();
        }
        return LocalDate.parse(dbDate.toString());
    }
}
