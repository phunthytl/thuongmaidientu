package com.sale_oto.carshop.repository;

import com.sale_oto.carshop.entity.TonKho;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TonKhoRepository extends JpaRepository<TonKho, Long> {

    List<TonKho> findByKhoHangId(Long khoHangId);

    List<TonKho> findByPhuKienId(Long phuKienId);

    Optional<TonKho> findByPhuKienIdAndKhoHangId(Long phuKienId, Long khoHangId);
}
