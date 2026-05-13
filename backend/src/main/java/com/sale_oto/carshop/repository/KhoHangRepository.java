package com.sale_oto.carshop.repository;

import com.sale_oto.carshop.entity.KhoHang;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface KhoHangRepository extends JpaRepository<KhoHang, Long> {

    List<KhoHang> findByTrangThai(Boolean trangThai);
}
