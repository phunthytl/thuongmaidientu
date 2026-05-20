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
        return diaChiKhachHangRepository
                .findByKhachHangIdAndIsDeletedFalseOrderByIdAsc(khachHangId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public DiaChiResponse create(Long khachHangId, DiaChiRequest request) {
        KhachHang khachHang = khachHangRepository.findById(khachHangId)
                .orElseThrow(() -> new ResourceNotFoundException("Khách hàng", khachHangId));

        List<DiaChiKhachHang> existing =
                diaChiKhachHangRepository.findByKhachHangIdAndIsDeletedFalseOrderByIdAsc(khachHangId);

        DiaChiKhachHang diaChi = new DiaChiKhachHang();
        diaChi.setKhachHang(khachHang);
        mapRequestToEntity(request, diaChi);
        diaChi.setIsDeleted(false);

        boolean wantDefault = Boolean.TRUE.equals(request.getIsDefault());
        boolean firstAddress = existing.isEmpty();

        if (firstAddress || wantDefault) {
            unsetAllDefaults(existing);
            diaChi.setIsDefault(true);
        } else {
            diaChi.setIsDefault(false);
        }

        return toResponse(diaChiKhachHangRepository.save(diaChi));
    }

    @Transactional
    public DiaChiResponse update(Long id, DiaChiRequest request) {
        DiaChiKhachHang diaChi = diaChiKhachHangRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Địa chỉ", id));

        if (Boolean.TRUE.equals(diaChi.getIsDeleted())) {
            throw new ResourceNotFoundException("Địa chỉ", id);
        }

        Long khachHangId = diaChi.getKhachHang().getId();
        mapRequestToEntity(request, diaChi);

        if (Boolean.TRUE.equals(request.getIsDefault())) {
            List<DiaChiKhachHang> others = diaChiKhachHangRepository
                    .findByKhachHangIdAndIsDeletedFalseOrderByIdAsc(khachHangId)
                    .stream().filter(d -> !d.getId().equals(id)).toList();
            unsetAllDefaults(others);
            diaChi.setIsDefault(true);
        }

        ensureExactlyOneDefault(khachHangId, diaChi);

        return toResponse(diaChiKhachHangRepository.save(diaChi));
    }

    @Transactional
    public void delete(Long id) {
        DiaChiKhachHang diaChi = diaChiKhachHangRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Địa chỉ", id));

        if (Boolean.TRUE.equals(diaChi.getIsDeleted())) {
            return;
        }

        boolean wasDefault = Boolean.TRUE.equals(diaChi.getIsDefault());
        Long khachHangId = diaChi.getKhachHang().getId();

        diaChi.setIsDeleted(true);
        diaChi.setIsDefault(false);
        diaChiKhachHangRepository.save(diaChi);

        if (wasDefault) {
            diaChiKhachHangRepository
                    .findFirstByKhachHangIdAndIsDeletedFalseOrderByIdAsc(khachHangId)
                    .ifPresent(next -> {
                        next.setIsDefault(true);
                        diaChiKhachHangRepository.save(next);
                    });
        }
    }

    private void unsetAllDefaults(List<DiaChiKhachHang> addresses) {
        for (DiaChiKhachHang d : addresses) {
            if (Boolean.TRUE.equals(d.getIsDefault())) {
                d.setIsDefault(false);
                diaChiKhachHangRepository.save(d);
            }
        }
    }

    private void ensureExactlyOneDefault(Long khachHangId, DiaChiKhachHang current) {
        List<DiaChiKhachHang> all = diaChiKhachHangRepository
                .findByKhachHangIdAndIsDeletedFalseOrderByIdAsc(khachHangId);
        long defaults = all.stream()
                .filter(d -> Boolean.TRUE.equals(d.getIsDefault()) && !d.getId().equals(current.getId()))
                .count();
        if (Boolean.TRUE.equals(current.getIsDefault())) {
            defaults += 1;
        }
        if (defaults == 0 && !all.isEmpty()) {
            current.setIsDefault(true);
        }
    }

    private void mapRequestToEntity(DiaChiRequest request, DiaChiKhachHang diaChi) {
        diaChi.setTenNguoiNhan(request.getTenNguoiNhan());
        diaChi.setSoDienThoai(request.getSoDienThoai());
        diaChi.setTinhThanhId(request.getTinhThanhId());
        diaChi.setTinhThanhTen(request.getTinhThanhTen());
        diaChi.setQuanHuyenId(request.getQuanHuyenId());
        diaChi.setQuanHuyenTen(request.getQuanHuyenTen());
        diaChi.setXaPhuongId(request.getXaPhuongId());
        diaChi.setXaPhuongTen(request.getXaPhuongTen());
        diaChi.setDiaChiChiTiet(request.getDiaChiChiTiet());
        diaChi.setGhnDistrictId(request.getGhnDistrictId());
        diaChi.setGhnWardCode(request.getGhnWardCode());
    }

    private DiaChiResponse toResponse(DiaChiKhachHang diaChi) {
        return DiaChiResponse.builder()
                .id(diaChi.getId())
                .tenNguoiNhan(diaChi.getTenNguoiNhan())
                .soDienThoai(diaChi.getSoDienThoai())
                .tinhThanhId(diaChi.getTinhThanhId())
                .tinhThanhTen(diaChi.getTinhThanhTen())
                .quanHuyenId(diaChi.getQuanHuyenId())
                .quanHuyenTen(diaChi.getQuanHuyenTen())
                .xaPhuongId(diaChi.getXaPhuongId())
                .xaPhuongTen(diaChi.getXaPhuongTen())
                .diaChiChiTiet(diaChi.getDiaChiChiTiet())
                .ghnDistrictId(diaChi.getGhnDistrictId())
                .ghnWardCode(diaChi.getGhnWardCode())
                .isDefault(diaChi.getIsDefault())
                .build();
    }
}
