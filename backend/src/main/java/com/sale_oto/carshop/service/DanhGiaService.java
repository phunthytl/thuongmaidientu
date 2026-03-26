package com.sale_oto.carshop.service;

import com.sale_oto.carshop.dto.request.DanhGiaRequest;
import com.sale_oto.carshop.dto.response.DanhGiaResponse;
import com.sale_oto.carshop.entity.*;
import com.sale_oto.carshop.exception.ResourceNotFoundException;
import com.sale_oto.carshop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DanhGiaService {

    private final DanhGiaRepository danhGiaRepository;
    private final KhachHangRepository khachHangRepository;
    private final OToRepository oToRepository;
    private final PhuKienRepository phuKienRepository;
    private final DichVuRepository dichVuRepository;

    @Transactional
    public DanhGiaResponse create(DanhGiaRequest request) {
        KhachHang khachHang = khachHangRepository.findById(request.getKhachHangId())
                .orElseThrow(() -> new ResourceNotFoundException("Khách hàng", request.getKhachHangId()));

        DanhGia danhGia = new DanhGia();
        danhGia.setKhachHang(khachHang);
        danhGia.setLoaiSanPham(request.getLoaiSanPham());
        danhGia.setDiemDanhGia(request.getDiemDanhGia());
        danhGia.setNoiDung(request.getNoiDung());
        danhGia.setTrangThai(true);

        switch (request.getLoaiSanPham()) {
            case OTO -> {
                OTo oto = oToRepository.findById(request.getOtoId())
                        .orElseThrow(() -> new ResourceNotFoundException("Ô tô", request.getOtoId()));
                danhGia.setOto(oto);
            }
            case PHU_KIEN -> {
                PhuKien pk = phuKienRepository.findById(request.getPhuKienId())
                        .orElseThrow(() -> new ResourceNotFoundException("Phụ kiện", request.getPhuKienId()));
                danhGia.setPhuKien(pk);
            }
            case DICH_VU -> {
                DichVu dv = dichVuRepository.findById(request.getDichVuId())
                        .orElseThrow(() -> new ResourceNotFoundException("Dịch vụ", request.getDichVuId()));
                danhGia.setDichVu(dv);
            }
        }

        danhGia = danhGiaRepository.save(danhGia);
        return toResponse(danhGia);
    }

    public Page<DanhGiaResponse> getByOto(Long otoId, Pageable pageable) {
        return danhGiaRepository.findByOtoId(otoId, pageable).map(this::toResponse);
    }

    public Page<DanhGiaResponse> getByPhuKien(Long phuKienId, Pageable pageable) {
        return danhGiaRepository.findByPhuKienId(phuKienId, pageable).map(this::toResponse);
    }

    public Page<DanhGiaResponse> getByDichVu(Long dichVuId, Pageable pageable) {
        return danhGiaRepository.findByDichVuId(dichVuId, pageable).map(this::toResponse);
    }

    public Page<DanhGiaResponse> getByKhachHang(Long khachHangId, Pageable pageable) {
        return danhGiaRepository.findByKhachHangId(khachHangId, pageable).map(this::toResponse);
    }

    @Transactional
    public void delete(Long id) {
        if (!danhGiaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Đánh giá", id);
        }
        danhGiaRepository.deleteById(id);
    }

    private DanhGiaResponse toResponse(DanhGia dg) {
        String tenSanPham = switch (dg.getLoaiSanPham()) {
            case OTO -> dg.getOto() != null ? dg.getOto().getTenXe() : "";
            case PHU_KIEN -> dg.getPhuKien() != null ? dg.getPhuKien().getTenPhuKien() : "";
            case DICH_VU -> dg.getDichVu() != null ? dg.getDichVu().getTenDichVu() : "";
        };

        return DanhGiaResponse.builder()
                .id(dg.getId())
                .tenKhachHang(dg.getKhachHang().getHoTen())
                .khachHangId(dg.getKhachHang().getId())
                .loaiSanPham(dg.getLoaiSanPham())
                .tenSanPham(tenSanPham)
                .diemDanhGia(dg.getDiemDanhGia())
                .noiDung(dg.getNoiDung())
                .trangThai(dg.getTrangThai())
                .ngayTao(dg.getNgayTao())
                .build();
    }
}
