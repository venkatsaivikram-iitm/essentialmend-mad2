
class ConfigHolder {

    static config = window.__config__;

    static get userInfo() {
        return this.config.userInfo || {}
    }

    static set userInfo(_userInfo) {
        this.config.userInfo = _userInfo;
    }

    static get professionalInfo() {
        return this.config.professionalInfo || {}
    }

    static get service() {
        return this.config.service || {}
    }

    static get uid() {
        return this.userInfo.uid;
    }

    static get email() {
        return this.userInfo.email;
    }

    static get role() {
        return this.userInfo.role
    }

    static get isAuthorized() {
        return Boolean(this.config.authorized)
    }

    static get isUser() {
        return Boolean(this.role === "user")
    }

    static get isProfessional() {
        return Boolean(this.role === "professional")
    }

    static get isAdmin() {
        return Boolean(this.role === "admin")
    }

    static get isAccountBlocked() {
        return Boolean(this.config?.userInfo?.status === "blocked");
    }

    static get isProfessionalRequestPending() {
        return Boolean(this.isProfessional && this.config?.professionalRequestInfo?.status === "pending");
    }

    static get isProfessionalRequestDeclined() {
        return Boolean(this.isProfessional && this.config?.professionalRequestInfo?.status === "declined");
    }

    static get isProfessionalServiceNotFound() {
        return Boolean(this.isProfessional && this.config?.service?.sid);
    }

}

window.ConfigHolder = ConfigHolder;

export default ConfigHolder;