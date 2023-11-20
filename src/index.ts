import { ApolloServer, ApolloServerPlugin } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { mainSchema } from "./graphql/schemas/main.js";
import { querySchema } from "./graphql/schemas/query.js";
import { resolvers } from "./graphql/resolvers/index.js";
import * as db from "./database/index.js";
import { entitySchema } from "./graphql/schemas/entity.js";
import { mutationSchema } from "./graphql/schemas/mutation.js";
import { default as jwt } from "jsonwebtoken";
import { SECRET_KEY } from "./global/secret.js";
import { directivesSchema } from "./graphql/schemas/directives.js";
import { AuthorizationPlugin } from "./plugins/auth.js";
import { MapperKind, getDirective, mapSchema } from "@graphql-tools/utils";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { Role } from "./global/roles.js";
import { GraphQLError } from "graphql";

function upperDirectiveTransformer(schema, directiveName) {
    return mapSchema(schema, {
        // Executes once for each object field in the schema
        [MapperKind.OBJECT_FIELD]: fieldConfig => {
            // Check whether this field has the specified directive
            const upperDirective = getDirective(
                schema,
                fieldConfig,
                directiveName
            )?.[0];

            if (upperDirective) {
                // Get this field's original resolver
                const { resolve } = fieldConfig;
                const { isSet } = upperDirective;

                // Replace the original resolver with a function that *first* calls
                // the original resolver, then converts its result to upper case
                return {
                    ...fieldConfig,
                    async resolve(source, args, context, info) {
                        const result = await resolve(
                            source,
                            args,
                            context,
                            info
                        );
                        if (typeof result === "string" && isSet) {
                            return result.toUpperCase();
                        }
                        return result;
                    },
                };
            }
        },
    });
}

function authDirectiveTransformer(schema, directiveName) {
    return mapSchema(schema, {
        // Executes once for each object field in the schema
        [MapperKind.OBJECT_FIELD]: fieldConfig => {
            // Check whether this field has the specified directive
            const authDirective = getDirective(
                schema,
                fieldConfig,
                directiveName
            )?.[0];

            if (authDirective) {
                // Get this field's original resolver
                const { resolve } = fieldConfig;
                const { roles } = authDirective;

                // Replace the original resolver with a function that *first* calls
                // the original resolver, then converts its result to upper case
                fieldConfig.resolve = async function (
                    source,
                    args,
                    context,
                    info
                ) {
                    const { loggedInUser } = context;
                    console.log(loggedInUser);
                    if (!loggedInUser) {
                        throw new GraphQLError("Unauthorized", {
                            extensions: {
                                code: "UNAUTHORIZED",
                                http: { status: 401 },
                            },
                        });
                    }
                    const users = await resolve(source, args, context, info);
                    if (
                        !loggedInUser.roles.includes(Role.Admin) &&
                        Array.isArray(users)
                    ) {
                        return users.filter(
                            user => user._id.toString() == loggedInUser.id
                        );
                    }
                    return users;
                };
                return fieldConfig;
            }
        },
    });
}

async function run() {
    await db.connect("crud_dev}");

    let schema = makeExecutableSchema({
        typeDefs: [
            querySchema,
            mutationSchema,
            mainSchema,
            entitySchema,
            directivesSchema,
        ],
        resolvers,
    });

    const directiveTransformers = [
        { directiveName: "uppercase", transform: upperDirectiveTransformer },
        { directiveName: "auth", transform: authDirectiveTransformer },
    ];

    schema = directiveTransformers.reduce(function (
        currentSchema,
        { directiveName, transform }
    ) {
        return transform(currentSchema, directiveName);
    },
    schema);

    // schema = authDirectiveTransformer(schema, "auth");
    const server = new ApolloServer({ schema });
    // Passing an ApolloServer instance to the `startStandaloneServer` function:
    //  1. creates an Express app
    //  2. installs your ApolloServer instance as middleware
    //  3. prepares your app to handle incoming requests
    const { url } = await startStandaloneServer(server, {
        listen: { port: 4000 },
        context: async function ({ res, req }) {
            let loggedInUser = null;
            try {
                const token = req.headers.authorization;
                loggedInUser = await jwt.verify(token, SECRET_KEY);
            } catch (error) {
            } finally {
                return {
                    loggedInUser,
                };
            }
        },
    });
    console.log(`🚀  Server ready at: ${url}`);
}

run();
