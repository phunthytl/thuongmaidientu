package com.sale_oto.carshop.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {

    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private NguoiDungResponse nguoiDung;

    public static AuthResponse of(String accessToken, String refreshToken, NguoiDungResponse nguoiDung) {
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .nguoiDung(nguoiDung)
                .build();
    }
}
