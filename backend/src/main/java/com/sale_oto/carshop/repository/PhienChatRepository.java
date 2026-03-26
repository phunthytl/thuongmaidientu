package com.sale_oto.carshop.repository;

import com.sale_oto.carshop.entity.PhienChat;
import com.sale_oto.carshop.enums.TrangThaiPhienChat;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhienChatRepository extends JpaRepository<PhienChat, Long> {

    Page<PhienChat> findByKhachHangId(Long khachHangId, Pageable pageable);

    Page<PhienChat> findByNhanVienId(Long nhanVienId, Pageable pageable);

    List<PhienChat> findByTrangThai(TrangThaiPhienChat trangThai);

    long countByTrangThai(TrangThaiPhienChat trangThai);
}
