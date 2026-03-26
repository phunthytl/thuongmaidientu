package com.sale_oto.carshop.dto.response;

import com.sale_oto.carshop.enums.HangThanhVien;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class KhachHangResponse {

    private Long id;
    private String hoTen;
    private String email;
    private String soDienThoai;
    private String diaChi;
    private String anhDaiDien;
    private Boolean trangThai;
    private Integer diemTichLuy;
    private HangThanhVien hangThanhVien;
    private LocalDateTime ngayTao;
}
