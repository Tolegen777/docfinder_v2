import {resetService} from "@/shared/lib/resetService";

export const handleSessionExpired = () => {
    window.location.href = '/';
    resetService()
};
