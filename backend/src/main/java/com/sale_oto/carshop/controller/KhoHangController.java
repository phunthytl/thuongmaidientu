package com.sale_oto.carshop.controller;

import com.sale_oto.carshop.dto.response.ApiResponse;
import com.sale_oto.carshop.dto.response.KhoHangResponse;
import com.sale_oto.carshop.entity.KhoHang;
import com.sale_oto.carshop.service.KhoHangService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kho-hang")
@RequiredArgsConstructor
public class KhoHangController {

    private final KhoHangService khoHangService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<KhoHangResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(khoHangService.getAll()));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<KhoHangResponse>>> getActive() {
        return ResponseEntity.ok(ApiResponse.success(khoHangService.getActive()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<KhoHangResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(khoHangService.getById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<KhoHangResponse>> create(@RequestBody KhoHang request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(khoHangService.create(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<KhoHangResponse>> update(@PathVariable Long id, @RequestBody KhoHang request) {
        return ResponseEntity.ok(ApiResponse.success(khoHangService.update(id, request)));
    }
}
