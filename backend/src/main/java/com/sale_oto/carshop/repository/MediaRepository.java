package com.sale_oto.carshop.repository;

import com.sale_oto.carshop.entity.Media;
import com.sale_oto.carshop.enums.LoaiDoiTuong;
import com.sale_oto.carshop.enums.LoaiMedia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MediaRepository extends JpaRepository<Media, Long> {

    List<Media> findByLoaiDoiTuongAndDoiTuongIdOrderByThuTuAsc(LoaiDoiTuong loaiDoiTuong, Long doiTuongId);

    List<Media> findByLoaiDoiTuongAndDoiTuongIdAndLoaiMediaOrderByThuTuAsc(
            LoaiDoiTuong loaiDoiTuong, Long doiTuongId, LoaiMedia loaiMedia);

    void deleteByLoaiDoiTuongAndDoiTuongId(LoaiDoiTuong loaiDoiTuong, Long doiTuongId);

    long countByLoaiDoiTuongAndDoiTuongId(LoaiDoiTuong loaiDoiTuong, Long doiTuongId);
}
