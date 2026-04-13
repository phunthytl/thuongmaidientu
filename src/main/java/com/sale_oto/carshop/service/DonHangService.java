package com.sale_oto.carshop.service;

import com.sale_oto.carshop.dto.request.ChiTietDonHangRequest;
import com.sale_oto.carshop.dto.request.DonHangRequest;
import com.sale_oto.carshop.dto.response.ChiTietDonHangResponse;
import com.sale_oto.carshop.dto.response.DiaChiResponse;
import com.sale_oto.carshop.dto.response.DonHangResponse;
import com.sale_oto.carshop.entity.*;
import com.sale_oto.carshop.enums.LoaiSanPham;
import com.sale_oto.carshop.enums.TrangThaiDonHang;
import com.sale_oto.carshop.exception.ResourceNotFoundException;
import com.sale_oto.carshop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DonHangService {

    private final DonHangRepository donHangRepository;
    private final KhachHangRepository khachHangRepository;
    private final NhanVienRepository nhanVienRepository;
    private final OToRepository oToRepository;
    private final PhuKienRepository phuKienRepository;
    private final DichVuRepository dichVuRepository;
    private final DiaChiKhachHangRepository diaChiKhachHangRepository;
    private final GhnService ghnService;

    @Transactional
    public List<DonHangResponse> create(DonHangRequest request) {
        KhachHang khachHang = khachHangRepository.findById(request.getKhachHangId())
                .orElseThrow(() -> new ResourceNotFoundException("Khách hàng", request.getKhachHangId()));

        DiaChiKhachHang diaChi = null;
        if (request.getDiaChiGiaoHangId() != null) {
            diaChi = diaChiKhachHangRepository.findById(request.getDiaChiGiaoHangId())
                    .orElseThrow(() -> new ResourceNotFoundException("Địa chỉ", request.getDiaChiGiaoHangId()));
        }

        List<ChiTietDonHangRequest> phuKienList = new ArrayList<>();
        List<ChiTietDonHangRequest> khacList = new ArrayList<>();

        for (ChiTietDonHangRequest ct : request.getChiTietDonHangs()) {
            if (ct.getLoaiSanPham() == LoaiSanPham.PHU_KIEN) {
                phuKienList.add(ct);
            } else {
                khacList.add(ct);
            }
        }

        List<DonHangResponse> responses = new ArrayList<>();

        if (!phuKienList.isEmpty()) {
            DonHang dh1 = createSingleOrder(khachHang, diaChi, phuKienList, request.getGhiChu());
            responses.add(toResponse(dh1));
        }

        if (!khacList.isEmpty()) {
            DonHang dh2 = createSingleOrder(khachHang, diaChi, khacList, request.getGhiChu());
            responses.add(toResponse(dh2));
        }

        return responses;
    }

    private DonHang createSingleOrder(KhachHang khachHang, DiaChiKhachHang diaChi, List<ChiTietDonHangRequest> items, String ghiChu) {
        DonHang donHang = new DonHang();
        donHang.setMaDonHang(generateMaDonHang());
        donHang.setKhachHang(khachHang);
        donHang.setTrangThai(TrangThaiDonHang.CHO_XAC_NHAN);
        donHang.setGhiChu(ghiChu);
        donHang.setDiaChiGiaoHang(diaChi);

        List<ChiTietDonHang> chiTietList = new ArrayList<>();
        BigDecimal tongTien = BigDecimal.ZERO;

        for (ChiTietDonHangRequest ctRequest : items) {
            ChiTietDonHang chiTiet = new ChiTietDonHang();
            chiTiet.setDonHang(donHang);
            chiTiet.setLoaiSanPham(ctRequest.getLoaiSanPham());
            chiTiet.setSoLuong(ctRequest.getSoLuong());

            BigDecimal donGia = resolveProductAndPrice(chiTiet, ctRequest);
            chiTiet.setDonGia(donGia);
            chiTiet.setThanhTien(donGia.multiply(BigDecimal.valueOf(ctRequest.getSoLuong())));

            tongTien = tongTien.add(chiTiet.getThanhTien());
            chiTietList.add(chiTiet);
        }

        donHang.setTongTien(tongTien);
        
        boolean isPhuKienOrder = items.stream().anyMatch(i -> i.getLoaiSanPham() == LoaiSanPham.PHU_KIEN);
        if (isPhuKienOrder && diaChi != null) {
            int totalWeight = donHang.getChiTietDonHangs().stream()
                    .filter(ct -> ct.getLoaiSanPham() == LoaiSanPham.PHU_KIEN && ct.getPhuKien() != null)
                    .mapToInt(ct -> ct.getSoLuong() * (ct.getPhuKien().getTrongLuong() != null ? ct.getPhuKien().getTrongLuong() : 500))
                    .sum();
            if (totalWeight <= 0) totalWeight = 500; // Tránh lỗi cân nặng = 0

            BigDecimal phiVanChuyen = ghnService.calculateFee(
                null, null, totalWeight, 10, 10, 10);
            donHang.setPhiVanChuyen(phiVanChuyen);
            donHang.setTongTien(donHang.getTongTien().add(phiVanChuyen));
        }
        
        donHang.setChiTietDonHangs(chiTietList);
        return donHangRepository.save(donHang);
    }

    @Transactional(readOnly = true)
    public DonHangResponse getById(Long id) {
        DonHang donHang = donHangRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn hàng", id));
        return toResponse(donHang);
    }

    @Transactional(readOnly = true)
    public DonHangResponse getByMaDonHang(String maDonHang) {
        DonHang donHang = donHangRepository.findByMaDonHang(maDonHang)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn hàng không tìm thấy: " + maDonHang));
        return toResponse(donHang);
    }

    @Transactional(readOnly = true)
    public Page<DonHangResponse> getAll(Pageable pageable) {
        return donHangRepository.findAll(pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<DonHangResponse> getByKhachHang(Long khachHangId, Pageable pageable) {
        return donHangRepository.findByKhachHangId(khachHangId, pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<DonHangResponse> getByTrangThai(TrangThaiDonHang trangThai, Pageable pageable) {
        return donHangRepository.findByTrangThai(trangThai, pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<DonHangResponse> search(String keyword, Pageable pageable) {
        return donHangRepository.search(keyword, pageable).map(this::toResponse);
    }

    @Transactional
    public DonHangResponse capNhatTrangThai(Long id, TrangThaiDonHang trangThai) {
        DonHang donHang = donHangRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn hàng", id));
                
        if (trangThai == TrangThaiDonHang.DA_XAC_NHAN && donHang.getMaDonHangGhn() == null) {
            boolean hasPhuKien = donHang.getChiTietDonHangs().stream()
                    .anyMatch(ct -> ct.getLoaiSanPham() == LoaiSanPham.PHU_KIEN);
            if (hasPhuKien && donHang.getDiaChiGiaoHang() != null) {
                String orderCode = ghnService.createOrder(donHang);
                donHang.setMaDonHangGhn(orderCode);
            }
        }
        
        if (trangThai == TrangThaiDonHang.DA_HUY && donHang.getMaDonHangGhn() != null) {
            ghnService.cancelOrder(donHang.getMaDonHangGhn());
        }

        donHang.setTrangThai(trangThai);
        donHang = donHangRepository.save(donHang);
        return toResponse(donHang);
    }

    @Transactional
    public DonHangResponse ganNhanVien(Long donHangId, Long nhanVienId) {
        DonHang donHang = donHangRepository.findById(donHangId)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn hàng", donHangId));
        NhanVien nhanVien = nhanVienRepository.findById(nhanVienId)
                .orElseThrow(() -> new ResourceNotFoundException("Nhân viên", nhanVienId));
        donHang.setNhanVienXuLy(nhanVien);
        donHang = donHangRepository.save(donHang);
        return toResponse(donHang);
    }

    private BigDecimal resolveProductAndPrice(ChiTietDonHang chiTiet, ChiTietDonHangRequest request) {
        return switch (request.getLoaiSanPham()) {
            case OTO -> {
                OTo oto = oToRepository.findById(request.getOtoId())
                        .orElseThrow(() -> new ResourceNotFoundException("Ô tô", request.getOtoId()));
                chiTiet.setOto(oto);
                yield oto.getGia();
            }
            case PHU_KIEN -> {
                PhuKien pk = phuKienRepository.findById(request.getPhuKienId())
                        .orElseThrow(() -> new ResourceNotFoundException("Phụ kiện", request.getPhuKienId()));
                chiTiet.setPhuKien(pk);
                yield pk.getGia();
            }
            case DICH_VU -> {
                DichVu dv = dichVuRepository.findById(request.getDichVuId())
                        .orElseThrow(() -> new ResourceNotFoundException("Dịch vụ", request.getDichVuId()));
                chiTiet.setDichVu(dv);
                yield dv.getGia();
            }
        };
    }

    private String generateMaDonHang() {
        return "DH-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private DonHangResponse toResponse(DonHang dh) {
        List<ChiTietDonHangResponse> chiTietResponses = dh.getChiTietDonHangs() != null
                ? dh.getChiTietDonHangs().stream().map(this::toChiTietResponse).collect(Collectors.toList())
                : List.of();

        DiaChiResponse diaChiRes = null;
        if (dh.getDiaChiGiaoHang() != null) {
            diaChiRes = DiaChiResponse.builder()
                    .id(dh.getDiaChiGiaoHang().getId())
                    .tenNguoiNhan(dh.getDiaChiGiaoHang().getTenNguoiNhan())
                    .soDienThoai(dh.getDiaChiGiaoHang().getSoDienThoai())
                    .tinhThanhId(dh.getDiaChiGiaoHang().getTinhThanhId())
                    .tinhThanhTen(dh.getDiaChiGiaoHang().getTinhThanhTen())
                    .xaPhuongId(dh.getDiaChiGiaoHang().getXaPhuongId())
                    .xaPhuongTen(dh.getDiaChiGiaoHang().getXaPhuongTen())
                    .diaChiChiTiet(dh.getDiaChiGiaoHang().getDiaChiChiTiet())
                    .isDefault(dh.getDiaChiGiaoHang().getIsDefault())
                    .build();
        }

        return DonHangResponse.builder()
                .id(dh.getId())
                .maDonHang(dh.getMaDonHang())
                .tenKhachHang(dh.getKhachHang().getHoTen())
                .khachHangId(dh.getKhachHang().getId())
                .soDienThoaiKhachHang(dh.getKhachHang().getSoDienThoai())
                .emailKhachHang(dh.getKhachHang().getEmail())
                .tenNhanVienXuLy(dh.getNhanVienXuLy() != null ? dh.getNhanVienXuLy().getHoTen() : null)
                .nhanVienXuLyId(dh.getNhanVienXuLy() != null ? dh.getNhanVienXuLy().getId() : null)
                .tongTien(dh.getTongTien())
                .trangThai(dh.getTrangThai())
                .ghiChu(dh.getGhiChu())
                .phiVanChuyen(dh.getPhiVanChuyen())
                .maDonHangGhn(dh.getMaDonHangGhn())
                .diaChiGiaoHang(diaChiRes)
                .chiTietDonHangs(chiTietResponses)
                .ngayTao(dh.getNgayTao())
                .ngayCapNhat(dh.getNgayCapNhat())
                .build();
    }

    private ChiTietDonHangResponse toChiTietResponse(ChiTietDonHang ct) {
        String tenSanPham = switch (ct.getLoaiSanPham()) {
            case OTO -> ct.getOto() != null ? ct.getOto().getTenXe() : "";
            case PHU_KIEN -> ct.getPhuKien() != null ? ct.getPhuKien().getTenPhuKien() : "";
            case DICH_VU -> ct.getDichVu() != null ? ct.getDichVu().getTenDichVu() : "";
        };

        Long sanPhamId = switch (ct.getLoaiSanPham()) {
            case OTO -> ct.getOto() != null ? ct.getOto().getId() : null;
            case PHU_KIEN -> ct.getPhuKien() != null ? ct.getPhuKien().getId() : null;
            case DICH_VU -> ct.getDichVu() != null ? ct.getDichVu().getId() : null;
        };

        return ChiTietDonHangResponse.builder()
                .id(ct.getId())
                .loaiSanPham(ct.getLoaiSanPham())
                .tenSanPham(tenSanPham)
                .sanPhamId(sanPhamId)
                .soLuong(ct.getSoLuong())
                .donGia(ct.getDonGia())
                .thanhTien(ct.getThanhTien())
                .build();
    }
}
