package com.sale_oto.carshop.dto.request;

import com.sale_oto.carshop.enums.ChucVu;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class NhanVienRequest {

    @NotBlank(message = "Họ tên không được để trống")
    @Size(max = 100)
    private String hoTen;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 6)
    private String matKhau;

    private String soDienThoai;

    private String diaChi;

    @NotBlank(message = "Mã nhân viên không được để trống")
    private String maNhanVien;

    private ChucVu chucVu;

    private String phongBan;

    private BigDecimal luong;

    private LocalDate ngayVaoLam;
}
