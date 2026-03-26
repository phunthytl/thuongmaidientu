package com.sale_oto.carshop.repository;

import com.sale_oto.carshop.entity.NhanVien;
import com.sale_oto.carshop.enums.ChucVu;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NhanVienRepository extends JpaRepository<NhanVien, Long> {

    Optional<NhanVien> findByMaNhanVien(String maNhanVien);

    boolean existsByMaNhanVien(String maNhanVien);

    Page<NhanVien> findByChucVu(ChucVu chucVu, Pageable pageable);

    Page<NhanVien> findByTrangThai(Boolean trangThai, Pageable pageable);

    @Query("SELECT nv FROM NhanVien nv WHERE nv.hoTen LIKE %:keyword% OR nv.maNhanVien LIKE %:keyword% OR nv.email LIKE %:keyword%")
    Page<NhanVien> search(@Param("keyword") String keyword, Pageable pageable);
}
