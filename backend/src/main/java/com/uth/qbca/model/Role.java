package com.uth.qbca.model;

public enum Role implements org.springframework.security.core.GrantedAuthority {
    ADMIN,
    RD_STAFF,
    LECTURER,
    DEPARTMENT_HEAD,
    SUBJECT_HEAD,
    EXAM_OFFICE_HEAD;
    @Override
    public String getAuthority() {
        return this.name();
    }
}
