package com.letusbuild.restrorealm.controller;

import com.letusbuild.restrorealm.dto.MenuAddOnDto;
import com.letusbuild.restrorealm.service.MenuAddOnService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/api/v1/menu-addon")
@RequiredArgsConstructor
public class MenuAddOnController {
    private final MenuAddOnService menuAddOnService;

    @GetMapping("/{menuAddOnId}")
    @PreAuthorize("hasAuthority('READ_SINGLE_MENU_ADD_ON')")
    public ResponseEntity<MenuAddOnDto> getMenuAddOnById(@PathVariable Long menuAddOnId){
        return ResponseEntity.ok(menuAddOnService.getMenuAddOnById(menuAddOnId));
    }

    @GetMapping("/")
    @PreAuthorize("hasAuthority('READ_ALL_MENU_ADD_ONS')")
    public ResponseEntity<List<MenuAddOnDto>> getAllMenuAddOns(){
        return ResponseEntity.ok(menuAddOnService.getAllMenuAddOns());
    }

    @PostMapping("/")
    @PreAuthorize("hasAuthority('CREATE_MENU_ADD_ON')")
    public ResponseEntity<MenuAddOnDto> createMenuAddOn(@RequestBody MenuAddOnDto menuAddOnDto){
        return ResponseEntity.ok(menuAddOnService.createMenuAddOn(menuAddOnDto));
    }

    @PutMapping("/{menuAddOnId}")
    @PreAuthorize("hasAuthority('UPDATE_SINGLE_MENU_ADD_ON')")
    public ResponseEntity<MenuAddOnDto> updateMenuAddOn(@PathVariable Long menuAddOnId, MenuAddOnDto menuAddOnDto){
        return ResponseEntity.ok(menuAddOnService.updateMenuAddOn(menuAddOnId, menuAddOnDto));
    }
}
