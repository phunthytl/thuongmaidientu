package com.sale_oto.carshop.controller;

import com.sale_oto.carshop.service.GhnService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ghn")
@RequiredArgsConstructor
public class GhnController {

    private final GhnService ghnService;

    @GetMapping("/provinces")
    public ResponseEntity<String> getProvinces() {
        return ResponseEntity.ok(ghnService.getProvinces());
    }

    @GetMapping("/districts")
    public ResponseEntity<String> getDistricts(@RequestParam(required = false) Integer provinceId) {
        return ResponseEntity.ok(ghnService.getDistricts(provinceId));
    }

    @GetMapping("/wards")
    public ResponseEntity<String> getWards(@RequestParam Integer districtId) {
        return ResponseEntity.ok(ghnService.getWards(districtId));
    }

    @PostMapping("/fee")
    public ResponseEntity<String> calculateFee(
            @RequestParam Integer toDistrictId,
            @RequestParam String toWardCode,
            @RequestParam(defaultValue = "500") int weight,
            @RequestParam(defaultValue = "10") int length,
            @RequestParam(defaultValue = "10") int width,
            @RequestParam(defaultValue = "10") int height) {
        
        return ResponseEntity.ok(ghnService.calculateFeeRaw(toDistrictId, toWardCode, weight, length, width, height));
    }
}
