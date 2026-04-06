package com.sale_oto.carshop.service;

import com.sale_oto.carshop.dto.request.DiaChiRequest;
import com.sale_oto.carshop.dto.response.DiaChiResponse;
import com.sale_oto.carshop.entity.DiaChiKhachHang;
import com.sale_oto.carshop.entity.KhachHang;
import com.sale_oto.carshop.exception.ResourceNotFoundException;
import com.sale_oto.carshop.repository.DiaChiKhachHangRepository;
import com.sale_oto.carshop.repository.KhachHangRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DiaChiKhachHangService {

    private final DiaChiKhachHangRepository diaChiKhachHangRepository;
    private final KhachHangRepository khachHangRepository;

    @Transactional(readOnly = true)
    public List<DiaChiResponse> getByKhachHangId(Long khachHangId) {
        return diaChiKhachHangRepository.findByKhachHangId(khachHangId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public DiaChiResponse create(Long khachHangId, DiaChiRequest request) {
        KhachHang khachHang = khachHangRepository.findById(khachHangId)
                .orElseThrow(() -> new ResourceNotFoundException("Khách hàng", khachHangId));

        DiaChiKhachHang diaChi = new DiaChiKhachHang();
        diaChi.setKhachHang(khachHang);
        mapRequestToEntity(request, diaChi);

        // If this is the only address, make it default automatically
        if (diaChiKhachHangRepository.findByKhachHangId(khachHangId).isEmpty()) {
            diaChi.setIsDefault(true);
        } else if (Boolean.TRUE.equals(request.getIsDefault())) {
            // Remove old default
            removeOldDefault(khachHangId);
        }

        return toResponse(diaChiKhachHangRepository.save(diaChi));
    }

    @Transactional
    public DiaChiResponse update(Long id, DiaChiRequest request) {
        DiaChiKhachHang diaChi = diaChiKhachHangRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Địa chỉ", id));
        
        mapRequestToEntity(request, diaChi);
        
        if (Boolean.TRUE.equals(request.getIsDefault()) && !Boolean.TRUE.equals(diaChi.getIsDefault())) {
            removeOldDefault(diaChi.getKhachHang().getId());
            diaChi.setIsDefault(true);
        }

        return toResponse(diaChiKhachHangRepository.save(diaChi));
    }

    @Transactional
    public void delete(Long id) {
        DiaChiKhachHang diaChi = diaChiKhachHangRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Địa chỉ", id));
        diaChiKhachHangRepository.delete(diaChi);
    }

    private void removeOldDefault(Long khachHangId) {
        List<DiaChiKhachHang> dcs = diaChiKhachHangRepository.findByKhachHangId(khachHangId);
        for (DiaChiKhachHang dc : dcs) {
            if (Boolean.TRUE.equals(dc.getIsDefault())) {
                dc.setIsDefault(false);
                diaChiKhachHangRepository.save(dc);
            }
        }
    }

    private void mapRequestToEntity(DiaChiRequest request, DiaChiKhachHang diaChi) {
        diaChi.setTenNguoiNhan(request.getTenNguoiNhan());
        diaChi.setSoDienThoai(request.getSoDienThoai());
        diaChi.setTinhThanhId(request.getTinhThanhId());
        diaChi.setTinhThanhTen(request.getTinhThanhTen());
        diaChi.setXaPhuongId(request.getXaPhuongId());
        diaChi.setXaPhuongTen(request.getXaPhuongTen());
        diaChi.setDiaChiChiTiet(request.getDiaChiChiTiet());
        diaChi.setGhnDistrictId(request.getGhnDistrictId());
        diaChi.setGhnWardCode(request.getGhnWardCode());
        if (request.getIsDefault() != null) {
            diaChi.setIsDefault(request.getIsDefault());
        }
    }

    private DiaChiResponse toResponse(DiaChiKhachHang diaChi) {
        return DiaChiResponse.builder()
                .id(diaChi.getId())
                .tenNguoiNhan(diaChi.getTenNguoiNhan())
                .soDienThoai(diaChi.getSoDienThoai())
                .tinhThanhId(diaChi.getTinhThanhId())
                .tinhThanhTen(diaChi.getTinhThanhTen())
                .xaPhuongId(diaChi.getXaPhuongId())
                .xaPhuongTen(diaChi.getXaPhuongTen())
                .diaChiChiTiet(diaChi.getDiaChiChiTiet())
                .ghnDistrictId(diaChi.getGhnDistrictId())
                .ghnWardCode(diaChi.getGhnWardCode())
                .isDefault(diaChi.getIsDefault())
                .build();
    }
}
