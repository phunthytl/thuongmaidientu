package com.sale_oto.carshop.repository;

import com.sale_oto.carshop.entity.ChiTietDonHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChiTietDonHangRepository extends JpaRepository<ChiTietDonHang, Long> {

    List<ChiTietDonHang> findByDonHangId(Long donHangId);

    void deleteByDonHangId(Long donHangId);
}
