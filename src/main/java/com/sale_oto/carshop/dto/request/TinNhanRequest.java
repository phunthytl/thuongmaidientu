package com.sale_oto.carshop.dto.request;

import com.sale_oto.carshop.enums.LoaiTinNhan;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TinNhanRequest {

    @NotNull(message = "Phiên chat không được để trống")
    private Long phienChatId;

    @NotNull(message = "Người gửi không được để trống")
    private Long nguoiGuiId;

    @NotBlank(message = "Nội dung không được để trống")
    private String noiDung;

    private LoaiTinNhan loaiTinNhan = LoaiTinNhan.VAN_BAN;
}
