package com.letusbuild.restrorealm.service.Impl;

import com.letusbuild.restrorealm.dto.OrderRequestDto;
import com.letusbuild.restrorealm.dto.OrderResponseDto;
import com.letusbuild.restrorealm.entity.Enum.OrderStatus;
import com.letusbuild.restrorealm.entity.MenuItem;
import com.letusbuild.restrorealm.entity.Order;
import com.letusbuild.restrorealm.entity.OrderItem;
import com.letusbuild.restrorealm.entity.TableEntity;
import com.letusbuild.restrorealm.repository.MenuItemRepository;
import com.letusbuild.restrorealm.repository.OrderItemRepository;
import com.letusbuild.restrorealm.repository.OrderRepository;
import com.letusbuild.restrorealm.repository.TableRepository;
import com.letusbuild.restrorealm.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import java.util.stream.Collectors;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final TableRepository tableRepository;
    private final MenuItemRepository menuItemRepository;
    private final ModelMapper modelMapper;

    @Override
    public OrderResponseDto createOrder(OrderRequestDto orderRequestDto) {
        Order order = new Order();
        if(orderRequestDto.getTableId() != null) {
            TableEntity table = tableRepository.findById(orderRequestDto.getTableId())
                    .orElseThrow(() -> new IllegalArgumentException("Table not found"));
            order.setTable(table);
        } else {
            TableEntity table = tableRepository.findById(0L)
                    .orElseThrow(() -> new IllegalArgumentException("Table not found"));
            order.setTable(table);
        }
        order.setCustomerName(orderRequestDto.getCustomerName());
        order.setOrderItems(orderRequestDto.getOrderItems().stream()
                .map(orderItemDto -> {
                    MenuItem menuItem = menuItemRepository.findById(orderItemDto.getMenuItemId())
                            .orElseThrow(() -> new IllegalArgumentException("Menu Item not found"));
                    OrderItem orderItem = new OrderItem();
                    orderItem.setOrder(order);
                    orderItem.setMenuItem(menuItem);
                    orderItem.setQuantity(orderItemDto.getQuantity());
                    orderItem.setPrice(menuItem.getBasePrice());
                    return orderItem;
                }).collect(Collectors.toList()));

        double totalAmount = order.getOrderItems().stream()
                .mapToDouble(item -> item.getPrice()*item.getQuantity())
                .sum();
        order.setOrderNumber(orderRequestDto.getOrderNumber());
        order.setStatus(orderRequestDto.getStatus());
        order.setTotalAmount(totalAmount);
        order.setStreet1(orderRequestDto.getStreet1());
        order.setStreet2(orderRequestDto.getStreet2());
        order.setCity(orderRequestDto.getCity());
        order.setState(orderRequestDto.getState());
        order.setPostalCode(orderRequestDto.getPostalCode());
        Order savedOrder = orderRepository.save(order);
        return modelMapper.map(savedOrder, OrderResponseDto.class);
    }

    @Override
    public OrderResponseDto getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        return modelMapper.map(order, OrderResponseDto.class);
    }

    @Override
    public List<OrderResponseDto> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .map(order -> modelMapper.map(order, OrderResponseDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public OrderResponseDto updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        order.setStatus(OrderStatus.valueOf(status.toUpperCase()));
        orderRepository.save(order);
        return modelMapper.map(order, OrderResponseDto.class);
    }

    @Override
    public void cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
    }
}

