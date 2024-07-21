package com.RestroRealm.App.Beans;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.util.Calendar;

@Entity
@Table(name = "role_permissions")
public class RolePermissions {

    @JsonProperty
    @Column(name = "role_permission_id")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long rolePermissionId;

    @JsonProperty
    @ManyToOne
    @JoinColumn(name = "role_id", referencedColumnName = "role_id",
            foreignKey = @ForeignKey(name = "fk_role_rp"))
    private Role role;

    @JsonProperty
    @ManyToOne
    @JoinColumn(name = "permission_id", referencedColumnName = "permission_id",
            foreignKey = @ForeignKey(name = "fk_permission_rp"))
    private Permissions permission;

    @JsonProperty
    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id",
            foreignKey = @ForeignKey(name = "fk_user_rp_ui"))
    private User user;

    @JsonProperty
    @ManyToOne
    @JoinColumn(name = "created_by", referencedColumnName = "user_id",
            foreignKey = @ForeignKey(name = "fk_user_rp_cb"))
    private User createdBy;

    @JsonProperty
    @ManyToOne
    @JoinColumn(name = "updated_by", referencedColumnName = "user_id",
            foreignKey = @ForeignKey(name = "fk_user_rp_ub"))
    private User updatedBy;

    @JsonProperty
    @Column(name = "created_date", nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Calendar createdDate;

    @JsonProperty
    @Column(name = "updated_date", nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Calendar updatedDate;

    public Long getRolePermissionId() {
        return rolePermissionId;
    }

    public void setRolePermissionId(Long rolePermissionId) {
        this.rolePermissionId = rolePermissionId;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Permissions getPermission() {
        return permission;
    }

    public void setPermission(Permissions permission) {
        this.permission = permission;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public User getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(User updatedBy) {
        this.updatedBy = updatedBy;
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

    public Calendar getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(Calendar updatedDate) {
        if (updatedDate == null) {
            this.updatedDate = Calendar.getInstance();
        } else {
            this.updatedDate = updatedDate;
        }
    }

    public RolePermissions() {
    }

    public RolePermissions(Long rolePermissionId, Role role, Permissions permission, User user, User createdBy, User updatedBy, Calendar createdDate, Calendar updatedDate) {
        this.rolePermissionId = rolePermissionId;
        this.role = role;
        this.permission = permission;
        this.user = user;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
    }
}
