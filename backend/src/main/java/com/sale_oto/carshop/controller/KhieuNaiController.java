package com.sale_oto.carshop.controller;

import com.sale_oto.carshop.dto.request.KhieuNaiRequest;
import com.sale_oto.carshop.dto.response.ApiResponse;
import com.sale_oto.carshop.entity.KhieuNai;
import com.sale_oto.carshop.enums.TrangThaiKhieuNai;
import com.sale_oto.carshop.service.KhieuNaiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/khieu-nai")
@RequiredArgsConstructor
public class KhieuNaiController {

    private final KhieuNaiService khieuNaiService;

    @PostMapping
    public ResponseEntity<ApiResponse<KhieuNai>> create(@Valid @RequestBody KhieuNaiRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(khieuNaiService.create(request)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<KhieuNai>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(khieuNaiService.getById(id)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<KhieuNai>>> getAll(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(khieuNaiService.getAll(pageable)));
    }

    @GetMapping("/khach-hang/{khachHangId}")
    public ResponseEntity<ApiResponse<Page<KhieuNai>>> getByKhachHang(
            @PathVariable Long khachHangId, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(khieuNaiService.getByKhachHang(khachHangId, pageable)));
    }

    @GetMapping("/trang-thai/{trangThai}")
    public ResponseEntity<ApiResponse<Page<KhieuNai>>> getByTrangThai(
            @PathVariable TrangThaiKhieuNai trangThai, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(khieuNaiService.getByTrangThai(trangThai, pageable)));
    }

    @PatchMapping("/{id}/phan-hoi")
    public ResponseEntity<ApiResponse<KhieuNai>> phanHoi(
            @PathVariable Long id,
            @RequestParam String phanHoi,
            @RequestParam Long nhanVienId) {
        return ResponseEntity.ok(ApiResponse.success(khieuNaiService.phanHoi(id, phanHoi, nhanVienId)));
    }

    @PatchMapping("/{id}/trang-thai")
    public ResponseEntity<ApiResponse<KhieuNai>> capNhatTrangThai(
            @PathVariable Long id, @RequestParam TrangThaiKhieuNai trangThai) {
        return ResponseEntity.ok(ApiResponse.success(khieuNaiService.capNhatTrangThai(id, trangThai)));
    }
}
