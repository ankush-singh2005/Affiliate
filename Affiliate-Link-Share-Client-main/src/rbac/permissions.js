import { useSelector } from 'react-redux';

export const ROLE_PERMISSIONS = {
    admin: {
        canViewUser: true,
        canCreateUser: true,
        canEditUser: true,
        canDeleteUser: true,
        canViewLink: true,
        canCreateLink: true,
        canEditLink: true,
        canDeleteLink: true,
    },
    developer: {
        canViewUser: false,
        canCreateUser: false,
        canEditUser: false,
        canDeleteUser: false,
        canViewLink: true,
        canCreateLink: false,
        canEditLink: false,
        canDeleteLink: false,
    },
    viewer: {
        canViewUser: true,
        canCreateUser: false,
        canEditUser: false,
        canDeleteUser: false,
        canViewLink: true,
        canCreateLink: false,
        canEditLink: false,
        canDeleteLink: false,
    }
};

// Custom hook to return permissions of the logged in user
export const usePermission = () => {
    const user = useSelector((state) => state.userDetails);
    return ROLE_PERMISSIONS[user?.role] || {};
};