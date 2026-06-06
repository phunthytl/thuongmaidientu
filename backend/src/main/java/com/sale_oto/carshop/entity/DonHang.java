package com.sale_oto.carshop.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sale_oto.carshop.enums.TrangThaiDonHang;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "don_hang")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DonHang extends BaseEntity {

    @Column(name = "ma_don_hang", unique = true, nullable = false, length = 30)
    private String maDonHang;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "khach_hang_id", nullable = false)
    private KhachHang khachHang;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nhan_vien_xu_ly_id")
    private NhanVien nhanVienXuLy;

    @Column(name = "tong_tien", nullable = false, precision = 15, scale = 2)
    private BigDecimal tongTien;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false)
    private TrangThaiDonHang trangThai = TrangThaiDonHang.CHO_XAC_NHAN;

    @Column(name = "ghi_chu", columnDefinition = "TEXT")
    private String ghiChu;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dia_chi_giao_hang_id")
    private DiaChiKhachHang diaChiGiaoHang;

    @Column(name = "phi_van_chuyen", precision = 15, scale = 2)
    private BigDecimal phiVanChuyen;

    @Column(name = "ma_don_hang_ghn", length = 100)
    private String maDonHangGhn;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "kho_hang_id")
    private KhoHang khoXuatHang;

    @JsonIgnore
    @OneToMany(mappedBy = "donHang", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChiTietDonHang> chiTietDonHangs;

    @JsonIgnore
    @OneToMany(mappedBy = "donHang", cascade = CascadeType.ALL)
    private List<ThanhToan> thanhToans;
}
