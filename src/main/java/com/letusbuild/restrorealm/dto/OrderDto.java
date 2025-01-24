package com.letusbuild.restrorealm.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDto {
    private Long id;

    private String orderNumber;

    @NotNull(message = "Order Items cannot be empty")
    private List<OrderLineItemDto> orderLineItems;
}
