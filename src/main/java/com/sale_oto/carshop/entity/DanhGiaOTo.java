package com.sale_oto.carshop.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.*;

/**
 * Entity đánh giá ô tô dành cho NguoiDung (user-facing).
 * Khác với DanhGia (admin/KhachHang), entity này:
 *  - Chỉ áp dụng cho sản phẩm OTo
 *  - Liên kết trực tiếp với NguoiDung (cha của KhachHang)
 *  - Giới hạn 1 user chỉ đánh giá 1 xe 1 lần
 */
@Entity
@Table(
    name = "danh_gia_oto",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uq_nguoidung_oto_review",
            columnNames = {"nguoi_dung_id", "oto_id"}
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DanhGiaOTo extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoi_dung_id", nullable = false)
    private NguoiDung nguoiDung;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "oto_id", nullable = false)
    private OTo oto;

    @Min(1)
    @Max(5)
    @Column(name = "diem_danh_gia", nullable = false)
    private Integer diemDanhGia;

    @Column(name = "binh_luan", columnDefinition = "TEXT")
    private String binhLuan;
}
