package com.RestroRealm.App.Beans;

import com.RestroRealm.App.Beans.Enums.PermissionStatus;
import com.RestroRealm.App.Beans.Enums.PermissionType;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.util.Calendar;

@Entity
@Table(name = "permissions")
public class Permission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty
    @Column(name = "permission_id")
    private Long permissionId;

    @JsonProperty
    @Column(name = "permission_name")
    private String permissionName;

    @JsonProperty
    @Column(name = "permission_description")
    private String permissionDescription;

    @JsonProperty
    @Column(name = "status")
    private PermissionStatus status;

    @JsonProperty
    @Column(name = "permission_type")
    private PermissionType permissionType;

    @JsonProperty
    @ManyToOne
    @JoinColumn(name = "created_by", referencedColumnName = "user_id",
            foreignKey = @ForeignKey(name = "permissions_ibfk_1"))
    private User createdBy;

    @JsonProperty
    @ManyToOne
    @JoinColumn(name = "updated_by", referencedColumnName = "user_id",
            foreignKey = @ForeignKey(name = "permissions_ibfk_2"))
    private User updatedBy;

    @JsonProperty
    @Column(name = "created_date", nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Calendar createdDate;

    @JsonProperty
    @Column(name = "updated_date", nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Calendar updatedDate;

    public Long getPermissionId() {
        return permissionId;
    }

    public void setPermissionId(Long permissionId) {
        this.permissionId = permissionId;
    }

    public String getPermissionName() {
        return permissionName;
    }

    public void setPermissionName(String permissionName) {
        this.permissionName = permissionName;
    }

    public String getPermissionDescription() {
        return permissionDescription;
    }

    public void setPermissionDescription(String permissionDescription) {
        this.permissionDescription = permissionDescription;
    }

    public PermissionStatus getStatus() {
        return status;
    }

    public void setStatus(PermissionStatus status) {
        this.status = status;
    }

    public PermissionType getPermissionType() {
        return permissionType;
    }

    public void setPermissionType(PermissionType permissionType) {
        this.permissionType = permissionType;
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

    public Permission() {
    }

    public Permission(Long permissionId, String permissionName, String permissionDescription, PermissionStatus status,
                      PermissionType permissionType, User createdBy, User updatedBy, Calendar createdDate,
                      Calendar updatedDate) {
        this.permissionId = permissionId;
        this.permissionName = permissionName;
        this.permissionDescription = permissionDescription;
        this.status = status;
        this.permissionType = permissionType;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
    }
}
