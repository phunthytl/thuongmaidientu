package com.sale_oto.carshop.repository;

import com.sale_oto.carshop.entity.ChiTietDonHang;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ChiTietDonHangRepository extends JpaRepository<ChiTietDonHang, Long> {

    List<ChiTietDonHang> findByDonHangId(Long donHangId);

    void deleteByDonHangId(Long donHangId);

    // ========== DASHBOARD: TOP SELLING PRODUCTS ==========
    // Chỉ tính chi tiết từ đơn HOAN_THANH trong khoảng thời gian
    @Query("SELECT ct.loaiSanPham, " +
           "       CASE ct.loaiSanPham " +
           "            WHEN com.sale_oto.carshop.enums.LoaiSanPham.OTO THEN ct.oto.id " +
           "            WHEN com.sale_oto.carshop.enums.LoaiSanPham.PHU_KIEN THEN ct.phuKien.id " +
           "            WHEN com.sale_oto.carshop.enums.LoaiSanPham.DICH_VU THEN ct.dichVu.id " +
           "       END, " +
           "       CASE ct.loaiSanPham " +
           "            WHEN com.sale_oto.carshop.enums.LoaiSanPham.OTO THEN ct.oto.tenXe " +
           "            WHEN com.sale_oto.carshop.enums.LoaiSanPham.PHU_KIEN THEN ct.phuKien.tenPhuKien " +
           "            WHEN com.sale_oto.carshop.enums.LoaiSanPham.DICH_VU THEN ct.dichVu.tenDichVu " +
           "       END, " +
           "       SUM(ct.soLuong), " +
           "       SUM(ct.thanhTien) " +
           "FROM ChiTietDonHang ct " +
           "WHERE ct.donHang.trangThai = com.sale_oto.carshop.enums.TrangThaiDonHang.HOAN_THANH " +
           "  AND ct.donHang.ngayTao BETWEEN :tuNgay AND :denNgay " +
           "GROUP BY ct.loaiSanPham, " +
           "         ct.oto.id, ct.oto.tenXe, " +
           "         ct.phuKien.id, ct.phuKien.tenPhuKien, " +
           "         ct.dichVu.id, ct.dichVu.tenDichVu " +
           "ORDER BY SUM(ct.thanhTien) DESC")
    List<Object[]> findTopProductsBetween(@Param("tuNgay") LocalDateTime tuNgay,
                                          @Param("denNgay") LocalDateTime denNgay,
                                          Pageable pageable);
}
