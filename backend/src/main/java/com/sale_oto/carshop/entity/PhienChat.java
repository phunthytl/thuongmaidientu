package com.sale_oto.carshop.entity;

import com.sale_oto.carshop.enums.TrangThaiPhienChat;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "phien_chat")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PhienChat extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "khach_hang_id", nullable = false)
    private KhachHang khachHang;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nhan_vien_id")
    private NhanVien nhanVien;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false)
    private TrangThaiPhienChat trangThai = TrangThaiPhienChat.DANG_CHO;

    @Column(name = "ngay_ket_thuc")
    private LocalDateTime ngayKetThuc;

    @OneToMany(mappedBy = "phienChat", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TinNhan> tinNhans;
}
