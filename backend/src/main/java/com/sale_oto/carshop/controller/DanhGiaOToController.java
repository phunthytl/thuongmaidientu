package com.sale_oto.carshop.controller;

import com.sale_oto.carshop.dto.request.DanhGiaOToRequest;
import com.sale_oto.carshop.dto.response.ApiResponse;
import com.sale_oto.carshop.dto.response.DanhGiaOToResponse;
import com.sale_oto.carshop.dto.response.RatingSummaryResponse;
import com.sale_oto.carshop.security.CustomUserDetails;
import com.sale_oto.carshop.service.DanhGiaOToService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * Controller xử lý đánh giá ô tô dành cho người dùng (user-facing).
 *
 * <ul>
 *  <li>POST  /api/user/reviews                  – Tạo đánh giá mới (yêu cầu đăng nhập)</li>
 *  <li>GET   /api/user/reviews                  – Xem đánh giá của bản thân (yêu cầu đăng nhập)</li>
 *  <li>GET   /api/oto/{id}/reviews              – Xem tất cả đánh giá của một xe (public)</li>
 *  <li>GET   /api/oto/{id}/rating-summary       – Điểm trung bình + tổng số review (public)</li>
 * </ul>
 */
@RestController
@RequiredArgsConstructor
public class DanhGiaOToController {

    private final DanhGiaOToService danhGiaOToService;

    // =====================================================================
    // USER APIs – Yêu cầu đăng nhập
    // =====================================================================

    /**
     * POST /api/user/reviews
     * Tạo đánh giá mới. User chỉ được đánh giá mỗi xe 1 lần.
     */
    @PostMapping("/api/user/reviews")
    public ResponseEntity<ApiResponse<DanhGiaOToResponse>> createReview(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody DanhGiaOToRequest request) {

        DanhGiaOToResponse response = danhGiaOToService.createReview(userDetails.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(response));
    }

    /**
     * GET /api/user/reviews
     * Xem danh sách đánh giá của user đang đăng nhập, sắp xếp mới nhất trước.
     */
    @GetMapping("/api/user/reviews")
    public ResponseEntity<ApiResponse<Page<DanhGiaOToResponse>>> getMyReviews(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PageableDefault(size = 10, sort = "ngayTao", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<DanhGiaOToResponse> page = danhGiaOToService.getReviewsByUser(userDetails.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.success(page));
    }

    // =====================================================================
    // PUBLIC APIs – Ai cũng có thể xem
    // =====================================================================

    /**
     * GET /api/oto/{id}/reviews
     * Xem tất cả đánh giá của một xe, sắp xếp mới nhất trước.
     */
    @GetMapping("/api/oto/{id}/reviews")
    public ResponseEntity<ApiResponse<Page<DanhGiaOToResponse>>> getReviewsByOto(
            @PathVariable Long id,
            @PageableDefault(size = 10, sort = "ngayTao", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<DanhGiaOToResponse> page = danhGiaOToService.getReviewsByOto(id, pageable);
        return ResponseEntity.ok(ApiResponse.success(page));
    }

    /**
     * GET /api/oto/{id}/rating-summary
     * Trả về điểm đánh giá trung bình và tổng số review của một xe.
     *
     * <pre>
     * {
     *   "averageRating": 4.5,
     *   "totalReviews": 120
     * }
     * </pre>
     */
    @GetMapping("/api/oto/{id}/rating-summary")
    public ResponseEntity<ApiResponse<RatingSummaryResponse>> getRatingSummary(@PathVariable Long id) {
        RatingSummaryResponse summary = danhGiaOToService.getRatingSummary(id);
        return ResponseEntity.ok(ApiResponse.success(summary));
    }
}
