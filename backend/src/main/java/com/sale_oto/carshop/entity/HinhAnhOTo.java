package com.sale_oto.carshop.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "hinh_anh_oto")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HinhAnhOTo extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "oto_id", nullable = false)
    private OTo oto;

    @Column(name = "duong_dan", nullable = false)
    private String duongDan;

    @Column(name = "mo_ta")
    private String moTa;

    @Column(name = "thu_tu")
    private Integer thuTu = 0;
}
