package com.sale_oto.carshop.dto.response;

import com.sale_oto.carshop.enums.ChucVu;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class NhanVienResponse {

    private Long id;
    private String hoTen;
    private String email;
    private String soDienThoai;
    private String diaChi;
    private String anhDaiDien;
    private Boolean trangThai;
    private String maNhanVien;
    private ChucVu chucVu;
    private String phongBan;
    private BigDecimal luong;
    private LocalDate ngayVaoLam;
    private LocalDateTime ngayTao;
}
