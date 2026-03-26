package com.sale_oto.carshop.controller;

import com.sale_oto.carshop.dto.request.NhanVienRequest;
import com.sale_oto.carshop.dto.response.ApiResponse;
import com.sale_oto.carshop.dto.response.NhanVienResponse;
import com.sale_oto.carshop.enums.ChucVu;
import com.sale_oto.carshop.service.NhanVienService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/nhan-vien")
@RequiredArgsConstructor
public class NhanVienController {

    private final NhanVienService nhanVienService;

    @PostMapping
    public ResponseEntity<ApiResponse<NhanVienResponse>> create(@Valid @RequestBody NhanVienRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(nhanVienService.create(request)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<NhanVienResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(nhanVienService.getById(id)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<NhanVienResponse>>> getAll(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(nhanVienService.getAll(pageable)));
    }

    @GetMapping("/chuc-vu/{chucVu}")
    public ResponseEntity<ApiResponse<Page<NhanVienResponse>>> getByChucVu(
            @PathVariable ChucVu chucVu, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(nhanVienService.getByChucVu(chucVu, pageable)));
    }

    @GetMapping("/tim-kiem")
    public ResponseEntity<ApiResponse<Page<NhanVienResponse>>> search(
            @RequestParam String keyword, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(nhanVienService.search(keyword, pageable)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<NhanVienResponse>> update(
            @PathVariable Long id, @Valid @RequestBody NhanVienRequest request) {
        return ResponseEntity.ok(ApiResponse.success(nhanVienService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        nhanVienService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa nhân viên thành công", null));
    }
}
