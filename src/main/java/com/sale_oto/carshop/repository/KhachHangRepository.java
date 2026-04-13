package com.sale_oto.carshop.repository;

import com.sale_oto.carshop.entity.KhachHang;
import com.sale_oto.carshop.enums.HangThanhVien;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface KhachHangRepository extends JpaRepository<KhachHang, Long> {

    Optional<KhachHang> findByEmail(String email);

    Page<KhachHang> findByTrangThai(Boolean trangThai, Pageable pageable);

    Page<KhachHang> findByHangThanhVien(HangThanhVien hangThanhVien, Pageable pageable);

    @Query("SELECT kh FROM KhachHang kh WHERE kh.hoTen LIKE %:keyword% OR kh.email LIKE %:keyword% OR kh.soDienThoai LIKE %:keyword%")
    Page<KhachHang> search(@Param("keyword") String keyword, Pageable pageable);
}
