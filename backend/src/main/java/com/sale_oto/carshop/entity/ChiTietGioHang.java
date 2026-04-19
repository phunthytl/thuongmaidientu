package com.sale_oto.carshop.entity;

import com.sale_oto.carshop.enums.LoaiSanPham;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "chi_tiet_gio_hang")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChiTietGioHang extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gio_hang_id", nullable = false)
    private GioHang gioHang;

    @Enumerated(EnumType.STRING)
    @Column(name = "loai_san_pham", nullable = false)
    private LoaiSanPham loaiSanPham;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "oto_id")
    private OTo oto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "phu_kien_id")
    private PhuKien phuKien;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dich_vu_id")
    private DichVu dichVu;

    @Column(name = "so_luong", nullable = false)
    private Integer soLuong = 1;

    @Column(name = "don_gia", nullable = false, precision = 15, scale = 2)
    private BigDecimal donGia;

    @Column(name = "thanh_tien", nullable = false, precision = 15, scale = 2)
    private BigDecimal thanhTien;
}