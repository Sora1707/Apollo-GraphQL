import { ApolloServerPlugin } from "@apollo/server";

export class AuthorizationPlugin implements ApolloServerPlugin {
    async requestDidStart({ contextValue }): Promise<void> {
        // console.log("requestdidstart", contextValue);
    }

    async willResolveField({ source, args, contextValue, info }) {
        console.log("willresolvefield");
        console.log("source", source);
        console.log("args", args);
        console.log("contextValue", contextValue);
        console.log("info", info);
    }
}
