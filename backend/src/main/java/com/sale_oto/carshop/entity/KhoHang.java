package com.sale_oto.carshop.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "kho_hang")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class KhoHang extends BaseEntity {

    @Column(name = "ten_kho", nullable = false, length = 100)
    private String tenKho;

    @Column(name = "nguoi_lien_he", length = 100)
    private String nguoiLienHe;

    @Column(name = "so_dien_thoai", nullable = false, length = 15)
    private String soDienThoai;

    // Địa chỉ 34 tỉnh thành mới (không còn cấp huyện)
    @Column(name = "tinh_thanh_id", nullable = false)
    private Integer tinhThanhId;

    @Column(name = "tinh_thanh_ten", nullable = false, length = 100)
    private String tinhThanhTen;

    @Column(name = "xa_phuong_id")
    private Integer xaPhuongId;

    @Column(name = "xa_phuong_ten", length = 100)
    private String xaPhuongTen;

    @Column(name = "dia_chi_chi_tiet", nullable = false, columnDefinition = "TEXT")
    private String diaChiChiTiet;

    @Column(name = "trang_thai", nullable = false)
    private Boolean trangThai = true;

    // Dùng khi cần override shop_id riêng trên GHN
    @Column(name = "ghn_shop_id", length = 50)
    private String ghnShopId;

    // ID GHN Province để tính cước (GHN vẫn dùng province_id của họ)
    @Column(name = "ghn_province_id")
    private Integer ghnProvinceId;

    // ID GHN District để tính cước (GHN vẫn cần district khi gọi API tính phí)
    @Column(name = "ghn_district_id")
    private Integer ghnDistrictId;

    @Column(name = "ghn_ward_code", length = 20)
    private String ghnWardCode;
}
