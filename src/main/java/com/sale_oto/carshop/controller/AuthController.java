package com.sale_oto.carshop.controller;

import com.sale_oto.carshop.dto.request.DangKyRequest;
import com.sale_oto.carshop.dto.request.DangNhapRequest;
import com.sale_oto.carshop.dto.request.RefreshTokenRequest;
import com.sale_oto.carshop.dto.response.ApiResponse;
import com.sale_oto.carshop.dto.response.AuthResponse;
import com.sale_oto.carshop.dto.response.NguoiDungResponse;
import com.sale_oto.carshop.security.CustomUserDetails;
import com.sale_oto.carshop.service.NguoiDungService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final NguoiDungService nguoiDungService;

    @PostMapping("/dang-nhap")
    public ResponseEntity<ApiResponse<AuthResponse>> dangNhap(@Valid @RequestBody DangNhapRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Đăng nhập thành công", nguoiDungService.dangNhap(request)));
    }

    @PostMapping("/dang-ky")
    public ResponseEntity<ApiResponse<AuthResponse>> dangKy(@Valid @RequestBody DangKyRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(nguoiDungService.dangKy(request)));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Làm mới token thành công",
                nguoiDungService.refreshToken(request.getRefreshToken())));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<NguoiDungResponse>> getCurrentUser(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(nguoiDungService.getById(userDetails.getId())));
    }
}
