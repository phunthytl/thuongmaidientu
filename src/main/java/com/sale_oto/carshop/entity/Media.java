package com.sale_oto.carshop.entity;

import com.sale_oto.carshop.enums.LoaiDoiTuong;
import com.sale_oto.carshop.enums.LoaiMedia;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "media", indexes = {
        @Index(name = "idx_media_doi_tuong", columnList = "loai_doi_tuong, doi_tuong_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Media extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(name = "loai_media", nullable = false)
    private LoaiMedia loaiMedia;

    @Enumerated(EnumType.STRING)
    @Column(name = "loai_doi_tuong", nullable = false)
    private LoaiDoiTuong loaiDoiTuong;

    @Column(name = "doi_tuong_id", nullable = false)
    private Long doiTuongId;

    @Column(name = "url", nullable = false, length = 500)
    private String url;

    @Column(name = "public_id", nullable = false, length = 300)
    private String publicId;

    @Column(name = "mo_ta")
    private String moTa;

    @Column(name = "thu_tu")
    @Builder.Default
    private Integer thuTu = 0;

    @Column(name = "dung_luong")
    private Long dungLuong;

    @Column(name = "dinh_dang", length = 20)
    private String dinhDang;

    @Column(name = "chieu_rong")
    private Integer chieuRong;

    @Column(name = "chieu_cao")
    private Integer chieuCao;

    @Column(name = "thoi_luong")
    private Double thoiLuong;
}
