package com.letusbuild.restrorealm.controller;

import com.letusbuild.restrorealm.dto.MenuOptionDto;
import com.letusbuild.restrorealm.service.MenuOptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/api/v1/menu-option")
@RequiredArgsConstructor
public class MenuOptionController {
    private final MenuOptionService menuOptionService;

    @GetMapping("/{menuOptionId}")
    @PreAuthorize("hasAuthority('READ_SINGLE_MENU_OPTION')")
    public ResponseEntity<MenuOptionDto> getMenuOptionById(@PathVariable Long menuOptionId){
        return ResponseEntity.ok(menuOptionService.getMenuOptionById(menuOptionId));
    }

    @GetMapping("/")
    @PreAuthorize("hasAuthority('READ_ALL_MENU_OPTIONS')")
    public ResponseEntity<List<MenuOptionDto>> getAllMenuOptions(){
        return ResponseEntity.ok(menuOptionService.getAllMenuOptions());
    }

    @PostMapping("/")
    @PreAuthorize("hasAuthority('CREATE_MENU_OPTION')")
    public ResponseEntity<MenuOptionDto> createMenuOption(@RequestBody MenuOptionDto menuOptionDto){
        return ResponseEntity.ok(menuOptionService.createMenuOption(menuOptionDto));
    }

    @PutMapping("/{menuOptionId}")
    @PreAuthorize("hasAuthority('UPDATE_SINGLE_MENU_OPTION')")
    public ResponseEntity<MenuOptionDto> updateMenuOption(@PathVariable Long menuOptionId, MenuOptionDto menuOptionDto){
        return ResponseEntity.ok(menuOptionService.updateMenuOption(menuOptionId, menuOptionDto));
    }

}

