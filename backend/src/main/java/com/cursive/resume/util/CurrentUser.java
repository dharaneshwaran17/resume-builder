package com.cursive.resume.util;

import org.springframework.security.core.context.SecurityContextHolder;

public class CurrentUser {
    public static String id() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return null;
        return String.valueOf(auth.getPrincipal());
    }

    public static boolean isAdmin() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return false;
        return auth.getAuthorities().stream().anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
    }
}
