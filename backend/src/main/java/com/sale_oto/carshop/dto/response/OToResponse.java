package com.sale_oto.carshop.dto.response;

import com.sale_oto.carshop.enums.TrangThaiOTo;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OToResponse {

    private Long id;
    private String tenXe;
    private String hangXe;
    private String dongXe;
    private Integer namSanXuat;
    private String mauSac;
    private String dongCo;
    private String hopSo;
    private String nhienLieu;
    private Integer soKm;
    private BigDecimal gia;
    private String moTa;
    private TrangThaiOTo trangThai;
    private List<String> hinhAnhs;
    private Double diemDanhGiaTrungBinh;
    private LocalDateTime ngayTao;
    private LocalDateTime ngayCapNhat;
}
