package com.sale_oto.carshop.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class DanhGiaOToResponse {

    private Long id;

    // Thông tin người đánh giá
    private Long nguoiDungId;
    private String tenNguoiDung;

    // Thông tin ô tô
    private Long otoId;
    private String tenXe;

    // Nội dung đánh giá
    private Integer diemDanhGia;
    private String binhLuan;

    // Thời gian
    private LocalDateTime ngayTao;
}
