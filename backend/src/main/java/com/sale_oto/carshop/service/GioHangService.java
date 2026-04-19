package com.sale_oto.carshop.service;

import com.sale_oto.carshop.dto.request.ThemVaoGioHangRequest;
import com.sale_oto.carshop.dto.response.ChiTietGioHangResponse;
import com.sale_oto.carshop.dto.response.GioHangResponse;
import com.sale_oto.carshop.entity.ChiTietGioHang;
import com.sale_oto.carshop.entity.DichVu;
import com.sale_oto.carshop.entity.GioHang;
import com.sale_oto.carshop.entity.KhachHang;
import com.sale_oto.carshop.entity.OTo;
import com.sale_oto.carshop.entity.PhuKien;
import com.sale_oto.carshop.enums.LoaiSanPham;
import com.sale_oto.carshop.enums.TrangThaiOTo;
import com.sale_oto.carshop.exception.BadRequestException;
import com.sale_oto.carshop.exception.ResourceNotFoundException;
import com.sale_oto.carshop.repository.ChiTietGioHangRepository;
import com.sale_oto.carshop.repository.DichVuRepository;
import com.sale_oto.carshop.repository.GioHangRepository;
import com.sale_oto.carshop.repository.KhachHangRepository;
import com.sale_oto.carshop.repository.OToRepository;
import com.sale_oto.carshop.repository.PhuKienRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GioHangService {

    private final GioHangRepository gioHangRepository;
    private final ChiTietGioHangRepository chiTietGioHangRepository;
    private final KhachHangRepository khachHangRepository;
    private final OToRepository oToRepository;
    private final PhuKienRepository phuKienRepository;
    private final DichVuRepository dichVuRepository;

    @Transactional
    public GioHangResponse themVaoGio(ThemVaoGioHangRequest request) {
        KhachHang khachHang = khachHangRepository.findById(request.getKhachHangId())
                .orElseThrow(() -> new ResourceNotFoundException("Khách hàng", request.getKhachHangId()));

        if (!Boolean.TRUE.equals(khachHang.getTrangThai())) {
            throw new BadRequestException("Tài khoản khách hàng đã bị khóa");
        }

        GioHang gioHang = gioHangRepository.findByKhachHangId(khachHang.getId())
                .orElseGet(() -> {
                    GioHang gioHangMoi = new GioHang();
                    gioHangMoi.setKhachHang(khachHang);
                    gioHangMoi.setTongTien(BigDecimal.ZERO);
                    gioHangMoi.setChiTietGioHangs(new ArrayList<>());
                    return gioHangRepository.save(gioHangMoi);
                });

        ChiTietGioHang chiTiet = timChiTietTrung(gioHang.getId(), request)
                .orElseGet(() -> taoChiTietMoi(gioHang, request.getLoaiSanPham()));

        BigDecimal donGia = resolveProductAndPrice(chiTiet, request);

        int soLuongMoi = (chiTiet.getId() == null ? 0 : chiTiet.getSoLuong()) + request.getSoLuong();
        validateAvailability(chiTiet, soLuongMoi);

        chiTiet.setSoLuong(soLuongMoi);
        chiTiet.setDonGia(donGia);
        chiTiet.setThanhTien(donGia.multiply(BigDecimal.valueOf(soLuongMoi)));
        chiTietGioHangRepository.save(chiTiet);

        capNhatTongTien(gioHang);
        return getByKhachHang(khachHang.getId());
    }

    @Transactional(readOnly = true)
    public GioHangResponse getByKhachHang(Long khachHangId) {
        KhachHang khachHang = khachHangRepository.findById(khachHangId)
                .orElseThrow(() -> new ResourceNotFoundException("Khách hàng", khachHangId));

        Optional<GioHang> gioHangOpt = gioHangRepository.findByKhachHangId(khachHangId);
        if (gioHangOpt.isEmpty()) {
            return GioHangResponse.builder()
                    .id(null)
                    .khachHangId(khachHang.getId())
                    .tenKhachHang(khachHang.getHoTen())
                    .tongTien(BigDecimal.ZERO)
                    .chiTietGioHangs(List.of())
                    .build();
        }

        return toResponse(gioHangOpt.get());
    }

    private ChiTietGioHang taoChiTietMoi(GioHang gioHang, LoaiSanPham loaiSanPham) {
        ChiTietGioHang chiTiet = new ChiTietGioHang();
        chiTiet.setGioHang(gioHang);
        chiTiet.setLoaiSanPham(loaiSanPham);
        return chiTiet;
    }

    private Optional<ChiTietGioHang> timChiTietTrung(Long gioHangId, ThemVaoGioHangRequest request) {
        return chiTietGioHangRepository.findByGioHangId(gioHangId).stream()
                .filter(item -> item.getLoaiSanPham() == request.getLoaiSanPham())
                .filter(item -> switch (request.getLoaiSanPham()) {
                    case OTO -> item.getOto() != null && item.getOto().getId().equals(request.getOtoId());
                    case PHU_KIEN -> item.getPhuKien() != null && item.getPhuKien().getId().equals(request.getPhuKienId());
                    case DICH_VU -> item.getDichVu() != null && item.getDichVu().getId().equals(request.getDichVuId());
                })
                .findFirst();
    }

    private BigDecimal resolveProductAndPrice(ChiTietGioHang chiTiet, ThemVaoGioHangRequest request) {
        return switch (request.getLoaiSanPham()) {
            case OTO -> {
                if (request.getOtoId() == null) {
                    throw new BadRequestException("otoId không được để trống");
                }
                OTo oto = oToRepository.findById(request.getOtoId())
                        .orElseThrow(() -> new ResourceNotFoundException("Ô tô", request.getOtoId()));
                chiTiet.setOto(oto);
                chiTiet.setPhuKien(null);
                chiTiet.setDichVu(null);
                yield oto.getGia();
            }
            case PHU_KIEN -> {
                if (request.getPhuKienId() == null) {
                    throw new BadRequestException("phuKienId không được để trống");
                }
                PhuKien phuKien = phuKienRepository.findById(request.getPhuKienId())
                        .orElseThrow(() -> new ResourceNotFoundException("Phụ kiện", request.getPhuKienId()));
                chiTiet.setPhuKien(phuKien);
                chiTiet.setOto(null);
                chiTiet.setDichVu(null);
                yield phuKien.getGia();
            }
            case DICH_VU -> {
                if (request.getDichVuId() == null) {
                    throw new BadRequestException("dichVuId không được để trống");
                }
                DichVu dichVu = dichVuRepository.findById(request.getDichVuId())
                        .orElseThrow(() -> new ResourceNotFoundException("Dịch vụ", request.getDichVuId()));
                chiTiet.setDichVu(dichVu);
                chiTiet.setOto(null);
                chiTiet.setPhuKien(null);
                yield dichVu.getGia();
            }
        };
    }

    private void validateAvailability(ChiTietGioHang chiTiet, int soLuongMoi) {
        switch (chiTiet.getLoaiSanPham()) {
            case OTO -> {
                OTo oto = chiTiet.getOto();
                if (oto == null) {
                    throw new BadRequestException("Sản phẩm ô tô không hợp lệ");
                }
                if (oto.getTrangThai() != TrangThaiOTo.DANG_BAN) {
                    throw new BadRequestException("Ô tô hiện không còn kinh doanh");
                }
                if (oto.getSoLuong() == null || oto.getSoLuong() < soLuongMoi) {
                    throw new BadRequestException("Số lượng ô tô trong kho không đủ");
                }
            }
            case PHU_KIEN -> {
                PhuKien phuKien = chiTiet.getPhuKien();
                if (phuKien == null) {
                    throw new BadRequestException("Phụ kiện không hợp lệ");
                }
                if (!Boolean.TRUE.equals(phuKien.getTrangThai())) {
                    throw new BadRequestException("Phụ kiện hiện không còn kinh doanh");
                }
                if (phuKien.getSoLuong() == null || phuKien.getSoLuong() < soLuongMoi) {
                    throw new BadRequestException("Số lượng phụ kiện trong kho không đủ");
                }
            }
            case DICH_VU -> {
                DichVu dichVu = chiTiet.getDichVu();
                if (dichVu == null) {
                    throw new BadRequestException("Dịch vụ không hợp lệ");
                }
                if (!Boolean.TRUE.equals(dichVu.getTrangThai())) {
                    throw new BadRequestException("Dịch vụ hiện không còn kinh doanh");
                }
            }
        }
    }

    private void capNhatTongTien(GioHang gioHang) {
        List<ChiTietGioHang> chiTietList = chiTietGioHangRepository.findByGioHangId(gioHang.getId());
        BigDecimal tongTien = chiTietList.stream()
                .map(ChiTietGioHang::getThanhTien)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        gioHang.setTongTien(tongTien);
        gioHangRepository.save(gioHang);
    }

    private GioHangResponse toResponse(GioHang gioHang) {
        List<ChiTietGioHang> chiTietList = chiTietGioHangRepository.findByGioHangId(gioHang.getId());
        List<ChiTietGioHangResponse> responseList = chiTietList.stream()
                .map(this::toChiTietResponse)
                .toList();

        return GioHangResponse.builder()
                .id(gioHang.getId())
                .khachHangId(gioHang.getKhachHang().getId())
                .tenKhachHang(gioHang.getKhachHang().getHoTen())
                .tongTien(gioHang.getTongTien())
                .chiTietGioHangs(responseList)
                .build();
    }

    private ChiTietGioHangResponse toChiTietResponse(ChiTietGioHang chiTiet) {
        String tenSanPham = switch (chiTiet.getLoaiSanPham()) {
            case OTO -> chiTiet.getOto() != null ? chiTiet.getOto().getTenXe() : "";
            case PHU_KIEN -> chiTiet.getPhuKien() != null ? chiTiet.getPhuKien().getTenPhuKien() : "";
            case DICH_VU -> chiTiet.getDichVu() != null ? chiTiet.getDichVu().getTenDichVu() : "";
        };

        Long sanPhamId = switch (chiTiet.getLoaiSanPham()) {
            case OTO -> chiTiet.getOto() != null ? chiTiet.getOto().getId() : null;
            case PHU_KIEN -> chiTiet.getPhuKien() != null ? chiTiet.getPhuKien().getId() : null;
            case DICH_VU -> chiTiet.getDichVu() != null ? chiTiet.getDichVu().getId() : null;
        };

        return ChiTietGioHangResponse.builder()
                .id(chiTiet.getId())
                .loaiSanPham(chiTiet.getLoaiSanPham())
                .sanPhamId(sanPhamId)
                .tenSanPham(tenSanPham)
                .soLuong(chiTiet.getSoLuong())
                .donGia(chiTiet.getDonGia())
                .thanhTien(chiTiet.getThanhTien())
                .build();
    }
}
