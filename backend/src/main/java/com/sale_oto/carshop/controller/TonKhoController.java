package com.sale_oto.carshop.controller;

import com.sale_oto.carshop.dto.request.TonKhoRequest;
import com.sale_oto.carshop.dto.response.ApiResponse;
import com.sale_oto.carshop.dto.response.TonKhoResponse;
import com.sale_oto.carshop.service.TonKhoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ton-kho")
@RequiredArgsConstructor
public class TonKhoController {

    private final TonKhoService tonKhoService;

    /**
     * Lấy tồn kho tại TẤT CẢ kho đang hoạt động cho 1 xe.
     * Kho nào hết hàng → soLuong = 0 (frontend sẽ disable).
     */
    @GetMapping("/oto/{otoId}")
    public ResponseEntity<ApiResponse<List<TonKhoResponse>>> getByOto(@PathVariable Long otoId) {
        return ResponseEntity.ok(ApiResponse.success(tonKhoService.getByOtoId(otoId)));
    }

    /**
     * Lấy tồn kho tại TẤT CẢ kho đang hoạt động cho 1 phụ kiện.
     */
    @GetMapping("/phu-kien/{phuKienId}")
    public ResponseEntity<ApiResponse<List<TonKhoResponse>>> getByPhuKien(@PathVariable Long phuKienId) {
        return ResponseEntity.ok(ApiResponse.success(tonKhoService.getByPhuKienId(phuKienId)));
    }

    /**
     * Tạo hoặc cập nhật tồn kho (Admin/NV).
     */
    @PostMapping
    public ResponseEntity<ApiResponse<TonKhoResponse>> upsert(@Valid @RequestBody TonKhoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(tonKhoService.upsert(request)));
    }
}
