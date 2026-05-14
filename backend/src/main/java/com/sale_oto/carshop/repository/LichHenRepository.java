package com.sale_oto.carshop.repository;

import com.sale_oto.carshop.entity.LichHen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LichHenRepository extends JpaRepository<LichHen, Long> {
    List<LichHen> findByNguoiDungId(Long nguoiDungId);
    List<LichHen> findByLoaiLich(LichHen.LoaiLichHen loaiLich);
}
