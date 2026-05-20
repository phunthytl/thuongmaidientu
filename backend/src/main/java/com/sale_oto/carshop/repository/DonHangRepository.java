package com.sale_oto.carshop.repository;

import com.sale_oto.carshop.entity.DonHang;
import com.sale_oto.carshop.enums.TrangThaiDonHang;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DonHangRepository extends JpaRepository<DonHang, Long> {

    Optional<DonHang> findByMaDonHang(String maDonHang);
    
    Optional<DonHang> findByMaDonHangGhn(String maDonHangGhn);

    Page<DonHang> findByKhachHangId(Long khachHangId, Pageable pageable);

    Page<DonHang> findByTrangThai(TrangThaiDonHang trangThai, Pageable pageable);

    Page<DonHang> findByNhanVienXuLyId(Long nhanVienId, Pageable pageable);

    @Query("SELECT dh FROM DonHang dh WHERE dh.ngayTao BETWEEN :tuNgay AND :denNgay")
    List<DonHang> findByNgayTaoBetween(@Param("tuNgay") LocalDateTime tuNgay, @Param("denNgay") LocalDateTime denNgay);

    long countByTrangThai(TrangThaiDonHang trangThai);

    @Query("SELECT dh FROM DonHang dh WHERE dh.maDonHang LIKE %:keyword% OR dh.khachHang.hoTen LIKE %:keyword%")
    Page<DonHang> search(@Param("keyword") String keyword, Pageable pageable);

    // ========== DASHBOARD ANALYTICS ==========

    @Query("SELECT COALESCE(SUM(dh.tongTien), 0) FROM DonHang dh " +
           "WHERE dh.trangThai = com.sale_oto.carshop.enums.TrangThaiDonHang.HOAN_THANH " +
           "AND dh.ngayTao BETWEEN :tuNgay AND :denNgay")
    java.math.BigDecimal sumRevenueBetween(@Param("tuNgay") LocalDateTime tuNgay,
                                           @Param("denNgay") LocalDateTime denNgay);

    @Query("SELECT COUNT(dh) FROM DonHang dh WHERE dh.ngayTao BETWEEN :tuNgay AND :denNgay")
    long countBetween(@Param("tuNgay") LocalDateTime tuNgay, @Param("denNgay") LocalDateTime denNgay);

    @Query("SELECT COUNT(DISTINCT dh.khachHang.id) FROM DonHang dh " +
           "WHERE dh.ngayTao BETWEEN :tuNgay AND :denNgay")
    long countDistinctCustomersBetween(@Param("tuNgay") LocalDateTime tuNgay,
                                       @Param("denNgay") LocalDateTime denNgay);

    @Query("SELECT FUNCTION('DATE', dh.ngayTao), " +
           "       COALESCE(SUM(CASE WHEN dh.trangThai = com.sale_oto.carshop.enums.TrangThaiDonHang.HOAN_THANH THEN dh.tongTien ELSE 0 END), 0), " +
           "       COUNT(dh) " +
           "FROM DonHang dh " +
           "WHERE dh.ngayTao BETWEEN :tuNgay AND :denNgay " +
           "GROUP BY FUNCTION('DATE', dh.ngayTao) " +
           "ORDER BY FUNCTION('DATE', dh.ngayTao) ASC")
    List<Object[]> findRevenueTrendBetween(@Param("tuNgay") LocalDateTime tuNgay,
                                           @Param("denNgay") LocalDateTime denNgay);

    @Query("SELECT dh.trangThai, COUNT(dh) FROM DonHang dh " +
           "WHERE dh.ngayTao BETWEEN :tuNgay AND :denNgay " +
           "GROUP BY dh.trangThai")
    List<Object[]> findOrderStatusStatsBetween(@Param("tuNgay") LocalDateTime tuNgay,
                                               @Param("denNgay") LocalDateTime denNgay);

    List<DonHang> findTop10ByOrderByNgayTaoDesc();
}
