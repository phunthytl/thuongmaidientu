package com.sale_oto.carshop.service;

import com.sale_oto.carshop.dto.request.TonKhoRequest;
import com.sale_oto.carshop.dto.response.TonKhoResponse;
import com.sale_oto.carshop.entity.KhoHang;
import com.sale_oto.carshop.entity.PhuKien;
import com.sale_oto.carshop.entity.TonKho;
import com.sale_oto.carshop.exception.ResourceNotFoundException;
import com.sale_oto.carshop.repository.KhoHangRepository;
import com.sale_oto.carshop.repository.PhuKienRepository;
import com.sale_oto.carshop.repository.TonKhoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TonKhoService {

    private final TonKhoRepository tonKhoRepository;
    private final PhuKienRepository phuKienRepository;
    private final KhoHangRepository khoHangRepository;

    /**
     * Lấy tồn kho của 1 phụ kiện ở TẤT CẢ kho đang hoạt động.
     */
    @Transactional(readOnly = true)
    public List<TonKhoResponse> getByPhuKienId(Long phuKienId) {
        if (!phuKienRepository.existsById(phuKienId)) {
            throw new ResourceNotFoundException("Phụ kiện", phuKienId);
        }

        List<KhoHang> activeKhos = khoHangRepository.findByTrangThai(true);
        Map<Long, TonKho> tonKhoMap = tonKhoRepository.findByPhuKienId(phuKienId)
                .stream()
                .collect(Collectors.toMap(tk -> tk.getKhoHang().getId(), tk -> tk, (t1, t2) -> t1));

        return activeKhos.stream().map(kho -> {
            TonKho tk = tonKhoMap.get(kho.getId());
            return TonKhoResponse.builder()
                    .id(tk != null ? tk.getId() : null)
                    .khoHangId(kho.getId())
                    .tenKho(kho.getTenKho())
                    .diaChiChiTiet(kho.getDiaChiChiTiet())
                    .tinhThanhTen(kho.getTinhThanhTen())
                    .khoTrangThai(kho.getTrangThai())
                    .phuKienId(phuKienId)
                    .soLuong(tk != null ? tk.getSoLuong() : 0)
                    .build();
        }).toList();
    }

    @Transactional
    public TonKhoResponse upsert(TonKhoRequest request) {
        KhoHang kho = khoHangRepository.findById(request.getKhoHangId())
                .orElseThrow(() -> new ResourceNotFoundException("Kho hàng", request.getKhoHangId()));

        PhuKien phuKien = phuKienRepository.findById(request.getPhuKienId())
                .orElseThrow(() -> new ResourceNotFoundException("Phụ kiện", request.getPhuKienId()));

        TonKho tonKho = tonKhoRepository.findByPhuKienIdAndKhoHangId(request.getPhuKienId(), request.getKhoHangId())
                .orElseGet(() -> TonKho.builder().phuKien(phuKien).khoHang(kho).build());

        tonKho.setSoLuong(request.getSoLuong());
        tonKho = tonKhoRepository.save(tonKho);
        syncPhuKienTotalStock(phuKien.getId());
        return toResponse(tonKho);
    }

    /**
     * Trừ tồn kho khi đặt hàng thành công (Phụ kiện).
     */
    @Transactional
    public void decreaseStock(Long phuKienId, Long khoHangId, int quantity) {
        if (khoHangId == null) return;

        TonKho tonKho = tonKhoRepository.findByPhuKienIdAndKhoHangId(phuKienId, khoHangId)
                .orElseThrow(() -> new ResourceNotFoundException("Tồn kho phụ kiện", phuKienId));

        if (tonKho.getSoLuong() < quantity) {
            throw new RuntimeException("Kho '" + tonKho.getKhoHang().getTenKho() + "' không đủ hàng.");
        }

        tonKho.setSoLuong(tonKho.getSoLuong() - quantity);
        tonKhoRepository.save(tonKho);
        syncPhuKienTotalStock(phuKienId);
    }

    /**
     * Hoàn kho khi hủy đơn (Phụ kiện).
     */
    @Transactional
    public void increaseStock(Long phuKienId, Long khoHangId, int quantity) {
        if (khoHangId == null) return;

        KhoHang kho = khoHangRepository.findById(khoHangId)
                .orElseThrow(() -> new ResourceNotFoundException("Kho hàng", khoHangId));

        TonKho tonKho = tonKhoRepository.findByPhuKienIdAndKhoHangId(phuKienId, khoHangId)
                .orElseGet(() -> TonKho.builder().phuKien(phuKienRepository.findById(phuKienId).orElse(null)).khoHang(kho).soLuong(0).build());

        tonKho.setSoLuong(tonKho.getSoLuong() + quantity);
        tonKhoRepository.save(tonKho);
        syncPhuKienTotalStock(phuKienId);
    }

    /**
     * Đồng bộ PhuKien.soLuong = SUM(TonKho.soLuong) trên tất cả kho.
     */
    private void syncPhuKienTotalStock(Long phuKienId) {
        int total = tonKhoRepository.findByPhuKienId(phuKienId).stream()
                .filter(tk -> tk.getSoLuong() != null)
                .mapToInt(TonKho::getSoLuong).sum();
        PhuKien phuKien = phuKienRepository.findById(phuKienId).orElse(null);
        if (phuKien != null) {
            phuKien.setSoLuong(total);
            phuKienRepository.save(phuKien);
        }
    }

    private TonKhoResponse toResponse(TonKho tk) {
        return TonKhoResponse.builder()
                .id(tk.getId())
                .khoHangId(tk.getKhoHang().getId())
                .tenKho(tk.getKhoHang().getTenKho())
                .diaChiChiTiet(tk.getKhoHang().getDiaChiChiTiet())
                .tinhThanhTen(tk.getKhoHang().getTinhThanhTen())
                .khoTrangThai(tk.getKhoHang().getTrangThai())
                .phuKienId(tk.getPhuKien() != null ? tk.getPhuKien().getId() : null)
                .soLuong(tk.getSoLuong())
                .build();
    }
}
