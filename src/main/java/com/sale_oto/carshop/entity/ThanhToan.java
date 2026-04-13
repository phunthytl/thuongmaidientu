package com.sale_oto.carshop.entity;

import com.sale_oto.carshop.enums.PhuongThucThanhToan;
import com.sale_oto.carshop.enums.TrangThaiThanhToan;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "thanh_toan")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ThanhToan extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "don_hang_id", nullable = false)
    private DonHang donHang;

    @Column(name = "so_tien", nullable = false, precision = 15, scale = 2)
    private BigDecimal soTien;

    @Enumerated(EnumType.STRING)
    @Column(name = "phuong_thuc", nullable = false)
    private PhuongThucThanhToan phuongThuc;

    @Column(name = "ma_giao_dich", length = 100)
    private String maGiaoDich;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false)
    private TrangThaiThanhToan trangThai = TrangThaiThanhToan.CHO_THANH_TOAN;

    @Column(name = "noi_dung")
    private String noiDung;

    @Column(name = "url_thanh_toan", columnDefinition = "TEXT")
    private String urlThanhToan;

    @Column(name = "du_lieu_phan_hoi", columnDefinition = "TEXT")
    private String duLieuPhanHoi;

    @Column(name = "ngay_thanh_toan")
    private LocalDateTime ngayThanhToan;
}
