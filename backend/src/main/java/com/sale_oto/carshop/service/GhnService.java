package com.sale_oto.carshop.service;

import com.sale_oto.carshop.config.GhnConfig;
import com.sale_oto.carshop.entity.DonHang;
import com.sale_oto.carshop.entity.ChiTietDonHang;
import com.sale_oto.carshop.entity.DiaChiKhachHang;
import com.sale_oto.carshop.entity.KhoHang;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class GhnService {
    
    private final GhnConfig ghnConfig;
    private final RestTemplate restTemplate = new RestTemplate();

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Token", ghnConfig.getToken());
        headers.set("ShopId", String.valueOf(ghnConfig.getShopId()));
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }

    public BigDecimal calculateFee(Integer toDistrictId, String toWardCode, int weight, int length, int width, int height) {
        String url = ghnConfig.getApiUrl() + "/shipping-order/fee";
        
        Map<String, Object> request = new HashMap<>();
        request.put("service_type_id", 2); // 2 = Gói chuẩn (Standard)
        request.put("insurance_value", 0);
        request.put("coupon", null);
        request.put("to_ward_code", toWardCode);
        request.put("to_district_id", toDistrictId);
        request.put("weight", weight);
        request.put("length", length);
        request.put("width", width);
        request.put("height", height);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, createHeaders());

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            Map<String, Object> root = response.getBody();
            if (root != null && String.valueOf(root.get("code")).equals("200")) {
                Map<String, Object> data = (Map<String, Object>) root.get("data");
                if (data != null && data.get("total") != null) {
                    return new BigDecimal(data.get("total").toString());
                }
            }
        } catch (Exception e) {
            log.error("Error calculating GHN fee", e);
        }
        return BigDecimal.ZERO;
    }

    public String createOrder(DonHang donHang) {
        String url = ghnConfig.getApiUrl() + "/shipping-order/create";

        Map<String, Object> request = new HashMap<>();
        request.put("payment_type_id", 1); // 1 = Seller pays phí cho GHN (shop trả). COD KH thanh toán cả gốc + phí
        request.put("cod_amount", donHang.getTongTien().intValue()); // Thu hộ tổng tiền = Tiền phụ kiện + Phí vận chuyển
        request.put("note", donHang.getGhiChu());
        request.put("required_note", "CHOXEMHANGKHONGTHU");
        request.put("client_order_code", donHang.getMaDonHang());
        
        DiaChiKhachHang diaChi = donHang.getDiaChiGiaoHang();
        KhoHang kho = donHang.getKhoXuatHang();

        // ── FROM (Kho xuất hàng) - GHN cần cả tên lẫn mã ID ──
        if (kho != null) {
            request.put("from_name",          kho.getTenKho());
            request.put("from_phone",         kho.getSoDienThoai());
            request.put("from_address",       kho.getDiaChiChiTiet());
            request.put("from_district_id",   kho.getGhnDistrictId());
            request.put("from_ward_code",     kho.getGhnWardCode());
        }

        // ── TO (Địa chỉ giao hàng khách) ──
        request.put("to_name",    diaChi.getTenNguoiNhan());
        request.put("to_phone",   diaChi.getSoDienThoai());
        request.put("to_address", diaChi.getDiaChiChiTiet());

        // GHN cần mã riêng của họ (không phải mã 34 tỉnh mới)
        if (diaChi.getGhnDistrictId() != null && diaChi.getGhnWardCode() != null) {
            request.put("to_district_id", diaChi.getGhnDistrictId());
            request.put("to_ward_code",   diaChi.getGhnWardCode());
        } else {
            // Fallback: dùng mã GHN của kho xuát (tạm thời để test)
            request.put("to_district_id", kho != null ? kho.getGhnDistrictId() : 0);
            request.put("to_ward_code",   kho != null ? kho.getGhnWardCode() : "");
        }
        
        // Tính cân nặng thực tế từ sản phẩm
        int totalWeight = donHang.getChiTietDonHangs().stream()
                .filter(ct -> ct.getLoaiSanPham() == com.sale_oto.carshop.enums.LoaiSanPham.PHU_KIEN && ct.getPhuKien() != null)
                .mapToInt(ct -> ct.getSoLuong() * (ct.getPhuKien().getTrongLuong() != null ? ct.getPhuKien().getTrongLuong() : 500))
                .sum();
        if (totalWeight <= 0) totalWeight = 500; // Default

        request.put("weight", totalWeight);
        request.put("length", 10);
        request.put("width", 10);
        request.put("height", 10);
        
        request.put("service_type_id", 2); // 2 = Giao hàng chuẩn
        request.put("insurance_value", donHang.getTongTien().intValue());

        List<Map<String, Object>> items = new ArrayList<>();
        for (ChiTietDonHang ct : donHang.getChiTietDonHangs()) {
            Map<String, Object> item = new HashMap<>();
            String name = ct.getPhuKien() != null ? ct.getPhuKien().getTenPhuKien() : "Sản phẩm";
            item.put("name", name);
            item.put("quantity", ct.getSoLuong());
            item.put("price", ct.getDonGia().intValue());
            int itemWeight = ct.getPhuKien() != null && ct.getPhuKien().getTrongLuong() != null 
                             ? ct.getPhuKien().getTrongLuong() : 500;
            item.put("weight", itemWeight);
            items.add(item);
        }
        request.put("items", items);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, createHeaders());

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            Map<String, Object> root = response.getBody();
            if (root != null && String.valueOf(root.get("code")).equals("200")) {
                Map<String, Object> data = (Map<String, Object>) root.get("data");
                if (data != null && data.get("order_code") != null) {
                    return data.get("order_code").toString();
                }
            }
            throw new RuntimeException("Tạo đơn lỗi: " + root);
        } catch (Exception e) {
            log.error("Error creating GHN order", e);
            throw new RuntimeException("Lỗi tạo đơn GHN: " + e.getMessage());
        }
    }

    public void cancelOrder(String orderCode) {
        String url = ghnConfig.getApiUrl() + "/switch-status/cancel";
        Map<String, Object> request = new HashMap<>();
        request.put("order_codes", List.of(orderCode));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, createHeaders());
        try {
            restTemplate.postForEntity(url, entity, String.class);
        } catch (Exception e) {
            log.error("Error canceling GHN order", e);
        }
    }

    public String getProvinces() {
        String url = ghnConfig.getApiUrl() + "/master-data/province";
        HttpEntity<String> entity = new HttpEntity<>(createHeaders());
        try {
            return restTemplate.exchange(url, HttpMethod.GET, entity, String.class).getBody();
        } catch (Exception e) {
            log.error("Error getting provinces from GHN", e);
            throw new RuntimeException("Error fetching provinces");
        }
    }

    public String getDistricts(Integer provinceId) {
        String url = ghnConfig.getApiUrl() + "/master-data/district?province_id=" + provinceId;
        HttpEntity<String> entity = new HttpEntity<>(createHeaders());
        try {
            if (provinceId == null) {
                return restTemplate.exchange(ghnConfig.getApiUrl() + "/master-data/district", HttpMethod.GET, entity, String.class).getBody();
            }
            return restTemplate.exchange(url, HttpMethod.GET, entity, String.class).getBody();
        } catch (Exception e) {
            log.error("Error getting districts from GHN", e);
            throw new RuntimeException("Error fetching districts");
        }
    }

    public String getWards(Integer districtId) {
        String url = ghnConfig.getApiUrl() + "/master-data/ward?district_id=" + districtId;
        HttpEntity<String> entity = new HttpEntity<>(createHeaders());
        try {
            return restTemplate.exchange(url, HttpMethod.GET, entity, String.class).getBody();
        } catch (Exception e) {
            log.error("Error getting wards from GHN", e);
            throw new RuntimeException("Error fetching wards");
        }
    }

    public String calculateFeeRaw(Integer toDistrictId, String toWardCode, int weight, int length, int width, int height) {
        String url = ghnConfig.getApiUrl() + "/shipping-order/fee";
        Map<String, Object> request = new HashMap<>();
        request.put("service_type_id", 2); // 2 = Giao chuẩn
        request.put("insurance_value", 0);
        request.put("to_ward_code", toWardCode);
        request.put("to_district_id", toDistrictId);
        request.put("weight", weight);
        request.put("length", length);
        request.put("width", width);
        request.put("height", height);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, createHeaders());
        try {
            return restTemplate.postForEntity(url, entity, String.class).getBody();
        } catch (Exception e) {
            log.error("Error calculating fee raw", e);
            throw new RuntimeException("Error calculating fee");
        }
    }
}
