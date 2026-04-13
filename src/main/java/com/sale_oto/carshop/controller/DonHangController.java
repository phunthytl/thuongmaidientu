package com.sale_oto.carshop.controller;

import com.sale_oto.carshop.dto.request.DonHangRequest;
import com.sale_oto.carshop.dto.response.ApiResponse;
import com.sale_oto.carshop.dto.response.DonHangResponse;
import com.sale_oto.carshop.enums.TrangThaiDonHang;
import com.sale_oto.carshop.service.DonHangService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/don-hang")
@RequiredArgsConstructor
public class DonHangController {

    private final DonHangService donHangService;

    @PostMapping
    public ResponseEntity<ApiResponse<List<DonHangResponse>>> create(@Valid @RequestBody DonHangRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(donHangService.create(request)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DonHangResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(donHangService.getById(id)));
    }

    @GetMapping("/ma/{maDonHang}")
    public ResponseEntity<ApiResponse<DonHangResponse>> getByMaDonHang(@PathVariable String maDonHang) {
        return ResponseEntity.ok(ApiResponse.success(donHangService.getByMaDonHang(maDonHang)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<DonHangResponse>>> getAll(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(donHangService.getAll(pageable)));
    }

    @GetMapping("/khach-hang/{khachHangId}")
    public ResponseEntity<ApiResponse<Page<DonHangResponse>>> getByKhachHang(
            @PathVariable Long khachHangId, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(donHangService.getByKhachHang(khachHangId, pageable)));
    }

    @GetMapping("/trang-thai/{trangThai}")
    public ResponseEntity<ApiResponse<Page<DonHangResponse>>> getByTrangThai(
            @PathVariable TrangThaiDonHang trangThai, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(donHangService.getByTrangThai(trangThai, pageable)));
    }

    @GetMapping("/tim-kiem")
    public ResponseEntity<ApiResponse<Page<DonHangResponse>>> search(
            @RequestParam String keyword, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(donHangService.search(keyword, pageable)));
    }

    @PatchMapping("/{id}/trang-thai")
    public ResponseEntity<ApiResponse<DonHangResponse>> capNhatTrangThai(
            @PathVariable Long id, @RequestParam TrangThaiDonHang trangThai) {
        return ResponseEntity.ok(ApiResponse.success(donHangService.capNhatTrangThai(id, trangThai)));
    }

    @PatchMapping("/{donHangId}/gan-nhan-vien/{nhanVienId}")
    public ResponseEntity<ApiResponse<DonHangResponse>> ganNhanVien(
            @PathVariable Long donHangId, @PathVariable Long nhanVienId) {
        return ResponseEntity.ok(ApiResponse.success(donHangService.ganNhanVien(donHangId, nhanVienId)));
    }
}
