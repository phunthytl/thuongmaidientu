package com.sale_oto.carshop.service;

import com.sale_oto.carshop.dto.request.OToRequest;
import com.sale_oto.carshop.dto.response.OToResponse;
import com.sale_oto.carshop.enums.LoaiDoiTuong;
import com.sale_oto.carshop.enums.LoaiMedia;
import com.sale_oto.carshop.entity.OTo;
import com.sale_oto.carshop.enums.TrangThaiOTo;
import com.sale_oto.carshop.exception.ResourceNotFoundException;
import com.sale_oto.carshop.repository.DanhGiaRepository;
import com.sale_oto.carshop.repository.MediaRepository;
import com.sale_oto.carshop.repository.OToRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OToService {

    private final OToRepository oToRepository;
    private final MediaRepository mediaRepository;
    private final DanhGiaRepository danhGiaRepository;

    @Transactional
    public OToResponse create(OToRequest request) {
        OTo oto = new OTo();
        mapRequestToEntity(request, oto);
        oto.setTrangThai(TrangThaiOTo.DANG_BAN);
        oto = oToRepository.save(oto);
        return toResponse(oto);
    }

    public OToResponse getById(Long id) {
        OTo oto = oToRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ô tô", id));
        return toResponse(oto);
    }

    public Page<OToResponse> getAll(Pageable pageable) {
        return oToRepository.findAll(pageable).map(this::toResponse);
    }

    public Page<OToResponse> getByTrangThai(TrangThaiOTo trangThai, Pageable pageable) {
        return oToRepository.findByTrangThai(trangThai, pageable).map(this::toResponse);
    }

    public Page<OToResponse> getByHangXe(String hangXe, Pageable pageable) {
        return oToRepository.findByHangXe(hangXe, pageable).map(this::toResponse);
    }

    public Page<OToResponse> getByGia(BigDecimal giaMin, BigDecimal giaMax, Pageable pageable) {
        return oToRepository
                .findByGiaBetweenAndTrangThai(giaMin, giaMax, TrangThaiOTo.DANG_BAN, pageable)
                .map(this::toResponse);
    }

    public Page<OToResponse> search(String keyword, Pageable pageable) {
        return oToRepository
                .search(keyword, TrangThaiOTo.DANG_BAN, pageable)
                .map(this::toResponse);
    }

    public List<String> getAllHangXe() {
        return oToRepository.findAllHangXe();
    }

    @Transactional
    public OToResponse update(Long id, OToRequest request) {
        OTo oto = oToRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ô tô", id));
        mapRequestToEntity(request, oto);
        oto = oToRepository.save(oto);
        return toResponse(oto);
    }

    @Transactional
    public OToResponse capNhatTrangThai(Long id, TrangThaiOTo trangThai) {
        OTo oto = oToRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ô tô", id));
        oto.setTrangThai(trangThai);
        oto = oToRepository.save(oto);
        return toResponse(oto);
    }

    @Transactional
    public void delete(Long id) {
        if (!oToRepository.existsById(id)) {
            throw new ResourceNotFoundException("Ô tô", id);
        }
        oToRepository.deleteById(id);
    }

    private void mapRequestToEntity(OToRequest request, OTo oto) {
        oto.setTenXe(request.getTenXe());
        oto.setHangXe(request.getHangXe());
        oto.setDongXe(request.getDongXe());
        oto.setNamSanXuat(request.getNamSanXuat());
        oto.setMauSac(request.getMauSac());
        oto.setDongCo(request.getDongCo());
        oto.setHopSo(request.getHopSo());
        oto.setNhienLieu(request.getNhienLieu());
        oto.setSoKm(request.getSoKm());
        oto.setGia(request.getGia());
        oto.setMoTa(request.getMoTa());
    }

    private OToResponse toResponse(OTo oto) {
        List<String> hinhAnhs = mediaRepository
                .findByLoaiDoiTuongAndDoiTuongIdAndLoaiMediaOrderByThuTuAsc(
                        LoaiDoiTuong.OTO, oto.getId(), LoaiMedia.IMAGE)
                .stream()
                .map(media -> media.getUrl())
                .collect(Collectors.toList());

        Double diemTB = danhGiaRepository.getAverageRatingByOtoId(oto.getId());

        return OToResponse.builder()
                .id(oto.getId())
                .tenXe(oto.getTenXe())
                .hangXe(oto.getHangXe())
                .dongXe(oto.getDongXe())
                .namSanXuat(oto.getNamSanXuat())
                .mauSac(oto.getMauSac())
                .dongCo(oto.getDongCo())
                .hopSo(oto.getHopSo())
                .nhienLieu(oto.getNhienLieu())
                .soKm(oto.getSoKm())
                .gia(oto.getGia())
                .moTa(oto.getMoTa())
                .trangThai(oto.getTrangThai())
                .hinhAnhs(hinhAnhs)
                .diemDanhGiaTrungBinh(diemTB)
                .ngayTao(oto.getNgayTao())
                .ngayCapNhat(oto.getNgayCapNhat())
                .build();
    }
}
