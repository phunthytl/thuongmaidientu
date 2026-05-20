package com.sale_oto.carshop.repository;

import com.sale_oto.carshop.entity.LichHen;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LichHenRepository extends JpaRepository<LichHen, Long> {
    List<LichHen> findByNguoiDungId(Long nguoiDungId);
    List<LichHen> findByLoaiLich(LichHen.LoaiLichHen loaiLich);

    // ========== DASHBOARD: SERVICE REVENUE FROM APPOINTMENTS ==========
    // Chỉ tính lịch hẹn DỊCH VỤ đã HOÀN THÀNH trong khoảng thời gian

    @Query("SELECT COALESCE(SUM(lh.dichVu.gia), 0) FROM LichHen lh " +
           "WHERE lh.loaiLich = com.sale_oto.carshop.entity.LichHen.LoaiLichHen.DICH_VU " +
           "  AND lh.trangThai = com.sale_oto.carshop.entity.LichHen.TrangThaiLichHen.DA_HOAN_THANH " +
           "  AND lh.ngayTao BETWEEN :tuNgay AND :denNgay")
    java.math.BigDecimal sumServiceRevenueBetween(@Param("tuNgay") LocalDateTime tuNgay,
                                                  @Param("denNgay") LocalDateTime denNgay);

    @Query("SELECT COUNT(lh) FROM LichHen lh " +
           "WHERE lh.loaiLich = com.sale_oto.carshop.entity.LichHen.LoaiLichHen.DICH_VU " +
           "  AND lh.ngayTao BETWEEN :tuNgay AND :denNgay")
    long countServiceBetween(@Param("tuNgay") LocalDateTime tuNgay,
                             @Param("denNgay") LocalDateTime denNgay);

    @Query("SELECT COUNT(DISTINCT lh.nguoiDung.id) FROM LichHen lh " +
           "WHERE lh.loaiLich = com.sale_oto.carshop.entity.LichHen.LoaiLichHen.DICH_VU " +
           "  AND lh.ngayTao BETWEEN :tuNgay AND :denNgay")
    long countDistinctServiceCustomersBetween(@Param("tuNgay") LocalDateTime tuNgay,
                                              @Param("denNgay") LocalDateTime denNgay);

    @Query("SELECT FUNCTION('DATE', lh.ngayTao), " +
           "       COALESCE(SUM(CASE WHEN lh.trangThai = com.sale_oto.carshop.entity.LichHen.TrangThaiLichHen.DA_HOAN_THANH THEN lh.dichVu.gia ELSE 0 END), 0), " +
           "       COUNT(lh) " +
           "FROM LichHen lh " +
           "WHERE lh.loaiLich = com.sale_oto.carshop.entity.LichHen.LoaiLichHen.DICH_VU " +
           "  AND lh.ngayTao BETWEEN :tuNgay AND :denNgay " +
           "GROUP BY FUNCTION('DATE', lh.ngayTao)")
    List<Object[]> findServiceRevenueTrendBetween(@Param("tuNgay") LocalDateTime tuNgay,
                                                  @Param("denNgay") LocalDateTime denNgay);

    @Query("SELECT lh.dichVu.id, lh.dichVu.tenDichVu, COUNT(lh), SUM(lh.dichVu.gia) " +
           "FROM LichHen lh " +
           "WHERE lh.loaiLich = com.sale_oto.carshop.entity.LichHen.LoaiLichHen.DICH_VU " +
           "  AND lh.trangThai = com.sale_oto.carshop.entity.LichHen.TrangThaiLichHen.DA_HOAN_THANH " +
           "  AND lh.ngayTao BETWEEN :tuNgay AND :denNgay " +
           "GROUP BY lh.dichVu.id, lh.dichVu.tenDichVu " +
           "ORDER BY SUM(lh.dichVu.gia) DESC")
    List<Object[]> findTopServicesBetween(@Param("tuNgay") LocalDateTime tuNgay,
                                          @Param("denNgay") LocalDateTime denNgay,
                                          Pageable pageable);
}
