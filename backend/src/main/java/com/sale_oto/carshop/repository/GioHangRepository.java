package com.sale_oto.carshop.repository;

import com.sale_oto.carshop.entity.GioHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GioHangRepository extends JpaRepository<GioHang, Long> {

    Optional<GioHang> findByKhachHangId(Long khachHangId);
}
