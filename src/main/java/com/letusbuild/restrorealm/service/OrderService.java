package com.letusbuild.restrorealm.service;

import com.letusbuild.restrorealm.dto.OrderDto;

public interface OrderService {
    OrderDto getOrderById(Long orderId);

    OrderDto createOrder(OrderDto orderDto);
}
