package com.sale_oto.carshop.service;

import com.sale_oto.carshop.dto.response.KhoHangResponse;
import com.sale_oto.carshop.entity.KhoHang;
import com.sale_oto.carshop.exception.ResourceNotFoundException;
import com.sale_oto.carshop.repository.KhoHangRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class KhoHangService {

    private final KhoHangRepository khoHangRepository;

    @Transactional(readOnly = true)
    public List<KhoHangResponse> getAll() {
        return khoHangRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<KhoHangResponse> getActive() {
        return khoHangRepository.findByTrangThai(true).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public KhoHangResponse getById(Long id) {
        KhoHang kho = khoHangRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kho hàng", id));
        return toResponse(kho);
    }

    @Transactional
    public KhoHangResponse create(KhoHang request) {
        KhoHang kho = new KhoHang();
        mapFields(kho, request);
        kho = khoHangRepository.save(kho);
        return toResponse(kho);
    }

    @Transactional
    public KhoHangResponse update(Long id, KhoHang request) {
        KhoHang kho = khoHangRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kho hàng", id));
        mapFields(kho, request);
        kho = khoHangRepository.save(kho);
        return toResponse(kho);
    }

    private void mapFields(KhoHang kho, KhoHang request) {
        kho.setTenKho(request.getTenKho());
        kho.setNguoiLienHe(request.getNguoiLienHe());
        kho.setSoDienThoai(request.getSoDienThoai());
        kho.setTinhThanhId(request.getTinhThanhId());
        kho.setTinhThanhTen(request.getTinhThanhTen());
        kho.setXaPhuongId(request.getXaPhuongId());
        kho.setXaPhuongTen(request.getXaPhuongTen());
        kho.setDiaChiChiTiet(request.getDiaChiChiTiet());
        kho.setTrangThai(request.getTrangThai());
        kho.setGhnShopId(request.getGhnShopId());
        kho.setGhnProvinceId(request.getGhnProvinceId());
        kho.setGhnDistrictId(request.getGhnDistrictId());
        kho.setGhnWardCode(request.getGhnWardCode());
    }

    private KhoHangResponse toResponse(KhoHang kho) {
        return KhoHangResponse.builder()
                .id(kho.getId())
                .tenKho(kho.getTenKho())
                .nguoiLienHe(kho.getNguoiLienHe())
                .soDienThoai(kho.getSoDienThoai())
                .tinhThanhId(kho.getTinhThanhId())
                .tinhThanhName(kho.getTinhThanhTen())
                .diaChiChiTiet(kho.getDiaChiChiTiet())
                .trangThai(kho.getTrangThai())
                .ghnShopId(kho.getGhnShopId())
                .ngayTao(kho.getNgayTao())
                .build();
    }
}
