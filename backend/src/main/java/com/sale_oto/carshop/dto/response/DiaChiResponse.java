package com.sale_oto.carshop.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DiaChiResponse {
    private Long id;
    private String tenNguoiNhan;
    private String soDienThoai;
    private Integer tinhThanhId;
    private String tinhThanhTen;
    private Integer quanHuyenId;
    private String quanHuyenTen;
    private Integer xaPhuongId;
    private String xaPhuongTen;
    private String diaChiChiTiet;
    private Integer ghnDistrictId;
    private String ghnWardCode;
    private Boolean isDefault;
}
