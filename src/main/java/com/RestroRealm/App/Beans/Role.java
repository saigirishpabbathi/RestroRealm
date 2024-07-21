package com.RestroRealm.App.Beans;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.util.Calendar;
import java.util.Set;

@Entity
@Table(name = "roles")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty
    @Column(name = "role_id", updatable = false)
    private Long roleId;

    @JsonProperty
    @Column(name = "role_name")
    private String roleName;

    @JsonProperty
    @Column(name = "role_description")
    private String roleDescription;

    @JsonProperty
    @Column(name = "created_date", nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Calendar createdDate;

    @JsonProperty
    @Column(name = "updated_date", nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Calendar updatedDate;

    public Long getRoleId() {
        return roleId;
    }

    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public String getRoleDescription() {
        return roleDescription;
    }

    public void setRoleDescription(String roleDescription) {
        this.roleDescription = roleDescription;
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

    public Role() {
    }

    public Role(Long roleId, String roleName, String roleDescription, Calendar createdDate, Calendar updatedDate) {
        this.roleId = roleId;
        this.roleName = roleName;
        this.roleDescription = roleDescription;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
    }
}
