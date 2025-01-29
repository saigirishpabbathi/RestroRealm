package com.letusbuild.restrorealm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemResponseDto {

    private String menuItemName; // Name of the menu item

    private Integer quantity;

    private Double price; // Price of one item

    private Double totalItemPrice; // Quantity * Price
}

