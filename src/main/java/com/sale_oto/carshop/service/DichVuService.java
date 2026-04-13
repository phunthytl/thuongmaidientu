package com.sale_oto.carshop.service;

import com.sale_oto.carshop.dto.request.DichVuRequest;
import com.sale_oto.carshop.dto.response.DichVuResponse;
import com.sale_oto.carshop.entity.DichVu;
import com.sale_oto.carshop.exception.ResourceNotFoundException;
import com.sale_oto.carshop.repository.DanhGiaRepository;
import com.sale_oto.carshop.repository.DichVuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DichVuService {

    private final DichVuRepository dichVuRepository;
    private final DanhGiaRepository danhGiaRepository;

    @Transactional
    public DichVuResponse create(DichVuRequest request) {
        DichVu dv = new DichVu();
        mapRequestToEntity(request, dv);
        dv.setTrangThai(true);
        dv = dichVuRepository.save(dv);
        return toResponse(dv);
    }

    public DichVuResponse getById(Long id) {
        DichVu dv = dichVuRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dịch vụ", id));
        return toResponse(dv);
    }

    public Page<DichVuResponse> getAll(Pageable pageable) {
        return dichVuRepository.findAll(pageable).map(this::toResponse);
    }

    public Page<DichVuResponse> search(String keyword, Pageable pageable) {
        return dichVuRepository.search(keyword, pageable).map(this::toResponse);
    }

    @Transactional
    public DichVuResponse update(Long id, DichVuRequest request) {
        DichVu dv = dichVuRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dịch vụ", id));
        mapRequestToEntity(request, dv);
        dv = dichVuRepository.save(dv);
        return toResponse(dv);
    }

    @Transactional
    public void delete(Long id) {
        if (!dichVuRepository.existsById(id)) {
            throw new ResourceNotFoundException("Dịch vụ", id);
        }
        dichVuRepository.deleteById(id);
    }

    private void mapRequestToEntity(DichVuRequest request, DichVu dv) {
        dv.setTenDichVu(request.getTenDichVu());
        dv.setMoTa(request.getMoTa());
        dv.setGia(request.getGia());
        dv.setThoiGianUocTinh(request.getThoiGianUocTinh());
    }

    private DichVuResponse toResponse(DichVu dv) {
        Double diemTB = danhGiaRepository.getAverageRatingByDichVuId(dv.getId());

        return DichVuResponse.builder()
                .id(dv.getId())
                .tenDichVu(dv.getTenDichVu())
                .moTa(dv.getMoTa())
                .gia(dv.getGia())
                .thoiGianUocTinh(dv.getThoiGianUocTinh())
                .trangThai(dv.getTrangThai())
                .diemDanhGiaTrungBinh(diemTB)
                .ngayTao(dv.getNgayTao())
                .ngayCapNhat(dv.getNgayCapNhat())
                .build();
    }
}
