package com.sale_oto.carshop.repository;

import com.sale_oto.carshop.entity.NguoiDung;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NguoiDungRepository extends JpaRepository<NguoiDung, Long> {

    Optional<NguoiDung> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<NguoiDung> findBySoDienThoai(String soDienThoai);
}
