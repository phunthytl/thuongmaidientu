package com.sale_oto.carshop.service;

import com.sale_oto.carshop.dto.request.ChiTietDonHangRequest;
import com.sale_oto.carshop.dto.request.DonHangRequest;
import com.sale_oto.carshop.dto.response.ChiTietDonHangResponse;
import com.sale_oto.carshop.dto.response.DonHangResponse;
import com.sale_oto.carshop.entity.*;
import com.sale_oto.carshop.enums.LoaiSanPham;
import com.sale_oto.carshop.enums.TrangThaiDonHang;
import com.sale_oto.carshop.exception.BadRequestException;
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

    @Transactional
    public DonHangResponse create(DonHangRequest request) {
        KhachHang khachHang = khachHangRepository.findById(request.getKhachHangId())
                .orElseThrow(() -> new ResourceNotFoundException("Khách hàng", request.getKhachHangId()));

        DonHang donHang = new DonHang();
        donHang.setMaDonHang(generateMaDonHang());
        donHang.setKhachHang(khachHang);
        donHang.setTrangThai(TrangThaiDonHang.CHO_XAC_NHAN);
        donHang.setGhiChu(request.getGhiChu());
        donHang.setDiaChiGiaoHang(request.getDiaChiGiaoHang() != null
                ? request.getDiaChiGiaoHang() : khachHang.getDiaChi());

        List<ChiTietDonHang> chiTietList = new ArrayList<>();
        BigDecimal tongTien = BigDecimal.ZERO;

        for (ChiTietDonHangRequest ctRequest : request.getChiTietDonHangs()) {
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
        donHang.setChiTietDonHangs(chiTietList);

        donHang = donHangRepository.save(donHang);
        return toResponse(donHang);
    }

    public DonHangResponse getById(Long id) {
        DonHang donHang = donHangRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn hàng", id));
        return toResponse(donHang);
    }

    public DonHangResponse getByMaDonHang(String maDonHang) {
        DonHang donHang = donHangRepository.findByMaDonHang(maDonHang)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn hàng không tìm thấy: " + maDonHang));
        return toResponse(donHang);
    }

    public Page<DonHangResponse> getAll(Pageable pageable) {
        return donHangRepository.findAll(pageable).map(this::toResponse);
    }

    public Page<DonHangResponse> getByKhachHang(Long khachHangId, Pageable pageable) {
        return donHangRepository.findByKhachHangId(khachHangId, pageable).map(this::toResponse);
    }

    public Page<DonHangResponse> getByTrangThai(TrangThaiDonHang trangThai, Pageable pageable) {
        return donHangRepository.findByTrangThai(trangThai, pageable).map(this::toResponse);
    }

    public Page<DonHangResponse> search(String keyword, Pageable pageable) {
        return donHangRepository.search(keyword, pageable).map(this::toResponse);
    }

    @Transactional
    public DonHangResponse capNhatTrangThai(Long id, TrangThaiDonHang trangThai) {
        DonHang donHang = donHangRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn hàng", id));
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

        return DonHangResponse.builder()
                .id(dh.getId())
                .maDonHang(dh.getMaDonHang())
                .tenKhachHang(dh.getKhachHang().getHoTen())
                .khachHangId(dh.getKhachHang().getId())
                .tenNhanVienXuLy(dh.getNhanVienXuLy() != null ? dh.getNhanVienXuLy().getHoTen() : null)
                .nhanVienXuLyId(dh.getNhanVienXuLy() != null ? dh.getNhanVienXuLy().getId() : null)
                .tongTien(dh.getTongTien())
                .trangThai(dh.getTrangThai())
                .ghiChu(dh.getGhiChu())
                .diaChiGiaoHang(dh.getDiaChiGiaoHang())
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
