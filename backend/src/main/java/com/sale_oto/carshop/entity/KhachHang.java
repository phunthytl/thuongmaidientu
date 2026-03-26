package com.sale_oto.carshop.entity;

import com.sale_oto.carshop.enums.HangThanhVien;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "khach_hang")
@DiscriminatorValue("KHACH_HANG")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class KhachHang extends NguoiDung {

    @Column(name = "diem_tich_luy")
    private Integer diemTichLuy = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "hang_thanh_vien")
    private HangThanhVien hangThanhVien = HangThanhVien.DONG;

    @OneToMany(mappedBy = "khachHang")
    private List<DonHang> donHangs;

    @OneToMany(mappedBy = "khachHang")
    private List<DanhGia> danhGias;

    @OneToMany(mappedBy = "khachHang")
    private List<KhieuNai> khieuNais;

    @OneToMany(mappedBy = "khachHang")
    private List<PhienChat> phienChats;
}
