package com.sale_oto.carshop.controller;

import com.sale_oto.carshop.dto.request.DiaChiRequest;
import com.sale_oto.carshop.dto.response.DiaChiResponse;
import com.sale_oto.carshop.service.DiaChiKhachHangService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/khach-hang/{khachHangId}/dia-chi")
@RequiredArgsConstructor
public class DiaChiKhachHangController {

    private final DiaChiKhachHangService diaChiKhachHangService;

    @GetMapping
    public ResponseEntity<List<DiaChiResponse>> getDanhSachDiaChi(@PathVariable Long khachHangId) {
        return ResponseEntity.ok(diaChiKhachHangService.getByKhachHangId(khachHangId));
    }

    @PostMapping
    public ResponseEntity<DiaChiResponse> createDiaChi(
            @PathVariable Long khachHangId,
            @Valid @RequestBody DiaChiRequest request) {
        DiaChiResponse response = diaChiKhachHangService.create(khachHangId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DiaChiResponse> updateDiaChi(
            @PathVariable Long khachHangId, // Tương thích đường dẫn cha (có thể không dùng trong hàm)
            @PathVariable Long id,
            @Valid @RequestBody DiaChiRequest request) {
        return ResponseEntity.ok(diaChiKhachHangService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDiaChi(
            @PathVariable Long khachHangId,
            @PathVariable Long id) {
        diaChiKhachHangService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
