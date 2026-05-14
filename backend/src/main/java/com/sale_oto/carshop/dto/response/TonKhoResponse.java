package com.sale_oto.carshop.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TonKhoResponse {
    private Long id;
    private Long khoHangId;
    private String tenKho;
    private String diaChiChiTiet;
    private String tinhThanhTen;
    private Boolean khoTrangThai;
    private Long phuKienId;
    private Integer soLuong;
}
