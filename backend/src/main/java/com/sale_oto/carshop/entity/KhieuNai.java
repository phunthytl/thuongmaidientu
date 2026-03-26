package com.sale_oto.carshop.entity;

import com.sale_oto.carshop.enums.TrangThaiKhieuNai;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "khieu_nai")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class KhieuNai extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "khach_hang_id", nullable = false)
    private KhachHang khachHang;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "don_hang_id")
    private DonHang donHang;

    @NotBlank
    @Column(name = "tieu_de", nullable = false, length = 200)
    private String tieuDe;

    @NotBlank
    @Column(name = "noi_dung", nullable = false, columnDefinition = "TEXT")
    private String noiDung;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false)
    private TrangThaiKhieuNai trangThai = TrangThaiKhieuNai.MOI;

    @Column(name = "phan_hoi", columnDefinition = "TEXT")
    private String phanHoi;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nhan_vien_xu_ly_id")
    private NhanVien nhanVienXuLy;
}
