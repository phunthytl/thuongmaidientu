package com.sale_oto.carshop.dto.request;

import com.sale_oto.carshop.enums.LoaiSanPham;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ChiTietDonHangRequest {

    @NotNull(message = "Loại sản phẩm không được để trống")
    private LoaiSanPham loaiSanPham;

    private Long otoId;

    private Long phuKienId;

    private Long dichVuId;

    @Min(value = 1, message = "Số lượng phải >= 1")
    private Integer soLuong = 1;

    private Long khoHangId;
}
