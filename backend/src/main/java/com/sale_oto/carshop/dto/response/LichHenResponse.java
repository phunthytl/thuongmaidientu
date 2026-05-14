package com.sale_oto.carshop.dto.response;

import com.sale_oto.carshop.entity.LichHen;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Data
@Builder
public class LichHenResponse {
    private Long id;
    private String loaiLich;
    private String tenDoiTuong; // Tên xe hoặc tên dịch vụ
    private String tenChiNhanh;
    private String hoTen;
    private String soDienThoai;
    private String email;
    private LocalDate ngayHen;
    private LocalTime gioHen;
    private String ghiChu;
    private String trangThai;
    private LocalDateTime ngayTao;
}
