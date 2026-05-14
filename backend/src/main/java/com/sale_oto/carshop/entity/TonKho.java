package com.sale_oto.carshop.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ton_kho", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"phu_kien_id", "kho_hang_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TonKho extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "phu_kien_id", nullable = false)
    private PhuKien phuKien;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "kho_hang_id", nullable = false)
    private KhoHang khoHang;

    @Column(name = "so_luong", nullable = false)
    @Builder.Default
    private Integer soLuong = 0;
}
