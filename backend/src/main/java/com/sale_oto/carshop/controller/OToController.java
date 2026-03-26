package com.sale_oto.carshop.controller;

import com.sale_oto.carshop.dto.request.OToRequest;
import com.sale_oto.carshop.dto.response.ApiResponse;
import com.sale_oto.carshop.dto.response.OToResponse;
import com.sale_oto.carshop.enums.TrangThaiOTo;
import com.sale_oto.carshop.service.OToService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/oto")
@RequiredArgsConstructor
public class OToController {

    private final OToService oToService;

    @PostMapping
    public ResponseEntity<ApiResponse<OToResponse>> create(@Valid @RequestBody OToRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(oToService.create(request)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OToResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(oToService.getById(id)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<OToResponse>>> getAll(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(oToService.getAll(pageable)));
    }

    @GetMapping("/trang-thai/{trangThai}")
    public ResponseEntity<ApiResponse<Page<OToResponse>>> getByTrangThai(
            @PathVariable TrangThaiOTo trangThai, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(oToService.getByTrangThai(trangThai, pageable)));
    }

    @GetMapping("/hang-xe/{hangXe}")
    public ResponseEntity<ApiResponse<Page<OToResponse>>> getByHangXe(
            @PathVariable String hangXe, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(oToService.getByHangXe(hangXe, pageable)));
    }

    @GetMapping("/loc-gia")
    public ResponseEntity<ApiResponse<Page<OToResponse>>> getByGia(
            @RequestParam BigDecimal giaMin, @RequestParam BigDecimal giaMax, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(oToService.getByGia(giaMin, giaMax, pageable)));
    }

    @GetMapping("/tim-kiem")
    public ResponseEntity<ApiResponse<Page<OToResponse>>> search(
            @RequestParam String keyword, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(oToService.search(keyword, pageable)));
    }

    @GetMapping("/hang-xe")
    public ResponseEntity<ApiResponse<List<String>>> getAllHangXe() {
        return ResponseEntity.ok(ApiResponse.success(oToService.getAllHangXe()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<OToResponse>> update(
            @PathVariable Long id, @Valid @RequestBody OToRequest request) {
        return ResponseEntity.ok(ApiResponse.success(oToService.update(id, request)));
    }

    @PatchMapping("/{id}/trang-thai")
    public ResponseEntity<ApiResponse<OToResponse>> capNhatTrangThai(
            @PathVariable Long id, @RequestParam TrangThaiOTo trangThai) {
        return ResponseEntity.ok(ApiResponse.success(oToService.capNhatTrangThai(id, trangThai)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        oToService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa ô tô thành công", null));
    }
}
