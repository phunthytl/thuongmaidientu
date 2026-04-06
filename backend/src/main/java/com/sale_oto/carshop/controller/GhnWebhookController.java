package com.sale_oto.carshop.controller;

import com.sale_oto.carshop.entity.DonHang;
import com.sale_oto.carshop.enums.TrangThaiDonHang;
import com.sale_oto.carshop.repository.DonHangRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/webhook/ghn")
@RequiredArgsConstructor
@Slf4j
public class GhnWebhookController {

    private final DonHangRepository donHangRepository;

    @PostMapping
    @Transactional
    public ResponseEntity<String> handleWebhook(@RequestBody java.util.Map<String, Object> payload) {
        try {
            String orderCode = payload.get("OrderCode") != null ? payload.get("OrderCode").toString() : null;
            String status = payload.get("Status") != null ? payload.get("Status").toString() : null;

            if (orderCode == null || status == null) {
                return ResponseEntity.badRequest().body("Invalid payload");
            }

            donHangRepository.findByMaDonHangGhn(orderCode).ifPresent(donHang -> {
                switch (status) {
                    case "delivered":
                        donHang.setTrangThai(TrangThaiDonHang.HOAN_THANH);
                        log.info("Cập nhật đơn {} thành hoàn thành qua GHN Webhook", orderCode);
                        break;
                    case "cancel":
                    case "returned":
                        donHang.setTrangThai(TrangThaiDonHang.DA_HUY);
                        log.info("Cập nhật đơn {} thành đã hủy qua GHN Webhook", orderCode);
                        break;
                    default:
                        log.info("GHN Webhook status '{}' ignored for order {}", status, orderCode);
                }
            });
            return ResponseEntity.ok("Received");
        } catch (Exception e) {
            log.error("Lỗi xử lý GHN Webhook", e);
            return ResponseEntity.badRequest().body("Error processing webhook");
        }
    }
}
