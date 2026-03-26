package com.sale_oto.carshop.repository;

import com.sale_oto.carshop.entity.HinhAnhOTo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HinhAnhOToRepository extends JpaRepository<HinhAnhOTo, Long> {

    List<HinhAnhOTo> findByOtoIdOrderByThuTuAsc(Long otoId);

    void deleteByOtoId(Long otoId);
}
