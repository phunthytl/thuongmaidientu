package com.sale_oto.carshop.controller;

import com.sale_oto.carshop.dto.response.ApiResponse;
import com.sale_oto.carshop.dto.response.DashboardResponse;
import com.sale_oto.carshop.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/kpi")
    public ResponseEntity<ApiResponse<DashboardResponse.Kpi>> kpi(
            @RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getKpi(clamp(days))));
    }

    @GetMapping("/revenue-trend")
    public ResponseEntity<ApiResponse<List<DashboardResponse.RevenueTrendPoint>>> revenueTrend(
            @RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getRevenueTrend(clamp(days))));
    }

    @GetMapping("/order-status")
    public ResponseEntity<ApiResponse<List<DashboardResponse.OrderStatusStat>>> orderStatus(
            @RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getOrderStatusStats(clamp(days))));
    }

    @GetMapping("/appointment-status")
    public ResponseEntity<ApiResponse<List<DashboardResponse.AppointmentStatusStat>>> appointmentStatus(
            @RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getAppointmentStatusStats(clamp(days))));
    }

    @GetMapping("/top-products")
    public ResponseEntity<ApiResponse<List<DashboardResponse.TopProduct>>> topProducts(
            @RequestParam(defaultValue = "30") int days,
            @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(ApiResponse.success(
                dashboardService.getTopProducts(clamp(days), Math.max(1, Math.min(limit, 50)))));
    }

    @GetMapping("/recent-orders")
    public ResponseEntity<ApiResponse<List<DashboardResponse.RecentOrder>>> recentOrders() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getRecentOrders()));
    }

    private static int clamp(int days) {
        if (days < 1) return 1;
        if (days > 365) return 365;
        return days;
    }
}
