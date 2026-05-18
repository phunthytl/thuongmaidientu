package com.sale_oto.carshop.controller;

import com.sale_oto.carshop.config.VnpayConfig;
import com.sale_oto.carshop.dto.response.ApiResponse;
import com.sale_oto.carshop.dto.response.VnpayPaymentResponse;
import com.sale_oto.carshop.dto.response.VnpayReturnResponse;
import com.sale_oto.carshop.service.VnpayService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
@RequestMapping("/api/thanh-toan")
@RequiredArgsConstructor
public class ThanhToanController {

    private final VnpayService vnpayService;
    private final VnpayConfig vnpayConfig;

    @GetMapping("/vnpay/configured")
    public ResponseEntity<ApiResponse<Boolean>> isVnpayConfigured() {
        return ResponseEntity.ok(ApiResponse.success(vnpayService.isConfigured()));
    }

    @PostMapping("/vnpay/create/{donHangId}")
    public ResponseEntity<ApiResponse<VnpayPaymentResponse>> createVnpayPayment(
            @PathVariable Long donHangId,
            HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success(vnpayService.createPaymentUrl(donHangId, request)));
    }

    @GetMapping("/vnpay/return")
    public ResponseEntity<Void> handleVnpayReturn(@RequestParam Map<String, String> params) {
        VnpayReturnResponse result = vnpayService.handleReturn(params);
        URI redirectUri = UriComponentsBuilder
                .fromUriString(vnpayConfig.getFrontendReturnUrl())
                .queryParam("success", result.isSuccess())
                .queryParam("orderId", result.getDonHangId())
                .queryParam("maDonHang", result.getMaDonHang())
                .queryParam("maGiaoDich", result.getMaGiaoDich())
                .queryParam("responseCode", result.getResponseCode())
                .queryParam("message", result.getMessage())
                .build()
                .encode(StandardCharsets.UTF_8)
                .toUri();
        return ResponseEntity.status(HttpStatus.FOUND).location(redirectUri).build();
    }
}
