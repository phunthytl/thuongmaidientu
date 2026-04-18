package com.sale_oto.carshop.service;

import com.sale_oto.carshop.dto.request.DanhGiaOToRequest;
import com.sale_oto.carshop.dto.response.DanhGiaOToResponse;
import com.sale_oto.carshop.dto.response.RatingSummaryResponse;
import com.sale_oto.carshop.entity.DanhGiaOTo;
import com.sale_oto.carshop.entity.NguoiDung;
import com.sale_oto.carshop.entity.OTo;
import com.sale_oto.carshop.exception.ResourceNotFoundException;
import com.sale_oto.carshop.repository.DanhGiaOToRepository;
import com.sale_oto.carshop.repository.NguoiDungRepository;
import com.sale_oto.carshop.repository.OToRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DanhGiaOToService {

    private final DanhGiaOToRepository danhGiaOToRepository;
    private final NguoiDungRepository nguoiDungRepository;
    private final OToRepository oToRepository;

    /**
     * Tạo đánh giá mới.
     * Validate:
     *  - rating từ 1-5 (đã validate bằng annotation @Min/@Max)
     *  - user phải tồn tại
     *  - sản phẩm (OTo) phải tồn tại
     *  - mỗi user chỉ được đánh giá 1 xe 1 lần
     */
    @Transactional
    public DanhGiaOToResponse createReview(Long userId, DanhGiaOToRequest request) {
        // Validate user tồn tại
        NguoiDung nguoiDung = nguoiDungRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng", userId));

        // Validate sản phẩm tồn tại
        OTo oto = oToRepository.findById(request.getOtoId())
                .orElseThrow(() -> new ResourceNotFoundException("Ô tô", request.getOtoId()));

        // Kiểm tra user đã đánh giá xe này chưa
        if (danhGiaOToRepository.existsByNguoiDungIdAndOtoId(userId, request.getOtoId())) {
            throw new IllegalStateException(
                    "Bạn đã đánh giá xe này rồi. Mỗi người chỉ được đánh giá một xe một lần.");
        }

        // Tạo đánh giá mới
        DanhGiaOTo danhGia = DanhGiaOTo.builder()
                .nguoiDung(nguoiDung)
                .oto(oto)
                .diemDanhGia(request.getDiemDanhGia())
                .binhLuan(request.getBinhLuan())
                .build();

        danhGia = danhGiaOToRepository.save(danhGia);
        return toResponse(danhGia);
    }

    /**
     * Lấy danh sách đánh giá theo sản phẩm (tự động sắp xếp mới nhất trước).
     */
    public Page<DanhGiaOToResponse> getReviewsByOto(Long otoId, Pageable pageable) {
        // Validate sản phẩm tồn tại
        if (!oToRepository.existsById(otoId)) {
            throw new ResourceNotFoundException("Ô tô", otoId);
        }
        // Ghi đè sort để luôn lấy mới nhất
        Pageable sortedByDate = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, "ngayTao")
        );
        return danhGiaOToRepository.findByOtoIdOrderByNgayTaoDesc(otoId, sortedByDate)
                .map(this::toResponse);
    }

    /**
     * Lấy danh sách đánh giá của user hiện tại (mới nhất trước).
     */
    public Page<DanhGiaOToResponse> getReviewsByUser(Long userId, Pageable pageable) {
        // Validate user tồn tại
        if (!nguoiDungRepository.existsById(userId)) {
            throw new ResourceNotFoundException("Người dùng", userId);
        }
        Pageable sortedByDate = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, "ngayTao")
        );
        return danhGiaOToRepository.findByNguoiDungIdOrderByNgayTaoDesc(userId, sortedByDate)
                .map(this::toResponse);
    }

    /**
     * Trả về điểm trung bình và tổng số đánh giá của một xe.
     */
    public RatingSummaryResponse getRatingSummary(Long otoId) {
        if (!oToRepository.existsById(otoId)) {
            throw new ResourceNotFoundException("Ô tô", otoId);
        }
        Double averageRating = danhGiaOToRepository.getAverageRatingByOtoId(otoId);
        long totalReviews = danhGiaOToRepository.countByOtoId(otoId);

        return RatingSummaryResponse.builder()
                .averageRating(averageRating != null
                        ? Math.round(averageRating * 10.0) / 10.0  // làm tròn 1 chữ số thập phân
                        : 0.0)
                .totalReviews(totalReviews)
                .build();
    }

    // ==================== MAPPER ====================

    private DanhGiaOToResponse toResponse(DanhGiaOTo dg) {
        return DanhGiaOToResponse.builder()
                .id(dg.getId())
                .nguoiDungId(dg.getNguoiDung().getId())
                .tenNguoiDung(dg.getNguoiDung().getHoTen())
                .otoId(dg.getOto().getId())
                .tenXe(dg.getOto().getTenXe())
                .diemDanhGia(dg.getDiemDanhGia())
                .binhLuan(dg.getBinhLuan())
                .ngayTao(dg.getNgayTao())
                .build();
    }
}
