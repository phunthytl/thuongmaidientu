package com.sale_oto.carshop.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class DichVuResponse {

    private Long id;
    private String tenDichVu;
    private String moTa;
    private BigDecimal gia;
    private String thoiGianUocTinh;
    private Boolean trangThai;
    private Double diemDanhGiaTrungBinh;
    private LocalDateTime ngayTao;
    private LocalDateTime ngayCapNhat;
}
