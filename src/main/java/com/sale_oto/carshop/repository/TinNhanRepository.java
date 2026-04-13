package com.sale_oto.carshop.repository;

import com.sale_oto.carshop.entity.TinNhan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TinNhanRepository extends JpaRepository<TinNhan, Long> {

    Page<TinNhan> findByPhienChatIdOrderByNgayGuiAsc(Long phienChatId, Pageable pageable);

    long countByPhienChatIdAndDaDocFalseAndNguoiGuiIdNot(Long phienChatId, Long nguoiGuiId);
}
