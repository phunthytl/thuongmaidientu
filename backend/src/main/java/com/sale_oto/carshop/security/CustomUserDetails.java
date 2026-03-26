package com.sale_oto.carshop.security;

import com.sale_oto.carshop.entity.NguoiDung;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Getter
@AllArgsConstructor
public class CustomUserDetails implements UserDetails {

    private final Long id;
    private final String email;
    private final String matKhau;
    private final String hoTen;
    private final Boolean trangThai;
    private final Collection<? extends GrantedAuthority> authorities;

    public static CustomUserDetails fromNguoiDung(NguoiDung nguoiDung) {
        List<GrantedAuthority> authorities = List.of(
                new SimpleGrantedAuthority("ROLE_" + nguoiDung.getVaiTro().name())
        );

        return new CustomUserDetails(
                nguoiDung.getId(),
                nguoiDung.getEmail(),
                nguoiDung.getMatKhau(),
                nguoiDung.getHoTen(),
                nguoiDung.getTrangThai(),
                authorities
        );
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return matKhau;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return trangThai;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return trangThai;
    }
}
