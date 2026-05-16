package com.sale_oto.carshop.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchSuggestionResponse {
    private String id;
    private String name;
    private String type; // OTO, PHU_KIEN, DICH_VU
    private String url;  // Deep link to product
    private java.math.BigDecimal price;
    private String image;
}
