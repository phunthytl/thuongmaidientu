package com.sale_oto.carshop.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "lich_hen")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class LichHen {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private LoaiLichHen loaiLich; // LAI_THU, DICH_VU

    @ManyToOne
    @JoinColumn(name = "nguoi_dung_id")
    private NguoiDung nguoiDung;

    @ManyToOne
    @JoinColumn(name = "oto_id")
    private OTo oto; // Dùng cho lái thử

    @ManyToOne
    @JoinColumn(name = "dich_vu_id")
    private DichVu dichVu; // Dùng cho đặt lịch dịch vụ

    @ManyToOne
    @JoinColumn(name = "kho_hang_id")
    private KhoHang chiNhanh;

    private String hoTen;
    private String soDienThoai;
    private String email;
    private LocalDate ngayHen;
    private LocalTime gioHen;
    
    @Column(columnDefinition = "TEXT")
    private String ghiChu;

    @Enumerated(EnumType.STRING)
    private TrangThaiLichHen trangThai;

    private LocalDateTime ngayTao;

    @PrePersist
    protected void onCreate() {
        ngayTao = LocalDateTime.now();
        if (trangThai == null) trangThai = TrangThaiLichHen.CHO_XAC_NHAN;
    }

    public enum LoaiLichHen { LAI_THU, DICH_VU }
    public enum TrangThaiLichHen { CHO_XAC_NHAN, DA_XAC_NHAN, DA_HOAN_THANH, DA_HUY }
}
