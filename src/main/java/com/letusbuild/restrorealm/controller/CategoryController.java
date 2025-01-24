package com.letusbuild.restrorealm.controller;

import com.letusbuild.restrorealm.dto.CategoryDto;
import com.letusbuild.restrorealm.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/api/v1/category")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping("/{categoryId}")
    @PreAuthorize("hasAuthority('READ_SINGLE_CATEGORY')")
    public ResponseEntity<CategoryDto> getCategoryById(@PathVariable Long categoryId){
        return ResponseEntity.ok(categoryService.getCategoryById(categoryId));
    }

    @GetMapping("/")
    @PreAuthorize("hasAuthority('READ_ALL_CATEGORIES')")
    public ResponseEntity<List<CategoryDto>> getAllCategories(){
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @PostMapping("/")
    @PreAuthorize("hasAuthority('CREATE_CATEGORY')")
    public ResponseEntity<CategoryDto> createCategory(@RequestBody CategoryDto categoryDto){
        return ResponseEntity.ok(categoryService.createCategory(categoryDto));
    }

    @PutMapping("/{categoryId}")
    @PreAuthorize("hasAuthority('UPDATE_SINGLE_CATEGORY')")
    public ResponseEntity<CategoryDto> updateCategory(@PathVariable Long categoryId, CategoryDto categoryDto){
        return ResponseEntity.ok(categoryService.updateCategory(categoryId, categoryDto));
    }

}
