import { Role } from "../../global/roles.js";

export const enumResolvers = {
    Role: {
        USER: Role.User,
        ADMIN: Role.Admin,
    },
};
