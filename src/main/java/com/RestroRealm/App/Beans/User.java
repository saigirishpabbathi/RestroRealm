package com.RestroRealm.App.Beans;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.util.Calendar;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty
    @Column(name = "user_id", updatable = false)
    private Long userId;

    @JsonProperty
    @Column(name = "username")
    private String username;

    @JsonProperty
    @Column(name = "first_name")
    private String firstName;

    @JsonProperty
    @Column(name = "last_name")
    private String lastName;

    @JsonProperty
    @Column(name = "email")
    private String email;

    @JsonProperty
    @Column(name = "passcode")
    private String password;

    @JsonProperty
    @ManyToOne
    @JoinColumn(name = "role_id", referencedColumnName = "role_id",
            foreignKey = @ForeignKey(name = "users_ibfk_1"))
    private Role roleId;

    @JsonProperty
    @Column(name = "created_date", nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Calendar createdDate;

    @JsonProperty
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<RolePermissions> rolePermissions;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return roleId;
    }

    public void setRole(Role role) {
        this.roleId = roleId;
    }

    public Calendar getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Calendar createdDate) {
        if (createdDate == null) {
            this.createdDate = Calendar.getInstance();
        } else {
            this.createdDate = createdDate;
        }
    }

    public User(Long userId, String username, String firstName, String lastName, String email, String password, Role roleId, Calendar createdDate) {
        this.userId = userId;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.roleId = roleId;
        this.createdDate = createdDate;
    }

    public User() {
    }
}

