package com.sale_oto.carshop.dto.response;

import com.sale_oto.carshop.enums.PhuongThucThanhToan;
import com.sale_oto.carshop.enums.TrangThaiThanhToan;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class ThanhToanResponse {
    private Long id;
    private BigDecimal soTien;
    private PhuongThucThanhToan phuongThuc;
    private String maGiaoDich;
    private TrangThaiThanhToan trangThai;
    private LocalDateTime ngayThanhToan;
}
