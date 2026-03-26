package com.sale_oto.carshop.repository;

import com.sale_oto.carshop.entity.ThanhToan;
import com.sale_oto.carshop.enums.TrangThaiThanhToan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ThanhToanRepository extends JpaRepository<ThanhToan, Long> {

    List<ThanhToan> findByDonHangId(Long donHangId);

    Optional<ThanhToan> findByMaGiaoDich(String maGiaoDich);

    List<ThanhToan> findByTrangThai(TrangThaiThanhToan trangThai);
}
