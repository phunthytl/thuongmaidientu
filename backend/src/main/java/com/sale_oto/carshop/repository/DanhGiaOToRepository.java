package com.sale_oto.carshop.repository;

import com.sale_oto.carshop.entity.DanhGiaOTo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DanhGiaOToRepository extends JpaRepository<DanhGiaOTo, Long> {

    // Lấy danh sách đánh giá theo ô tô, sắp xếp mới nhất trước
    Page<DanhGiaOTo> findByOtoIdOrderByNgayTaoDesc(Long otoId, Pageable pageable);

    // Lấy danh sách đánh giá theo user, sắp xếp mới nhất trước
    Page<DanhGiaOTo> findByNguoiDungIdOrderByNgayTaoDesc(Long nguoiDungId, Pageable pageable);

    // Kiểm tra user đã đánh giá xe này chưa
    boolean existsByNguoiDungIdAndOtoId(Long nguoiDungId, Long otoId);

    // Tìm đánh giá cụ thể của user cho một xe
    Optional<DanhGiaOTo> findByNguoiDungIdAndOtoId(Long nguoiDungId, Long otoId);

    // Tính điểm trung bình của một xe
    @Query("SELECT AVG(d.diemDanhGia) FROM DanhGiaOTo d WHERE d.oto.id = :otoId")
    Double getAverageRatingByOtoId(@Param("otoId") Long otoId);

    // Đếm tổng số đánh giá của một xe
    long countByOtoId(Long otoId);
}
