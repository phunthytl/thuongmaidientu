package com.sale_oto.carshop.controller;

import com.sale_oto.carshop.dto.request.DichVuRequest;
import com.sale_oto.carshop.dto.response.ApiResponse;
import com.sale_oto.carshop.dto.response.DichVuResponse;
import com.sale_oto.carshop.service.DichVuService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dich-vu")
@RequiredArgsConstructor
public class DichVuController {

    private final DichVuService dichVuService;

    @PostMapping
    public ResponseEntity<ApiResponse<DichVuResponse>> create(@Valid @RequestBody DichVuRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(dichVuService.create(request)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DichVuResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(dichVuService.getById(id)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<DichVuResponse>>> getAll(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(dichVuService.getAll(pageable)));
    }

    @GetMapping("/tim-kiem")
    public ResponseEntity<ApiResponse<Page<DichVuResponse>>> search(
            @RequestParam String keyword, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(dichVuService.search(keyword, pageable)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DichVuResponse>> update(
            @PathVariable Long id, @Valid @RequestBody DichVuRequest request) {
        return ResponseEntity.ok(ApiResponse.success(dichVuService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        dichVuService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa dịch vụ thành công", null));
    }
}
