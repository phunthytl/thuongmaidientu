package com.sale_oto.carshop.entity;

import com.sale_oto.carshop.enums.LoaiTinNhan;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "tin_nhan")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TinNhan extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "phien_chat_id", nullable = false)
    private PhienChat phienChat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoi_gui_id", nullable = false)
    private NguoiDung nguoiGui;

    @Column(name = "noi_dung", nullable = false, columnDefinition = "TEXT")
    private String noiDung;

    @Enumerated(EnumType.STRING)
    @Column(name = "loai_tin_nhan", nullable = false)
    private LoaiTinNhan loaiTinNhan = LoaiTinNhan.VAN_BAN;

    @Column(name = "da_doc", nullable = false)
    private Boolean daDoc = false;

    @Column(name = "ngay_gui", nullable = false)
    private LocalDateTime ngayGui;

    @PrePersist
    protected void onCreateTinNhan() {
        if (ngayGui == null) {
            ngayGui = LocalDateTime.now();
        }
    }
}
