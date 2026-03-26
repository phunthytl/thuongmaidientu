package com.sale_oto.carshop.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "dich_vu")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DichVu extends BaseEntity {

    @NotBlank
    @Column(name = "ten_dich_vu", nullable = false, length = 200)
    private String tenDichVu;

    @Column(name = "mo_ta", columnDefinition = "TEXT")
    private String moTa;

    @NotNull
    @Column(name = "gia", nullable = false, precision = 15, scale = 2)
    private BigDecimal gia;

    @Column(name = "thoi_gian_uoc_tinh", length = 50)
    private String thoiGianUocTinh;

    @Column(name = "trang_thai", nullable = false)
    private Boolean trangThai = true;

    @OneToMany(mappedBy = "dichVu")
    private List<DanhGia> danhGias;
}
