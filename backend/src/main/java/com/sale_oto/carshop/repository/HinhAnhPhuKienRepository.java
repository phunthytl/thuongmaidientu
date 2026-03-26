package com.sale_oto.carshop.repository;

import com.sale_oto.carshop.entity.HinhAnhPhuKien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HinhAnhPhuKienRepository extends JpaRepository<HinhAnhPhuKien, Long> {

    List<HinhAnhPhuKien> findByPhuKienIdOrderByThuTuAsc(Long phuKienId);

    void deleteByPhuKienId(Long phuKienId);
}
