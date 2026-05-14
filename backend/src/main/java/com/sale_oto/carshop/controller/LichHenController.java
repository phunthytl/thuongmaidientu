package com.sale_oto.carshop.controller;

import com.sale_oto.carshop.dto.request.LichHenRequest;
import com.sale_oto.carshop.dto.response.ApiResponse;
import com.sale_oto.carshop.dto.response.LichHenResponse;
import com.sale_oto.carshop.entity.LichHen;
import com.sale_oto.carshop.service.LichHenService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lich-hen")
@RequiredArgsConstructor
public class LichHenController {

    private final LichHenService lichHenService;

    @PostMapping
    public ResponseEntity<ApiResponse<LichHenResponse>> create(@Valid @RequestBody LichHenRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(lichHenService.create(request)));
    }

    @GetMapping("/my-lich-hen")
    public ResponseEntity<ApiResponse<List<LichHenResponse>>> getMyLichHen() {
        return ResponseEntity.ok(ApiResponse.success(lichHenService.getMyLichHen()));
    }

    @GetMapping("/loai/{loai}")
    public ResponseEntity<ApiResponse<List<LichHenResponse>>> getByLoai(@PathVariable String loai) {
        return ResponseEntity.ok(ApiResponse.success(lichHenService.getAllByLoai(LichHen.LoaiLichHen.valueOf(loai))));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Void>> updateStatus(@PathVariable Long id, @RequestParam String status) {
        lichHenService.updateStatus(id, LichHen.TrangThaiLichHen.valueOf(status));
        return ResponseEntity.ok(ApiResponse.success("Cập nhật trạng thái thành công", null));
    }
}
