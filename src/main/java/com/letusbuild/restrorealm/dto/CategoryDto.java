package com.letusbuild.restrorealm.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryDto {
    private Long id;
    @NotBlank(message = "Category Name is required")
    @Size(min = 3, max = 50, message = "Category name must be between 3 and 50 characters")
    private String name;
    @NotBlank(message = "Age Restriction is required")
    private boolean ageRestricted = false;
    @NotNull(message = "Available Start Time is required")
    private LocalTime availableStartTime;
    @NotNull(message = "Available Start End is required")
    private LocalTime availableEndTime;
    private boolean deleted;
}
