import { enumResolvers } from "./enum.resolver.js";
import { queryResolver } from "./query.resolver.js";
import { mutationResolver } from "./mutation.resolver.js";
import { typeResolver } from "./type.resolver.js";

export const resolvers = {
    ...enumResolvers,
    ...queryResolver,
    ...mutationResolver,
    ...typeResolver,
};
