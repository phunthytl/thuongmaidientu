package com.sale_oto.carshop.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "vnpay")
public class VnpayConfig {
    private String paymentUrl;
    private String tmnCode;
    private String hashSecret;
    private String returnUrl;
    private String frontendReturnUrl;
}
