package com.sale_oto.carshop.controller;

import com.sale_oto.carshop.dto.request.PhuKienRequest;
import com.sale_oto.carshop.dto.response.ApiResponse;
import com.sale_oto.carshop.dto.response.PhuKienResponse;
import com.sale_oto.carshop.service.PhuKienService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/phu-kien")
@RequiredArgsConstructor
public class PhuKienController {

    private final PhuKienService phuKienService;

    @PostMapping
    public ResponseEntity<ApiResponse<PhuKienResponse>> create(@Valid @RequestBody PhuKienRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(phuKienService.create(request)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PhuKienResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(phuKienService.getById(id)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<PhuKienResponse>>> getAll(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(phuKienService.getAll(pageable)));
    }

    @GetMapping("/tim-kiem")
    public ResponseEntity<ApiResponse<Page<PhuKienResponse>>> search(
            @RequestParam String keyword, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(phuKienService.search(keyword, pageable)));
    }

    @GetMapping("/loc")
    public ResponseEntity<ApiResponse<Page<PhuKienResponse>>> filter(
            @RequestParam(required = false) String loaiPhuKien,
            @RequestParam(required = false) java.math.BigDecimal giaMin,
            @RequestParam(required = false) java.math.BigDecimal giaMax,
            @RequestParam(required = false) String keyword,
            Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(phuKienService.filter(loaiPhuKien, giaMin, giaMax, keyword, pageable)));
    }

    @GetMapping("/loai")
    public ResponseEntity<ApiResponse<List<String>>> getAllLoaiPhuKien() {
        return ResponseEntity.ok(ApiResponse.success(phuKienService.getAllLoaiPhuKien()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PhuKienResponse>> update(
            @PathVariable Long id, @Valid @RequestBody PhuKienRequest request) {
        return ResponseEntity.ok(ApiResponse.success(phuKienService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        phuKienService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa phụ kiện thành công", null));
    }
}
