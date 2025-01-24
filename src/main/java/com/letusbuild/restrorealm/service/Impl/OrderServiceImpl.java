package com.letusbuild.restrorealm.service.Impl;

import com.letusbuild.restrorealm.dto.OrderDto;
import com.letusbuild.restrorealm.entity.Order;
import com.letusbuild.restrorealm.entity.OrderLineItem;
import com.letusbuild.restrorealm.repository.OrderRepository;
import com.letusbuild.restrorealm.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final ModelMapper modelMapper;
    @Override
    public OrderDto getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order Id - "+orderId+" not found"));
        return modelMapper.map(order, OrderDto.class);
    }

    @Override
    public OrderDto createOrder(OrderDto orderDto) {
        Order order = modelMapper.map(orderDto, Order.class);
        order.setOrderNumber(UUID.randomUUID().toString());
        order.setOrderLineItems(orderDto.getOrderLineItems().stream()
                .map(orderLineItemDto -> {
                    OrderLineItem orderLineItem = modelMapper.map(orderLineItemDto, OrderLineItem.class);
                    orderLineItem.setOrder(order);
                    return orderLineItem;
                })
                .collect(Collectors.toList()));
        Order savedOrder = orderRepository.save(order);
        return modelMapper.map(savedOrder, OrderDto.class);
    }

}
