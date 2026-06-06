package com.sale_oto.carshop.repository;

import com.sale_oto.carshop.entity.KhieuNai;
import com.sale_oto.carshop.enums.TrangThaiKhieuNai;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;

@Repository
public interface KhieuNaiRepository extends JpaRepository<KhieuNai, Long> {

    Page<KhieuNai> findByKhachHangId(Long khachHangId, Pageable pageable);

    Page<KhieuNai> findByTrangThai(TrangThaiKhieuNai trangThai, Pageable pageable);

    Page<KhieuNai> findByNhanVienXuLyId(Long nhanVienId, Pageable pageable);

    long countByTrangThai(TrangThaiKhieuNai trangThai);

    boolean existsByDonHangIdAndTrangThaiIn(Long donHangId, Collection<TrangThaiKhieuNai> trangThais);
}
