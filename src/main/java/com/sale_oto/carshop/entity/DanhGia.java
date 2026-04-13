package com.sale_oto.carshop.entity;

import com.sale_oto.carshop.enums.LoaiSanPham;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.*;

@Entity
@Table(name = "danh_gia")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DanhGia extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "khach_hang_id", nullable = false)
    private KhachHang khachHang;

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

    @Min(1)
    @Max(5)
    @Column(name = "diem_danh_gia", nullable = false)
    private Integer diemDanhGia;

    @Column(name = "noi_dung", columnDefinition = "TEXT")
    private String noiDung;

    @Column(name = "trang_thai", nullable = false)
    private Boolean trangThai = true;
}
