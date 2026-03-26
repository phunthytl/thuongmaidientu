package com.sale_oto.carshop.dto.request;

import com.sale_oto.carshop.enums.LoaiSanPham;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DanhGiaRequest {

    @NotNull(message = "Khách hàng không được để trống")
    private Long khachHangId;

    @NotNull(message = "Loại sản phẩm không được để trống")
    private LoaiSanPham loaiSanPham;

    private Long otoId;

    private Long phuKienId;

    private Long dichVuId;

    @NotNull(message = "Điểm đánh giá không được để trống")
    @Min(1)
    @Max(5)
    private Integer diemDanhGia;

    private String noiDung;
}
