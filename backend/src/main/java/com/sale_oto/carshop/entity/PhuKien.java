package com.sale_oto.carshop.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "phu_kien")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PhuKien extends BaseEntity {

    @NotBlank
    @Column(name = "ten_phu_kien", nullable = false, length = 200)
    private String tenPhuKien;

    @Column(name = "loai_phu_kien", length = 100)
    private String loaiPhuKien;

    @Column(name = "hang_san_xuat", length = 100)
    private String hangSanXuat;

    @NotNull
    @Column(name = "gia", nullable = false, precision = 15, scale = 2)
    private BigDecimal gia;

    @Column(name = "so_luong")
    private Integer soLuong = 0;

    @Column(name = "mo_ta", columnDefinition = "TEXT")
    private String moTa;

    @Column(name = "trang_thai", nullable = false)
    private Boolean trangThai = true;

    @OneToMany(mappedBy = "phuKien", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HinhAnhPhuKien> hinhAnhs;

    @OneToMany(mappedBy = "phuKien")
    private List<DanhGia> danhGias;
}
