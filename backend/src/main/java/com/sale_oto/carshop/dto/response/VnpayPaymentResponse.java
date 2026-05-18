package com.sale_oto.carshop.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class VnpayPaymentResponse {
    private Long donHangId;
    private String maDonHang;
    private String maGiaoDich;
    private BigDecimal soTien;
    private String paymentUrl;
}
