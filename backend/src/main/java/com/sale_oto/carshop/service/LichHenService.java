package com.sale_oto.carshop.service;

import com.sale_oto.carshop.dto.request.LichHenRequest;
import com.sale_oto.carshop.dto.response.LichHenResponse;
import com.sale_oto.carshop.entity.LichHen;
import com.sale_oto.carshop.exception.ResourceNotFoundException;
import com.sale_oto.carshop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LichHenService {

    private final LichHenRepository lichHenRepository;
    private final OToRepository oToRepository;
    private final DichVuRepository dichVuRepository;
    private final KhoHangRepository khoHangRepository;
    private final NguoiDungRepository nguoiDungRepository;

    @Transactional
    public LichHenResponse create(LichHenRequest request) {
        LichHen lichHen = LichHen.builder()
                .loaiLich(request.getLoaiLich())
                .hoTen(request.getHoTen())
                .soDienThoai(request.getSoDienThoai())
                .email(request.getEmail())
                .ngayHen(request.getNgayHen())
                .gioHen(request.getGioHen())
                .ghiChu(request.getGhiChu())
                .build();

        // Gán người dùng nếu đang đăng nhập
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            if (email != null && !"anonymousUser".equals(email)) {
                nguoiDungRepository.findByEmail(email).ifPresent(lichHen::setNguoiDung);
            }
        } catch (Exception ignored) {}

        // Gán đối tượng đặt lịch
        if (request.getLoaiLich() == LichHen.LoaiLichHen.LAI_THU && request.getOtoId() != null) {
            lichHen.setOto(oToRepository.findById(request.getOtoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Ô tô", request.getOtoId())));
        } else if (request.getLoaiLich() == LichHen.LoaiLichHen.DICH_VU && request.getDichVuId() != null) {
            lichHen.setDichVu(dichVuRepository.findById(request.getDichVuId())
                    .orElseThrow(() -> new ResourceNotFoundException("Dịch vụ", request.getDichVuId())));
        }

        // Gán chi nhánh
        lichHen.setChiNhanh(khoHangRepository.findById(request.getChiNhanhId())
                .orElseThrow(() -> new ResourceNotFoundException("Chi nhánh", request.getChiNhanhId())));

        LichHen saved = lichHenRepository.save(lichHen);
        return mapToResponse(saved);
    }

    public List<LichHenResponse> getAllByLoai(LichHen.LoaiLichHen loai) {
        return lichHenRepository.findByLoaiLich(loai).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<LichHenResponse> getMyLichHen() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if (email == null || "anonymousUser".equals(email)) {
            throw new RuntimeException("Chưa đăng nhập");
        }
        Long userId = nguoiDungRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng", 0L))
                .getId();
        return lichHenRepository.findByNguoiDungId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateStatus(Long id, LichHen.TrangThaiLichHen status) {
        LichHen lichHen = lichHenRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lịch hẹn", id));
        lichHen.setTrangThai(status);
        lichHenRepository.save(lichHen);
    }

    private LichHenResponse mapToResponse(LichHen entity) {
        String tenDoiTuong = "";
        if (entity.getLoaiLich() == LichHen.LoaiLichHen.LAI_THU && entity.getOto() != null) {
            tenDoiTuong = entity.getOto().getTenXe();
        } else if (entity.getLoaiLich() == LichHen.LoaiLichHen.DICH_VU && entity.getDichVu() != null) {
            tenDoiTuong = entity.getDichVu().getTenDichVu();
        }

        return LichHenResponse.builder()
                .id(entity.getId())
                .loaiLich(entity.getLoaiLich().name())
                .tenDoiTuong(tenDoiTuong)
                .tenChiNhanh(entity.getChiNhanh().getTenKho())
                .hoTen(entity.getHoTen())
                .soDienThoai(entity.getSoDienThoai())
                .email(entity.getEmail())
                .ngayHen(entity.getNgayHen())
                .gioHen(entity.getGioHen())
                .ghiChu(entity.getGhiChu())
                .trangThai(entity.getTrangThai().name())
                .ngayTao(entity.getNgayTao())
                .build();
    }
}
