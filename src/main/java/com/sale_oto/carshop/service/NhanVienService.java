package com.sale_oto.carshop.service;

import com.sale_oto.carshop.dto.request.NhanVienRequest;
import com.sale_oto.carshop.dto.response.NhanVienResponse;
import com.sale_oto.carshop.entity.NhanVien;
import com.sale_oto.carshop.enums.ChucVu;
import com.sale_oto.carshop.enums.VaiTro;
import com.sale_oto.carshop.exception.DuplicateResourceException;
import com.sale_oto.carshop.exception.ResourceNotFoundException;
import com.sale_oto.carshop.repository.NguoiDungRepository;
import com.sale_oto.carshop.repository.NhanVienRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NhanVienService {

    private final NhanVienRepository nhanVienRepository;
    private final NguoiDungRepository nguoiDungRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public NhanVienResponse create(NhanVienRequest request) {
        if (nguoiDungRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email đã tồn tại");
        }
        if (nhanVienRepository.existsByMaNhanVien(request.getMaNhanVien())) {
            throw new DuplicateResourceException("Mã nhân viên đã tồn tại");
        }

        NhanVien nhanVien = new NhanVien();
        nhanVien.setHoTen(request.getHoTen());
        nhanVien.setEmail(request.getEmail());
        nhanVien.setMatKhau(passwordEncoder.encode(request.getMatKhau()));
        nhanVien.setSoDienThoai(request.getSoDienThoai());
        nhanVien.setDiaChi(request.getDiaChi());
        nhanVien.setVaiTro(VaiTro.NHAN_VIEN);
        nhanVien.setTrangThai(true);
        nhanVien.setMaNhanVien(request.getMaNhanVien());
        nhanVien.setChucVu(request.getChucVu());
        nhanVien.setPhongBan(request.getPhongBan());
        nhanVien.setLuong(request.getLuong());
        nhanVien.setNgayVaoLam(request.getNgayVaoLam());

        nhanVien = nhanVienRepository.save(nhanVien);
        return toResponse(nhanVien);
    }

    public NhanVienResponse getById(Long id) {
        NhanVien nhanVien = nhanVienRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Nhân viên", id));
        return toResponse(nhanVien);
    }

    public Page<NhanVienResponse> getAll(Pageable pageable) {
        return nhanVienRepository.findAll(pageable).map(this::toResponse);
    }

    public Page<NhanVienResponse> getByChucVu(ChucVu chucVu, Pageable pageable) {
        return nhanVienRepository.findByChucVu(chucVu, pageable).map(this::toResponse);
    }

    public Page<NhanVienResponse> search(String keyword, Pageable pageable) {
        return nhanVienRepository.search(keyword, pageable).map(this::toResponse);
    }

    @Transactional
    public NhanVienResponse update(Long id, NhanVienRequest request) {
        NhanVien nhanVien = nhanVienRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Nhân viên", id));

        nhanVien.setHoTen(request.getHoTen());
        nhanVien.setSoDienThoai(request.getSoDienThoai());
        nhanVien.setDiaChi(request.getDiaChi());
        nhanVien.setChucVu(request.getChucVu());
        nhanVien.setPhongBan(request.getPhongBan());
        nhanVien.setLuong(request.getLuong());
        nhanVien.setNgayVaoLam(request.getNgayVaoLam());

        nhanVien = nhanVienRepository.save(nhanVien);
        return toResponse(nhanVien);
    }

    @Transactional
    public void delete(Long id) {
        if (!nhanVienRepository.existsById(id)) {
            throw new ResourceNotFoundException("Nhân viên", id);
        }
        nhanVienRepository.deleteById(id);
    }

    private NhanVienResponse toResponse(NhanVien nv) {
        return NhanVienResponse.builder()
                .id(nv.getId())
                .hoTen(nv.getHoTen())
                .email(nv.getEmail())
                .soDienThoai(nv.getSoDienThoai())
                .diaChi(nv.getDiaChi())
                .anhDaiDien(nv.getAnhDaiDien())
                .trangThai(nv.getTrangThai())
                .maNhanVien(nv.getMaNhanVien())
                .chucVu(nv.getChucVu())
                .phongBan(nv.getPhongBan())
                .luong(nv.getLuong())
                .ngayVaoLam(nv.getNgayVaoLam())
                .ngayTao(nv.getNgayTao())
                .build();
    }
}
