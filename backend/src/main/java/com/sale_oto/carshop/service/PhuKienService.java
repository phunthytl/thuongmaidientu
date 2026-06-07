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

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.Normalizer;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
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
        pk.setSoLuong(0);
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

    public Page<PhuKienResponse> filter(String loaiPhuKien, java.math.BigDecimal giaMin, java.math.BigDecimal giaMax, String keyword, Pageable pageable) {
        String searchKeyword = (keyword != null && !keyword.isEmpty()) ? "%" + keyword + "%" : null;
        return phuKienRepository
                .filter(loaiPhuKien, giaMin, giaMax, searchKeyword, pageable)
                .map(this::toResponse);
    }

    public List<String> getAllLoaiPhuKien() {
        return phuKienRepository.findAllLoaiPhuKien();
    }

    public List<PhuKienResponse> getSimilarProducts(Long id, int limit) {
        PhuKien target = phuKienRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Phụ kiện", id));

        int resultLimit = limit > 0 ? limit : 4;
        return phuKienRepository.findByTrangThai(true).stream()
                .filter(pk -> !pk.getId().equals(target.getId()))
                .sorted(Comparator.comparingDouble((PhuKien pk) -> similarityScore(target, pk)).reversed()
                        .thenComparing(PhuKien::getNgayTao, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(resultLimit)
                .map(this::toResponse)
                .collect(Collectors.toList());
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
        Integer trongLuong = request.getTrongLuong();
        pk.setTrongLuong(trongLuong != null ? trongLuong : 500);
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
                .trongLuong(pk.getTrongLuong())
                .moTa(pk.getMoTa())
                .trangThai(pk.getTrangThai())
                .hinhAnhs(hinhAnhs)
                .diemDanhGiaTrungBinh(diemTB)
                .ngayTao(pk.getNgayTao())
                .ngayCapNhat(pk.getNgayCapNhat())
                .build();
    }

    private double similarityScore(PhuKien target, PhuKien candidate) {
        double score = 0;

        score += sameText(target.getLoaiPhuKien(), candidate.getLoaiPhuKien()) ? 35 : 0;
        score += sameText(target.getHangSanXuat(), candidate.getHangSanXuat()) ? 20 : 0;
        score += numericSimilarity(target.getGia(), candidate.getGia(), 0.35) * 20;
        score += integerSimilarity(target.getTrongLuong(), candidate.getTrongLuong(), 0.5) * 5;
        score += tokenSimilarity(searchText(target), searchText(candidate)) * 25;

        return score;
    }

    private boolean sameText(String left, String right) {
        if (left == null || right == null) {
            return false;
        }
        return normalize(left).equals(normalize(right));
    }

    private double numericSimilarity(BigDecimal left, BigDecimal right, double tolerance) {
        if (left == null || right == null || BigDecimal.ZERO.compareTo(left) == 0) {
            return 0;
        }

        double diffRatio = left.subtract(right).abs()
                .divide(left, 6, RoundingMode.HALF_UP)
                .doubleValue();
        return Math.max(0, 1 - (diffRatio / tolerance));
    }

    private double integerSimilarity(Integer left, Integer right, double tolerance) {
        if (left == null || right == null || left == 0) {
            return 0;
        }
        double diffRatio = Math.abs(left - right) / (double) left;
        return Math.max(0, 1 - (diffRatio / tolerance));
    }

    private String searchText(PhuKien pk) {
        return String.join(" ",
                safe(pk.getTenPhuKien()),
                safe(pk.getLoaiPhuKien()),
                safe(pk.getHangSanXuat()),
                safe(pk.getMoTa()));
    }

    private double tokenSimilarity(String left, String right) {
        Set<String> leftTokens = tokens(left);
        Set<String> rightTokens = tokens(right);
        if (leftTokens.isEmpty() || rightTokens.isEmpty()) {
            return 0;
        }

        Set<String> intersection = new HashSet<>(leftTokens);
        intersection.retainAll(rightTokens);

        Set<String> union = new HashSet<>(leftTokens);
        union.addAll(rightTokens);

        return (double) intersection.size() / union.size();
    }

    private Set<String> tokens(String value) {
        return Arrays.stream(normalize(value).split("\\s+"))
                .filter(token -> token.length() >= 3)
                .collect(Collectors.toSet());
    }

    private String normalize(String value) {
        return Normalizer.normalize(safe(value).toLowerCase(), Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .replaceAll("[^a-z0-9\\s]", " ")
                .trim();
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }
}
