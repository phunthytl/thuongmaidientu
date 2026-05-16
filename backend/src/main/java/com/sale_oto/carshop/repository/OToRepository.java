package com.sale_oto.carshop.repository;

import com.sale_oto.carshop.entity.OTo;
import com.sale_oto.carshop.enums.TrangThaiOTo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface OToRepository extends JpaRepository<OTo, Long> {

    Page<OTo> findByTrangThai(TrangThaiOTo trangThai, Pageable pageable);

    Page<OTo> findByHangXe(String hangXe, Pageable pageable);

    @Query("SELECT o FROM OTo o WHERE o.gia BETWEEN :giaMin AND :giaMax AND o.trangThai = :trangThai")
    Page<OTo> findByGiaBetweenAndTrangThai(
            @Param("giaMin") BigDecimal giaMin,
            @Param("giaMax") BigDecimal giaMax,
            @Param("trangThai") TrangThaiOTo trangThai,
            Pageable pageable);

    @Query("SELECT o FROM OTo o WHERE " +
            "(o.tenXe LIKE %:keyword% OR o.hangXe LIKE %:keyword% OR o.dongXe LIKE %:keyword%) " +
            "AND o.trangThai = :trangThai")
    Page<OTo> search(@Param("keyword") String keyword, @Param("trangThai") TrangThaiOTo trangThai, Pageable pageable);

    @Query("SELECT o FROM OTo o WHERE " +
            "(:hangXe IS NULL OR :hangXe = '' OR o.hangXe = :hangXe) AND " +
            "(:giaMin IS NULL OR o.gia >= :giaMin) AND " +
            "(:giaMax IS NULL OR o.gia <= :giaMax) AND " +
            "(:keyword IS NULL OR :keyword = '' OR LOWER(o.tenXe) LIKE LOWER(:keyword) OR LOWER(o.hangXe) LIKE LOWER(:keyword) OR LOWER(o.dongXe) LIKE LOWER(:keyword)) AND " +
            "o.trangThai = :trangThai")
    Page<OTo> filter(
            @Param("hangXe") String hangXe,
            @Param("giaMin") BigDecimal giaMin,
            @Param("giaMax") BigDecimal giaMax,
            @Param("keyword") String keyword,
            @Param("trangThai") TrangThaiOTo trangThai,
            Pageable pageable);

    @Query("SELECT DISTINCT o.hangXe FROM OTo o ORDER BY o.hangXe")
    List<String> findAllHangXe();

    long countByTrangThai(TrangThaiOTo trangThai);
}
