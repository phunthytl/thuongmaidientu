package com.sale_oto.carshop.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KhoHangResponse {
    private Long id;
    private String tenKho;
    private String nguoiLienHe;
    private String soDienThoai;
    private Integer tinhThanhId;
    private String phuongXaCode;
    private String tinhThanhName;
    private String quanHuyenName;
    private String phuongXaName;
    private String diaChiChiTiet;
    private Boolean trangThai;
    private String ghnShopId;
    private LocalDateTime ngayTao;
}
