package com.sale_oto.carshop.service;

import com.sale_oto.carshop.config.VnpayConfig;
import com.sale_oto.carshop.dto.response.VnpayPaymentResponse;
import com.sale_oto.carshop.dto.response.VnpayReturnResponse;
import com.sale_oto.carshop.entity.DonHang;
import com.sale_oto.carshop.entity.ThanhToan;
import com.sale_oto.carshop.enums.LoaiSanPham;
import com.sale_oto.carshop.enums.PhuongThucThanhToan;
import com.sale_oto.carshop.enums.TrangThaiThanhToan;
import com.sale_oto.carshop.exception.BadRequestException;
import com.sale_oto.carshop.exception.ResourceNotFoundException;
import com.sale_oto.carshop.repository.DonHangRepository;
import com.sale_oto.carshop.repository.ThanhToanRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.io.UnsupportedEncodingException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VnpayService {

    private static final ZoneId VNPAY_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");
    private static final DateTimeFormatter VNPAY_TIME_FORMAT = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

    private final VnpayConfig vnpayConfig;
    private final DonHangRepository donHangRepository;
    private final ThanhToanRepository thanhToanRepository;

    public boolean isConfigured() {
        return hasText(vnpayConfig.getPaymentUrl()) && hasText(vnpayConfig.getTmnCode())
                && hasText(vnpayConfig.getHashSecret()) && hasText(vnpayConfig.getReturnUrl());
    }

    @Transactional
    public VnpayPaymentResponse createPaymentUrl(Long donHangId, HttpServletRequest request) {
        ensureConfigured();

        DonHang donHang = donHangRepository.findById(donHangId)
                .orElseThrow(() -> new ResourceNotFoundException("Don hang", donHangId));

        boolean accessoryOnly = donHang.getChiTietDonHangs() != null
                && !donHang.getChiTietDonHangs().isEmpty()
                && donHang.getChiTietDonHangs().stream()
                        .allMatch(ct -> ct.getLoaiSanPham() == LoaiSanPham.PHU_KIEN);
        if (!accessoryOnly) {
            throw new BadRequestException("VNPay hien chi ap dung cho don hang phu kien");
        }

        if (donHang.getTongTien() == null || donHang.getTongTien().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("So tien thanh toan khong hop le");
        }

        LocalDateTime now = LocalDateTime.now(VNPAY_ZONE);
        String txnRef = donHang.getId() + now.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS"));
        String orderInfo = "Thanh toan don hang " + donHang.getMaDonHang().replaceAll("[^A-Za-z0-9]", "");

        Map<String, String> params = new HashMap<>();
        params.put("vnp_Version", "2.1.0");
        params.put("vnp_Command", "pay");
        params.put("vnp_TmnCode", vnpayConfig.getTmnCode());
        params.put("vnp_Amount", toVnpayAmount(donHang.getTongTien()));
        params.put("vnp_CurrCode", "VND");
        params.put("vnp_TxnRef", txnRef);
        params.put("vnp_OrderInfo", orderInfo);
        params.put("vnp_OrderType", "other");
        params.put("vnp_Locale", "vn");
        params.put("vnp_ReturnUrl", vnpayConfig.getReturnUrl());
        params.put("vnp_IpAddr", getClientIp(request));
        params.put("vnp_CreateDate", now.format(VNPAY_TIME_FORMAT));
        params.put("vnp_ExpireDate", now.plusMinutes(15).format(VNPAY_TIME_FORMAT));

        String hashData = buildHashData(params);
        String query = buildQueryData(params);
        String secureHash = hmacSha512(vnpayConfig.getHashSecret(), hashData);
        String paymentUrl = vnpayConfig.getPaymentUrl() + "?" + query + "&vnp_SecureHash=" + secureHash;

        ThanhToan thanhToan = new ThanhToan();
        thanhToan.setDonHang(donHang);
        thanhToan.setSoTien(donHang.getTongTien());
        thanhToan.setPhuongThuc(PhuongThucThanhToan.VNPAY);
        thanhToan.setMaGiaoDich(txnRef);
        thanhToan.setTrangThai(TrangThaiThanhToan.CHO_THANH_TOAN);
        thanhToan.setNoiDung(orderInfo);
        thanhToan.setUrlThanhToan(paymentUrl);
        thanhToanRepository.save(thanhToan);

        return VnpayPaymentResponse.builder()
                .donHangId(donHang.getId())
                .maDonHang(donHang.getMaDonHang())
                .maGiaoDich(txnRef)
                .soTien(donHang.getTongTien())
                .paymentUrl(paymentUrl)
                .build();
    }

    @Transactional
    public VnpayReturnResponse handleReturn(Map<String, String> params) {
        ensureConfigured();

        String secureHash = params.get("vnp_SecureHash");
        String txnRef = params.get("vnp_TxnRef");
        String responseCode = params.get("vnp_ResponseCode");
        String transactionStatus = params.get("vnp_TransactionStatus");

        ThanhToan thanhToan = txnRef == null ? null
                : thanhToanRepository.findByMaGiaoDich(txnRef).orElse(null);

        if (secureHash == null || txnRef == null || thanhToan == null) {
            return buildResult(false, "Khong tim thay giao dich VNPay", thanhToan, txnRef, responseCode,
                    transactionStatus);
        }

        Map<String, String> signedParams = new HashMap<>(params);
        signedParams.remove("vnp_SecureHash");
        signedParams.remove("vnp_SecureHashType");
        String expectedHash = hmacSha512(vnpayConfig.getHashSecret(), buildHashData(signedParams));
        if (!expectedHash.equalsIgnoreCase(secureHash)) {
            return buildResult(false, "Chu ky VNPay khong hop le", thanhToan, txnRef, responseCode, transactionStatus);
        }

        if (!Objects.equals(toVnpayAmount(thanhToan.getSoTien()), params.get("vnp_Amount"))) {
            thanhToan.setTrangThai(TrangThaiThanhToan.THAT_BAI);
            thanhToan.setDuLieuPhanHoi(toJson(params));
            thanhToanRepository.save(thanhToan);
            return buildResult(false, "So tien VNPay tra ve khong khop", thanhToan, txnRef, responseCode,
                    transactionStatus);
        }

        boolean paid = "00".equals(responseCode) && "00".equals(transactionStatus);
        thanhToan.setTrangThai(paid ? TrangThaiThanhToan.DA_THANH_TOAN : TrangThaiThanhToan.THAT_BAI);
        thanhToan.setDuLieuPhanHoi(toJson(params));
        if (paid) {
            thanhToan.setNgayThanhToan(parsePayDate(params.get("vnp_PayDate")));
        }
        thanhToanRepository.save(thanhToan);

        return buildResult(
                paid,
                paid ? "Thanh toan VNPay thanh cong" : "Thanh toan VNPay khong thanh cong",
                thanhToan,
                txnRef,
                responseCode,
                transactionStatus);
    }

    private void ensureConfigured() {
        if (!isConfigured()) {
            throw new BadRequestException("Chua cau hinh VNPAY_TMN_CODE, VNPAY_HASH_SECRET hoac VNPAY_RETURN_URL");
        }
    }

    private VnpayReturnResponse buildResult(boolean success, String message, ThanhToan thanhToan, String txnRef,
            String responseCode, String transactionStatus) {
        DonHang donHang = thanhToan != null ? thanhToan.getDonHang() : null;
        return VnpayReturnResponse.builder()
                .success(success)
                .message(message)
                .donHangId(donHang != null ? donHang.getId() : null)
                .maDonHang(donHang != null ? donHang.getMaDonHang() : null)
                .maGiaoDich(txnRef)
                .responseCode(responseCode)
                .transactionStatus(transactionStatus)
                .build();
    }

    private String buildHashData(Map<String, String> params) {
        return params.entrySet().stream()
                .filter(entry -> hasText(entry.getValue()))
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> entry.getKey() + "=" + encodeAscii(entry.getValue()))
                .collect(Collectors.joining("&"));
    }

    private String buildQueryData(Map<String, String> params) {
        return params.entrySet().stream()
                .filter(entry -> hasText(entry.getValue()))
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> encodeAscii(entry.getKey()) + "=" + encodeAscii(entry.getValue()))
                .collect(Collectors.joining("&"));
    }

    private String hmacSha512(String key, String data) {
        try {
            Mac hmac = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmac.init(secretKey);
            byte[] bytes = hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hash = new StringBuilder(bytes.length * 2);
            for (byte b : bytes) {
                hash.append(String.format("%02x", b & 0xff));
            }
            return hash.toString();
        } catch (Exception e) {
            throw new BadRequestException("Khong the tao chu ky VNPay");
        }
    }

    private String toVnpayAmount(BigDecimal amount) {
        return amount.setScale(0, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .toPlainString();
    }

    private String getClientIp(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (hasText(forwardedFor)) {
            return forwardedFor.split(",")[0].trim();
        }
        String remoteAddr = request.getRemoteAddr();
        if ("0:0:0:0:0:0:0:1".equals(remoteAddr) || "::1".equals(remoteAddr)) {
            return "127.0.0.1";
        }
        return remoteAddr;
    }

    private LocalDateTime parsePayDate(String value) {
        if (!hasText(value)) {
            return LocalDateTime.now(VNPAY_ZONE);
        }
        try {
            return LocalDateTime.parse(value, VNPAY_TIME_FORMAT);
        } catch (Exception ignored) {
            return LocalDateTime.now(VNPAY_ZONE);
        }
    }

    private String toJson(Map<String, String> params) {
        return params.toString();
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }

    private String encodeAscii(String value) {
        try {
            return URLEncoder.encode(value, StandardCharsets.US_ASCII.toString());
        } catch (UnsupportedEncodingException e) {
            throw new BadRequestException("Khong the ma hoa du lieu VNPay");
        }
    }
}
