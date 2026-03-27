package com.sale_oto.carshop.entity;

import com.sale_oto.carshop.enums.TrangThaiOTo;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "oto")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OTo extends BaseEntity {

    @NotBlank
    @Column(name = "ten_xe", nullable = false, length = 200)
    private String tenXe;

    @NotBlank
    @Column(name = "hang_xe", nullable = false, length = 100)
    private String hangXe;

    @Column(name = "dong_xe", length = 100)
    private String dongXe;

    @Column(name = "nam_san_xuat")
    private Integer namSanXuat;

    @Column(name = "mau_sac", length = 50)
    private String mauSac;

    @Column(name = "dong_co", length = 100)
    private String dongCo;

    @Column(name = "hop_so", length = 50)
    private String hopSo;

    @Column(name = "nhien_lieu", length = 50)
    private String nhienLieu;

    @Column(name = "so_km")
    private Integer soKm;

    @NotNull
    @Column(name = "gia", nullable = false, precision = 15, scale = 2)
    private BigDecimal gia;

    @Column(name = "so_luong")
    private Integer soLuong = 0;

    @Column(name = "mo_ta", columnDefinition = "TEXT")
    private String moTa;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai")
    private TrangThaiOTo trangThai = TrangThaiOTo.DANG_BAN;

    @OneToMany(mappedBy = "oto")
    private List<DanhGia> danhGias;
}
