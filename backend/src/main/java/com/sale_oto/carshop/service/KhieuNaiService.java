package com.sale_oto.carshop.service;

import com.sale_oto.carshop.dto.request.KhieuNaiRequest;
import com.sale_oto.carshop.dto.response.KhieuNaiResponse;
import com.sale_oto.carshop.entity.DonHang;
import com.sale_oto.carshop.entity.KhachHang;
import com.sale_oto.carshop.entity.KhieuNai;
import com.sale_oto.carshop.entity.NhanVien;
import com.sale_oto.carshop.enums.LoaiDoiTuong;
import com.sale_oto.carshop.enums.TrangThaiDonHang;
import com.sale_oto.carshop.enums.TrangThaiKhieuNai;
import com.sale_oto.carshop.exception.BadRequestException;
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

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.EnumSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class KhieuNaiService {

    private final KhieuNaiRepository khieuNaiRepository;
    private final KhachHangRepository khachHangRepository;
    private final DonHangRepository donHangRepository;
    private final NhanVienRepository nhanVienRepository;
    private final MediaService mediaService;

    private static final Set<TrangThaiDonHang> TRANG_THAI_DON_CHO_PHEP_KHIEU_NAI = EnumSet.of(
            TrangThaiDonHang.DA_XAC_NHAN,
            TrangThaiDonHang.DANG_XU_LY,
            TrangThaiDonHang.DANG_GIAO,
            TrangThaiDonHang.HOAN_THANH
    );

    private static final Set<TrangThaiKhieuNai> TRANG_THAI_KHIEU_NAI_DANG_MO = EnumSet.of(
            TrangThaiKhieuNai.MOI,
            TrangThaiKhieuNai.DANG_XU_LY
    );

    private static final long SO_NGAY_KHIEU_NAI_SAU_HOAN_THANH = 7L;

    @Transactional
    public KhieuNaiResponse create(KhieuNaiRequest request) {
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
            kiemTraDieuKienKhieuNaiDonHang(donHang, request.getKhachHangId());
            khieuNai.setDonHang(donHang);
        }

        return toResponse(khieuNaiRepository.save(khieuNai));
    }

    private void kiemTraDieuKienKhieuNaiDonHang(DonHang donHang, Long khachHangId) {
        // #1 Chủ đơn
        if (donHang.getKhachHang() == null || !donHang.getKhachHang().getId().equals(khachHangId)) {
            throw new BadRequestException("Đơn hàng này không thuộc về bạn, không thể khiếu nại.");
        }

        // #2 Trạng thái đơn hàng
        TrangThaiDonHang trangThai = donHang.getTrangThai();
        if (trangThai == TrangThaiDonHang.CHO_XAC_NHAN) {
            throw new BadRequestException("Đơn đang chờ xác nhận. Bạn có thể hủy đơn thay vì khiếu nại.");
        }
        if (trangThai == TrangThaiDonHang.DA_HUY) {
            throw new BadRequestException("Đơn hàng đã bị hủy, không thể khiếu nại.");
        }
        if (!TRANG_THAI_DON_CHO_PHEP_KHIEU_NAI.contains(trangThai)) {
            throw new BadRequestException("Trạng thái đơn hàng hiện không cho phép khiếu nại.");
        }

        // #3 Thời hạn 7 ngày kể từ khi đơn hoàn thành
        if (trangThai == TrangThaiDonHang.HOAN_THANH) {
            LocalDateTime mocHoanThanh = donHang.getNgayCapNhat() != null ? donHang.getNgayCapNhat() : donHang.getNgayTao();
            if (mocHoanThanh != null) {
                long soNgay = Duration.between(mocHoanThanh, LocalDateTime.now()).toDays();
                if (soNgay > SO_NGAY_KHIEU_NAI_SAU_HOAN_THANH) {
                    throw new BadRequestException("Đã quá " + SO_NGAY_KHIEU_NAI_SAU_HOAN_THANH
                            + " ngày kể từ khi đơn hoàn thành, không thể khiếu nại.");
                }
            }
        }

        // #4 Không trùng — mỗi đơn chỉ có 1 khiếu nại đang mở
        if (khieuNaiRepository.existsByDonHangIdAndTrangThaiIn(donHang.getId(), TRANG_THAI_KHIEU_NAI_DANG_MO)) {
            throw new BadRequestException("Đơn hàng này đã có khiếu nại đang được xử lý. Vui lòng chờ phản hồi.");
        }
    }

    @Transactional(readOnly = true)
    public KhieuNaiResponse getById(Long id) {
        return toResponse(getEntityById(id));
    }

    @Transactional(readOnly = true)
    public Page<KhieuNaiResponse> getAll(Pageable pageable) {
        return khieuNaiRepository.findAll(pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<KhieuNaiResponse> getByKhachHang(Long khachHangId, Pageable pageable) {
        return khieuNaiRepository.findByKhachHangId(khachHangId, pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<KhieuNaiResponse> getByTrangThai(TrangThaiKhieuNai trangThai, Pageable pageable) {
        return khieuNaiRepository.findByTrangThai(trangThai, pageable).map(this::toResponse);
    }

    @Transactional
    public KhieuNaiResponse phanHoi(Long id, String phanHoi, Long nhanVienId) {
        KhieuNai khieuNai = getEntityById(id);
        NhanVien nhanVien = nhanVienRepository.findById(nhanVienId)
                .orElseThrow(() -> new ResourceNotFoundException("Nhân viên", nhanVienId));

        khieuNai.setPhanHoi(phanHoi);
        khieuNai.setNhanVienXuLy(nhanVien);
        khieuNai.setTrangThai(TrangThaiKhieuNai.DA_GIAI_QUYET);

        return toResponse(khieuNaiRepository.save(khieuNai));
    }

    @Transactional
    public KhieuNaiResponse capNhatTrangThai(Long id, TrangThaiKhieuNai trangThai) {
        KhieuNai khieuNai = getEntityById(id);
        khieuNai.setTrangThai(trangThai);
        return toResponse(khieuNaiRepository.save(khieuNai));
    }

    @Transactional
    public void huy(Long id, Long khachHangId) {
        KhieuNai khieuNai = getEntityById(id);

        if (khieuNai.getKhachHang() == null || !khieuNai.getKhachHang().getId().equals(khachHangId)) {
            throw new BadRequestException("Bạn không có quyền hủy khiếu nại này.");
        }

        if (khieuNai.getTrangThai() != TrangThaiKhieuNai.MOI) {
            throw new BadRequestException("Khiếu nại đã được tiếp nhận xử lý, không thể hủy.");
        }

        mediaService.deleteAllByDoiTuong(LoaiDoiTuong.KHIEU_NAI, id);
        khieuNaiRepository.delete(khieuNai);
    }

    private KhieuNai getEntityById(Long id) {
        return khieuNaiRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Khiếu nại", id));
    }

    private KhieuNaiResponse toResponse(KhieuNai k) {
        KhieuNaiResponse.KhieuNaiResponseBuilder b = KhieuNaiResponse.builder()
                .id(k.getId())
                .tieuDe(k.getTieuDe())
                .noiDung(k.getNoiDung())
                .trangThai(k.getTrangThai())
                .phanHoi(k.getPhanHoi())
                .ngayTao(k.getNgayTao())
                .ngayCapNhat(k.getNgayCapNhat());

        KhachHang kh = k.getKhachHang();
        if (kh != null) {
            b.khachHang(KhieuNaiResponse.KhachHangSummary.builder()
                    .id(kh.getId())
                    .hoTen(kh.getHoTen())
                    .soDienThoai(kh.getSoDienThoai())
                    .email(kh.getEmail())
                    .build());
        }

        DonHang dh = k.getDonHang();
        if (dh != null) {
            b.donHang(KhieuNaiResponse.DonHangSummary.builder()
                    .id(dh.getId())
                    .maDonHang(dh.getMaDonHang())
                    .build());
        }

        NhanVien nv = k.getNhanVienXuLy();
        if (nv != null) {
            b.nhanVienXuLy(KhieuNaiResponse.NhanVienSummary.builder()
                    .id(nv.getId())
                    .hoTen(nv.getHoTen())
                    .build());
        }

        return b.build();
    }
}
