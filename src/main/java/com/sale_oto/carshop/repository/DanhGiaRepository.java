package com.sale_oto.carshop.repository;

import com.sale_oto.carshop.entity.DanhGia;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface DanhGiaRepository extends JpaRepository<DanhGia, Long> {

    Page<DanhGia> findByOtoId(Long otoId, Pageable pageable);

    Page<DanhGia> findByPhuKienId(Long phuKienId, Pageable pageable);

    Page<DanhGia> findByDichVuId(Long dichVuId, Pageable pageable);

    Page<DanhGia> findByKhachHangId(Long khachHangId, Pageable pageable);

    @Query("SELECT AVG(dg.diemDanhGia) FROM DanhGia dg WHERE dg.oto.id = :otoId AND dg.trangThai = true")
    Double getAverageRatingByOtoId(@Param("otoId") Long otoId);

    @Query("SELECT AVG(dg.diemDanhGia) FROM DanhGia dg WHERE dg.phuKien.id = :phuKienId AND dg.trangThai = true")
    Double getAverageRatingByPhuKienId(@Param("phuKienId") Long phuKienId);

    @Query("SELECT AVG(dg.diemDanhGia) FROM DanhGia dg WHERE dg.dichVu.id = :dichVuId AND dg.trangThai = true")
    Double getAverageRatingByDichVuId(@Param("dichVuId") Long dichVuId);
}
