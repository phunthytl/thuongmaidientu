package com.sale_oto.carshop.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "dia_chi_khach_hang")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DiaChiKhachHang extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "khach_hang_id", nullable = false)
    private KhachHang khachHang;

    @Column(name = "ten_nguoi_nhan", nullable = false, length = 100)
    private String tenNguoiNhan;

    @Column(name = "so_dien_thoai", nullable = false, length = 15)
    private String soDienThoai;

    @Column(name = "tinh_thanh_id", nullable = false)
    private Integer tinhThanhId;

    @Column(name = "tinh_thanh_ten", nullable = false, length = 100)
    private String tinhThanhTen;

    @Column(name = "quan_huyen_id")
    private Integer quanHuyenId;

    @Column(name = "quan_huyen_ten", length = 100)
    private String quanHuyenTen;

    @Column(name = "xa_phuong_id")
    private Integer xaPhuongId;

    @Column(name = "xa_phuong_ten", length = 100)
    private String xaPhuongTen;

    @Column(name = "dia_chi_chi_tiet", nullable = false, columnDefinition = "TEXT")
    private String diaChiChiTiet;

    // GHN API fields: hệ thống mã riêng của GHN để tính cước + tạo đơn
    @Column(name = "ghn_district_id")
    private Integer ghnDistrictId;

    @Column(name = "ghn_ward_code", length = 20)
    private String ghnWardCode;

    @Column(name = "is_default")
    private Boolean isDefault = false;
}
