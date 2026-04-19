package com.sale_oto.carshop.controller;

import com.sale_oto.carshop.dto.request.ThemVaoGioHangRequest;
import com.sale_oto.carshop.dto.response.ApiResponse;
import com.sale_oto.carshop.dto.response.GioHangResponse;
import com.sale_oto.carshop.service.GioHangService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/gio-hang")
@RequiredArgsConstructor
public class GioHangController {

    private final GioHangService gioHangService;

    @PostMapping("/them")
    public ResponseEntity<ApiResponse<GioHangResponse>> themVaoGio(
            @Valid @RequestBody ThemVaoGioHangRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(gioHangService.themVaoGio(request)));
    }

    @GetMapping("/khach-hang/{khachHangId}")
    public ResponseEntity<ApiResponse<GioHangResponse>> getByKhachHang(@PathVariable Long khachHangId) {
        return ResponseEntity.ok(ApiResponse.success(gioHangService.getByKhachHang(khachHangId)));
    }
}
