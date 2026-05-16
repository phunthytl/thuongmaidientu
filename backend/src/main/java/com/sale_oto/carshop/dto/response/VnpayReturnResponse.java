package com.sale_oto.carshop.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VnpayReturnResponse {
    private boolean success;
    private String message;
    private Long donHangId;
    private String maDonHang;
    private String maGiaoDich;
    private String responseCode;
    private String transactionStatus;
}
