package com.letusbuild.restrorealm.controller;

import com.letusbuild.restrorealm.dto.OrderDto;
import com.letusbuild.restrorealm.service.OrderService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@Transactional
public class OrderController {
    private final OrderService orderService;

    @GetMapping("/{orderId}")
    @PreAuthorize("hasAuthority('READ_SINGLE_ORDER')")
    public ResponseEntity<OrderDto> getOrderById(@PathVariable Long orderId){
        return ResponseEntity.ok(orderService.getOrderById(orderId));
    }

    @PostMapping("/")
    @PreAuthorize("hasAuthority('CREATE_ORDER')")
    public ResponseEntity<OrderDto> createOrder(@RequestBody @Valid OrderDto orderDto){
        return  ResponseEntity.ok(orderService.createOrder(orderDto));
    }
}
