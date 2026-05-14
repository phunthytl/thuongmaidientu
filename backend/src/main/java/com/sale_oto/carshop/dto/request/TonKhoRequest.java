package com.sale_oto.carshop.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TonKhoRequest {

    @NotNull(message = "Phụ kiện không được để trống")
    private Long phuKienId;

    @NotNull(message = "Kho hàng không được để trống")
    private Long khoHangId;

    @NotNull(message = "Số lượng không được để trống")
    @Min(value = 0, message = "Số lượng phải >= 0")
    private Integer soLuong;
}
