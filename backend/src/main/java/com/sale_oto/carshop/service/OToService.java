package com.sale_oto.carshop.service;

import com.sale_oto.carshop.dto.request.OToRequest;
import com.sale_oto.carshop.dto.response.OToResponse;
import com.sale_oto.carshop.entity.OTo;
import com.sale_oto.carshop.enums.LoaiDoiTuong;
import com.sale_oto.carshop.enums.LoaiMedia;
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
public class OToService {

    private static final String RESOURCE_NAME = "Ô tô";
    private static final int DEFAULT_SIMILAR_LIMIT = 4;
    private static final int MAX_SIMILAR_LIMIT = 12;
    private static final double MIN_SIMILARITY_SCORE = 0.01;

    private static final double BRAND_WEIGHT = 30;
    private static final double MODEL_WEIGHT = 18;
    private static final double FUEL_WEIGHT = 12;
    private static final double TRANSMISSION_WEIGHT = 8;
    private static final double ENGINE_WEIGHT = 6;
    private static final double COLOR_WEIGHT = 3;
    private static final double PRICE_WEIGHT = 18;
    private static final double YEAR_WEIGHT = 5;
    private static final double TEXT_WEIGHT = 20;
    private static final double PRICE_TOLERANCE = 0.25;
    private static final double YEAR_TOLERANCE = 5.0;

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
        OTo oto = findByIdOrThrow(id);
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

    public Page<OToResponse> filter(String hangXe, BigDecimal giaMin, BigDecimal giaMax, String keyword, Pageable pageable) {
        String searchKeyword = (keyword != null && !keyword.isBlank()) ? "%" + keyword.trim() + "%" : null;
        return oToRepository
                .filter(hangXe, giaMin, giaMax, searchKeyword, TrangThaiOTo.DANG_BAN, pageable)
                .map(this::toResponse);
    }

    public List<String> getAllHangXe() {
        return oToRepository.findAllHangXe();
    }

    public List<OToResponse> getSimilarProducts(Long id, int limit) {
        OTo target = findByIdOrThrow(id);
        int resultLimit = normalizeLimit(limit);

        return oToRepository.findByTrangThai(TrangThaiOTo.DANG_BAN).stream()
                .filter(oto -> !oto.getId().equals(target.getId()))
                .map(oto -> new ScoredOTo(oto, similarityScore(target, oto)))
                .filter(scoredOTo -> scoredOTo.score() > MIN_SIMILARITY_SCORE)
                .sorted(Comparator.comparingDouble(ScoredOTo::score).reversed()
                        .thenComparing(scoredOTo -> scoredOTo.oto().getNgayTao(),
                                Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(resultLimit)
                .map(scoredOTo -> toResponse(scoredOTo.oto()))
                .collect(Collectors.toList());
    }

    @Transactional
    public OToResponse update(Long id, OToRequest request) {
        OTo oto = findByIdOrThrow(id);
        mapRequestToEntity(request, oto);
        oto = oToRepository.save(oto);
        return toResponse(oto);
    }

    @Transactional
    public OToResponse capNhatTrangThai(Long id, TrangThaiOTo trangThai) {
        OTo oto = findByIdOrThrow(id);
        oto.setTrangThai(trangThai);
        oto = oToRepository.save(oto);
        return toResponse(oto);
    }

    @Transactional
    public void delete(Long id) {
        if (!oToRepository.existsById(id)) {
            throw new ResourceNotFoundException(RESOURCE_NAME, id);
        }
        oToRepository.deleteById(id);
    }

    private OTo findByIdOrThrow(Long id) {
        return oToRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(RESOURCE_NAME, id));
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
        oto.setSoLuong(request.getSoLuong());
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
                .soLuong(oto.getSoLuong())
                .moTa(oto.getMoTa())
                .trangThai(oto.getTrangThai())
                .hinhAnhs(hinhAnhs)
                .diemDanhGiaTrungBinh(diemTB)
                .ngayTao(oto.getNgayTao())
                .ngayCapNhat(oto.getNgayCapNhat())
                .build();
    }

    private double similarityScore(OTo target, OTo candidate) {
        double score = 0;

        score += sameText(target.getHangXe(), candidate.getHangXe()) ? BRAND_WEIGHT : 0;
        score += sameText(target.getDongXe(), candidate.getDongXe()) ? MODEL_WEIGHT : 0;
        score += sameText(target.getNhienLieu(), candidate.getNhienLieu()) ? FUEL_WEIGHT : 0;
        score += sameText(target.getHopSo(), candidate.getHopSo()) ? TRANSMISSION_WEIGHT : 0;
        score += sameText(target.getDongCo(), candidate.getDongCo()) ? ENGINE_WEIGHT : 0;
        score += sameText(target.getMauSac(), candidate.getMauSac()) ? COLOR_WEIGHT : 0;
        score += numericSimilarity(target.getGia(), candidate.getGia(), PRICE_TOLERANCE) * PRICE_WEIGHT;
        score += yearSimilarity(target.getNamSanXuat(), candidate.getNamSanXuat()) * YEAR_WEIGHT;
        score += tokenSimilarity(searchText(target), searchText(candidate)) * TEXT_WEIGHT;

        return score;
    }

    private int normalizeLimit(int limit) {
        if (limit <= 0) {
            return DEFAULT_SIMILAR_LIMIT;
        }
        return Math.min(limit, MAX_SIMILAR_LIMIT);
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

    private double yearSimilarity(Integer left, Integer right) {
        if (left == null || right == null) {
            return 0;
        }
        int diff = Math.abs(left - right);
        return Math.max(0, 1 - (diff / YEAR_TOLERANCE));
    }

    private String searchText(OTo oto) {
        return String.join(" ",
                safe(oto.getTenXe()),
                safe(oto.getHangXe()),
                safe(oto.getDongXe()),
                safe(oto.getDongCo()),
                safe(oto.getNhienLieu()),
                safe(oto.getMoTa()));
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

    private record ScoredOTo(OTo oto, double score) {
    }
}
