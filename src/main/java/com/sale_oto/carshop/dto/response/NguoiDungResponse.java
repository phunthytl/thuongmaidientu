package com.sale_oto.carshop.dto.response;

import com.sale_oto.carshop.enums.VaiTro;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class NguoiDungResponse {

    private Long id;
    private String hoTen;
    private String email;
    private String soDienThoai;
    private String diaChi;
    private String anhDaiDien;
    private VaiTro vaiTro;
    private Boolean trangThai;
    private LocalDateTime ngayTao;
}
