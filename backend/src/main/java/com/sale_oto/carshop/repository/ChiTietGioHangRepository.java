package com.sale_oto.carshop.repository;

import com.sale_oto.carshop.entity.ChiTietGioHang;
import com.sale_oto.carshop.enums.LoaiSanPham;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChiTietGioHangRepository extends JpaRepository<ChiTietGioHang, Long> {

    List<ChiTietGioHang> findByGioHangId(Long gioHangId);

    Optional<ChiTietGioHang> findFirstByGioHangIdAndLoaiSanPhamAndPhuKienId(
            Long gioHangId,
            LoaiSanPham loaiSanPham,
            Long phuKienId);

    Optional<ChiTietGioHang> findFirstByGioHangIdAndLoaiSanPhamAndDichVuId(
            Long gioHangId,
            LoaiSanPham loaiSanPham,
            Long dichVuId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(value = """
            DELETE ct
            FROM chi_tiet_gio_hang ct
            LEFT JOIN phu_kien pk ON pk.id = ct.phu_kien_id
            WHERE ct.gio_hang_id = :gioHangId
              AND ct.loai_san_pham = 'PHU_KIEN'
              AND ct.phu_kien_id IS NOT NULL
              AND pk.id IS NULL
            """, nativeQuery = true)
    int deleteOrphanPhuKienItems(@Param("gioHangId") Long gioHangId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(value = """
            DELETE ct
            FROM chi_tiet_gio_hang ct
            LEFT JOIN dich_vu dv ON dv.id = ct.dich_vu_id
            WHERE ct.gio_hang_id = :gioHangId
              AND ct.loai_san_pham = 'DICH_VU'
              AND ct.dich_vu_id IS NOT NULL
              AND dv.id IS NULL
            """, nativeQuery = true)
    int deleteOrphanDichVuItems(@Param("gioHangId") Long gioHangId);
}
