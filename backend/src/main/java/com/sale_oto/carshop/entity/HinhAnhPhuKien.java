package com.sale_oto.carshop.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "hinh_anh_phu_kien")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HinhAnhPhuKien extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "phu_kien_id", nullable = false)
    private PhuKien phuKien;

    @Column(name = "duong_dan", nullable = false)
    private String duongDan;

    @Column(name = "mo_ta")
    private String moTa;

    @Column(name = "thu_tu")
    private Integer thuTu = 0;
}
