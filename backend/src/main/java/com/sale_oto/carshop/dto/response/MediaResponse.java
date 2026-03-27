package com.sale_oto.carshop.dto.response;

import com.sale_oto.carshop.enums.LoaiDoiTuong;
import com.sale_oto.carshop.enums.LoaiMedia;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class MediaResponse {

    private Long id;
    private LoaiMedia loaiMedia;
    private LoaiDoiTuong loaiDoiTuong;
    private Long doiTuongId;
    private String url;
    private String moTa;
    private Integer thuTu;
    private Long dungLuong;
    private String dinhDang;
    private Integer chieuRong;
    private Integer chieuCao;
    private Double thoiLuong;
    private LocalDateTime ngayTao;
}
