package com.sale_oto.carshop.repository;

import com.sale_oto.carshop.entity.DiaChiKhachHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiaChiKhachHangRepository extends JpaRepository<DiaChiKhachHang, Long> {
    List<DiaChiKhachHang> findByKhachHangId(Long khachHangId);
}
