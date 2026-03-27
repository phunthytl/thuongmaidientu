package com.sale_oto.carshop.security;

import com.sale_oto.carshop.entity.NguoiDung;
import com.sale_oto.carshop.repository.NguoiDungRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final NguoiDungRepository nguoiDungRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        NguoiDung nguoiDung = nguoiDungRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng: " + email));
        return CustomUserDetails.fromNguoiDung(nguoiDung);
    }

    @Transactional(readOnly = true)
    public UserDetails loadUserById(Long id) {
        NguoiDung nguoiDung = nguoiDungRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng ID: " + id));
        return CustomUserDetails.fromNguoiDung(nguoiDung);
    }
}
