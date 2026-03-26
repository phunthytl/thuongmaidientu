package com.sale_oto.carshop.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class PhuKienResponse {

    private Long id;
    private String tenPhuKien;
    private String loaiPhuKien;
    private String hangSanXuat;
    private BigDecimal gia;
    private Integer soLuong;
    private String moTa;
    private Boolean trangThai;
    private List<String> hinhAnhs;
    private Double diemDanhGiaTrungBinh;
    private LocalDateTime ngayTao;
    private LocalDateTime ngayCapNhat;
}
