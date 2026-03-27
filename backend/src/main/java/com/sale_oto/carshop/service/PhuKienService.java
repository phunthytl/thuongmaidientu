package com.sale_oto.carshop.service;

import com.sale_oto.carshop.dto.request.PhuKienRequest;
import com.sale_oto.carshop.dto.response.PhuKienResponse;
import com.sale_oto.carshop.enums.LoaiDoiTuong;
import com.sale_oto.carshop.enums.LoaiMedia;
import com.sale_oto.carshop.entity.PhuKien;
import com.sale_oto.carshop.exception.ResourceNotFoundException;
import com.sale_oto.carshop.repository.DanhGiaRepository;
import com.sale_oto.carshop.repository.MediaRepository;
import com.sale_oto.carshop.repository.PhuKienRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PhuKienService {

    private final PhuKienRepository phuKienRepository;
    private final MediaRepository mediaRepository;
    private final DanhGiaRepository danhGiaRepository;

    @Transactional
    public PhuKienResponse create(PhuKienRequest request) {
        PhuKien pk = new PhuKien();
        mapRequestToEntity(request, pk);
        pk.setTrangThai(true);
        pk = phuKienRepository.save(pk);
        return toResponse(pk);
    }

    public PhuKienResponse getById(Long id) {
        PhuKien pk = phuKienRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Phụ kiện", id));
        return toResponse(pk);
    }

    public Page<PhuKienResponse> getAll(Pageable pageable) {
        return phuKienRepository.findAll(pageable).map(this::toResponse);
    }

    public Page<PhuKienResponse> getByTrangThai(Boolean trangThai, Pageable pageable) {
        return phuKienRepository.findByTrangThai(trangThai, pageable).map(this::toResponse);
    }

    public Page<PhuKienResponse> search(String keyword, Pageable pageable) {
        return phuKienRepository.search(keyword, pageable).map(this::toResponse);
    }

    public List<String> getAllLoaiPhuKien() {
        return phuKienRepository.findAllLoaiPhuKien();
    }

    @Transactional
    public PhuKienResponse update(Long id, PhuKienRequest request) {
        PhuKien pk = phuKienRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Phụ kiện", id));
        mapRequestToEntity(request, pk);
        pk = phuKienRepository.save(pk);
        return toResponse(pk);
    }

    @Transactional
    public void delete(Long id) {
        if (!phuKienRepository.existsById(id)) {
            throw new ResourceNotFoundException("Phụ kiện", id);
        }
        phuKienRepository.deleteById(id);
    }

    private void mapRequestToEntity(PhuKienRequest request, PhuKien pk) {
        pk.setTenPhuKien(request.getTenPhuKien());
        pk.setLoaiPhuKien(request.getLoaiPhuKien());
        pk.setHangSanXuat(request.getHangSanXuat());
        pk.setGia(request.getGia());
        pk.setSoLuong(request.getSoLuong() != null ? request.getSoLuong() : 0);
        pk.setMoTa(request.getMoTa());
    }

    private PhuKienResponse toResponse(PhuKien pk) {
        List<String> hinhAnhs = mediaRepository
                .findByLoaiDoiTuongAndDoiTuongIdAndLoaiMediaOrderByThuTuAsc(
                        LoaiDoiTuong.PHU_KIEN, pk.getId(), LoaiMedia.IMAGE)
                .stream()
                .map(media -> media.getUrl())
                .collect(Collectors.toList());

        Double diemTB = danhGiaRepository.getAverageRatingByPhuKienId(pk.getId());

        return PhuKienResponse.builder()
                .id(pk.getId())
                .tenPhuKien(pk.getTenPhuKien())
                .loaiPhuKien(pk.getLoaiPhuKien())
                .hangSanXuat(pk.getHangSanXuat())
                .gia(pk.getGia())
                .soLuong(pk.getSoLuong())
                .moTa(pk.getMoTa())
                .trangThai(pk.getTrangThai())
                .hinhAnhs(hinhAnhs)
                .diemDanhGiaTrungBinh(diemTB)
                .ngayTao(pk.getNgayTao())
                .ngayCapNhat(pk.getNgayCapNhat())
                .build();
    }
}
