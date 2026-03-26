package com.sale_oto.carshop.repository;

import com.sale_oto.carshop.entity.PhuKien;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhuKienRepository extends JpaRepository<PhuKien, Long> {

    Page<PhuKien> findByTrangThai(Boolean trangThai, Pageable pageable);

    Page<PhuKien> findByLoaiPhuKien(String loaiPhuKien, Pageable pageable);

    @Query("SELECT pk FROM PhuKien pk WHERE pk.tenPhuKien LIKE %:keyword% OR pk.loaiPhuKien LIKE %:keyword% OR pk.hangSanXuat LIKE %:keyword%")
    Page<PhuKien> search(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT DISTINCT pk.loaiPhuKien FROM PhuKien pk WHERE pk.loaiPhuKien IS NOT NULL ORDER BY pk.loaiPhuKien")
    List<String> findAllLoaiPhuKien();
}
