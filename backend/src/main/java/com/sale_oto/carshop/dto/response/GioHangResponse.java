package com.sale_oto.carshop.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class GioHangResponse {

    private Long id;
    private Long khachHangId;
    private String tenKhachHang;
    private BigDecimal tongTien;
    private List<ChiTietGioHangResponse> chiTietGioHangs;
}
