package com.sale_oto.carshop.entity;

import com.sale_oto.carshop.enums.ChucVu;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "nhan_vien")
@DiscriminatorValue("NHAN_VIEN")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NhanVien extends NguoiDung {

    @Column(name = "ma_nhan_vien", unique = true, nullable = false, length = 20)
    private String maNhanVien;

    @Enumerated(EnumType.STRING)
    @Column(name = "chuc_vu")
    private ChucVu chucVu;

    @Column(name = "phong_ban", length = 100)
    private String phongBan;

    @Column(name = "luong", precision = 15, scale = 2)
    private BigDecimal luong;

    @Column(name = "ngay_vao_lam")
    private LocalDate ngayVaoLam;

    @OneToMany(mappedBy = "nhanVienXuLy")
    private List<DonHang> donHangXuLy;

    @OneToMany(mappedBy = "nhanVien")
    private List<PhienChat> phienChats;

    @OneToMany(mappedBy = "nhanVienXuLy")
    private List<KhieuNai> khieuNaiXuLy;
}
