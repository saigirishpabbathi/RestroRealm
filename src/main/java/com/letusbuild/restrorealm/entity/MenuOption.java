package com.letusbuild.restrorealm.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "menu_option")
public class MenuOption extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    @DecimalMin(value = "0.0", inclusive = true)
    private BigDecimal price;

    @ManyToOne
    @JsonBackReference
    private Customization customization;
}
