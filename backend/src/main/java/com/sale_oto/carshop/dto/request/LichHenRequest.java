package com.sale_oto.carshop.dto.request;

import com.sale_oto.carshop.entity.LichHen;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class LichHenRequest {
    @NotNull(message = "Loại lịch hẹn không được để trống")
    private LichHen.LoaiLichHen loaiLich;

    private Long otoId;
    private Long dichVuId;

    @NotNull(message = "Chi nhánh không được để trống")
    private Long chiNhanhId;

    @NotBlank(message = "Họ tên không được để trống")
    private String hoTen;

    @NotBlank(message = "Số điện thoại không được để trống")
    private String soDienThoai;

    private String email;

    @NotNull(message = "Ngày hẹn không được để trống")
    private LocalDate ngayHen;

    @NotNull(message = "Giờ hẹn không được để trống")
    private LocalTime gioHen;

    private String ghiChu;
}
