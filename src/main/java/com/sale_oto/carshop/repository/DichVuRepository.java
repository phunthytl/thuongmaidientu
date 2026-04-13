package com.sale_oto.carshop.repository;

import com.sale_oto.carshop.entity.DichVu;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface DichVuRepository extends JpaRepository<DichVu, Long> {

    Page<DichVu> findByTrangThai(Boolean trangThai, Pageable pageable);

    @Query("SELECT dv FROM DichVu dv WHERE dv.tenDichVu LIKE %:keyword% OR dv.moTa LIKE %:keyword%")
    Page<DichVu> search(@Param("keyword") String keyword, Pageable pageable);
}
