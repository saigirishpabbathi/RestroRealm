package com.letusbuild.restrorealm.controller;

import com.letusbuild.restrorealm.dto.MenuItemDto;
import com.letusbuild.restrorealm.service.MenuItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/api/v1/menu-item")
@RequiredArgsConstructor
public class MenuItemController {
    private final MenuItemService menuItemService;

    @GetMapping("/{menuItemId}")
    @PreAuthorize("hasAuthority('READ_SINGLE_MENU_ITEM')")
    public ResponseEntity<MenuItemDto> getMenuItemById(@PathVariable Long menuItemId){
        return ResponseEntity.ok(menuItemService.getMenuItemById(menuItemId));
    }

    @GetMapping("/")
    @PreAuthorize("hasAuthority('READ_ALL_MENU_ITEMS')")
    public ResponseEntity<List<MenuItemDto>> getAllMenuItems(){
        return ResponseEntity.ok(menuItemService.getAllMenuItems());
    }

    @PostMapping("/")
//    @PreAuthorize("hasAuthority('CREATE_MENU_ITEM')")
    public ResponseEntity<MenuItemDto> createMenuItem(@RequestBody MenuItemDto menuItemDto){
        return ResponseEntity.ok(menuItemService.createMenuItem(menuItemDto));
    }

    @PutMapping("/{menuItemId}")
    @PreAuthorize("hasAuthority('UPDATE_SINGLE_MENU_ITEM')")
    public ResponseEntity<MenuItemDto> updateMenuItem(@PathVariable Long menuItemId, MenuItemDto menuItemDto){
        return ResponseEntity.ok(menuItemService.updateMenuItem(menuItemId, menuItemDto));
    }

}
