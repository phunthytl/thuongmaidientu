package com.sale_oto.carshop.controller;

import com.sale_oto.carshop.dto.request.DanhGiaRequest;
import com.sale_oto.carshop.dto.response.ApiResponse;
import com.sale_oto.carshop.dto.response.DanhGiaResponse;
import com.sale_oto.carshop.service.DanhGiaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/danh-gia")
@RequiredArgsConstructor
public class DanhGiaController {

    private final DanhGiaService danhGiaService;

    @PostMapping
    public ResponseEntity<ApiResponse<DanhGiaResponse>> create(@Valid @RequestBody DanhGiaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(danhGiaService.create(request)));
    }

    @GetMapping("/oto/{otoId}")
    public ResponseEntity<ApiResponse<Page<DanhGiaResponse>>> getByOto(
            @PathVariable Long otoId, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(danhGiaService.getByOto(otoId, pageable)));
    }

    @GetMapping("/phu-kien/{phuKienId}")
    public ResponseEntity<ApiResponse<Page<DanhGiaResponse>>> getByPhuKien(
            @PathVariable Long phuKienId, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(danhGiaService.getByPhuKien(phuKienId, pageable)));
    }

    @GetMapping("/dich-vu/{dichVuId}")
    public ResponseEntity<ApiResponse<Page<DanhGiaResponse>>> getByDichVu(
            @PathVariable Long dichVuId, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(danhGiaService.getByDichVu(dichVuId, pageable)));
    }

    @GetMapping("/khach-hang/{khachHangId}")
    public ResponseEntity<ApiResponse<Page<DanhGiaResponse>>> getByKhachHang(
            @PathVariable Long khachHangId, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(danhGiaService.getByKhachHang(khachHangId, pageable)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        danhGiaService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa đánh giá thành công", null));
    }
}
