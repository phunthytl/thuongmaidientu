package com.sale_oto.carshop.service;

import com.sale_oto.carshop.dto.request.KhieuNaiRequest;
import com.sale_oto.carshop.entity.DonHang;
import com.sale_oto.carshop.entity.KhachHang;
import com.sale_oto.carshop.entity.KhieuNai;
import com.sale_oto.carshop.entity.NhanVien;
import com.sale_oto.carshop.enums.TrangThaiKhieuNai;
import com.sale_oto.carshop.exception.ResourceNotFoundException;
import com.sale_oto.carshop.repository.DonHangRepository;
import com.sale_oto.carshop.repository.KhachHangRepository;
import com.sale_oto.carshop.repository.KhieuNaiRepository;
import com.sale_oto.carshop.repository.NhanVienRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class KhieuNaiService {

    private final KhieuNaiRepository khieuNaiRepository;
    private final KhachHangRepository khachHangRepository;
    private final DonHangRepository donHangRepository;
    private final NhanVienRepository nhanVienRepository;

    @Transactional
    public KhieuNai create(KhieuNaiRequest request) {
        KhachHang khachHang = khachHangRepository.findById(request.getKhachHangId())
                .orElseThrow(() -> new ResourceNotFoundException("Khách hàng", request.getKhachHangId()));

        KhieuNai khieuNai = new KhieuNai();
        khieuNai.setKhachHang(khachHang);
        khieuNai.setTieuDe(request.getTieuDe());
        khieuNai.setNoiDung(request.getNoiDung());
        khieuNai.setTrangThai(TrangThaiKhieuNai.MOI);

        if (request.getDonHangId() != null) {
            DonHang donHang = donHangRepository.findById(request.getDonHangId())
                    .orElseThrow(() -> new ResourceNotFoundException("Đơn hàng", request.getDonHangId()));
            khieuNai.setDonHang(donHang);
        }

        return khieuNaiRepository.save(khieuNai);
    }

    public KhieuNai getById(Long id) {
        return khieuNaiRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Khiếu nại", id));
    }

    public Page<KhieuNai> getAll(Pageable pageable) {
        return khieuNaiRepository.findAll(pageable);
    }

    public Page<KhieuNai> getByKhachHang(Long khachHangId, Pageable pageable) {
        return khieuNaiRepository.findByKhachHangId(khachHangId, pageable);
    }

    public Page<KhieuNai> getByTrangThai(TrangThaiKhieuNai trangThai, Pageable pageable) {
        return khieuNaiRepository.findByTrangThai(trangThai, pageable);
    }

    @Transactional
    public KhieuNai phanHoi(Long id, String phanHoi, Long nhanVienId) {
        KhieuNai khieuNai = getById(id);
        NhanVien nhanVien = nhanVienRepository.findById(nhanVienId)
                .orElseThrow(() -> new ResourceNotFoundException("Nhân viên", nhanVienId));

        khieuNai.setPhanHoi(phanHoi);
        khieuNai.setNhanVienXuLy(nhanVien);
        khieuNai.setTrangThai(TrangThaiKhieuNai.DA_GIAI_QUYET);

        return khieuNaiRepository.save(khieuNai);
    }

    @Transactional
    public KhieuNai capNhatTrangThai(Long id, TrangThaiKhieuNai trangThai) {
        KhieuNai khieuNai = getById(id);
        khieuNai.setTrangThai(trangThai);
        return khieuNaiRepository.save(khieuNai);
    }
}
