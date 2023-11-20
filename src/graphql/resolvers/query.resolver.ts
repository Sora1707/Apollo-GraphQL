import { User } from "../../models/User.model.js";
import { Article } from "../../models/Article.model.js";
import { dogs, players } from "../../global/data.js";
import { GraphQLError } from "graphql";
import { default as jwt } from "jsonwebtoken";
import { SECRET_KEY } from "../../global/secret.js";
import { directivesSchema } from "../schemas/directives.js";
import { getDirective } from "@graphql-tools/utils";

export const queryResolver = {
    Query: {
        async users(parent, args, contextValue, info) {
            const users = await User.find({});
            const { loggedInUser } = contextValue;
            return users;
        },
        async articles() {
            const articles = await Article.find({});
            return articles;
        },
        async userById(parent, args) {
            const userId: String = args.id;
            const user = await User.findById(userId);
            return user;
        },
        async userByName(parent, args) {
            const username: String = args.username;
            const user = await User.find({ username });
            return user[0];
        },
        async search(parent, { query }) {
            const users = (await User.find()).filter(user =>
                user.username.includes(query)
            );
            const articles = (await Article.find()).filter(article =>
                article.content.includes(query)
            );
            const result = [...users, ...articles];
            return result;
        },
        async login(parent, { username, password }) {
            const user = await User.findOne({ username });

            if (!user) {
                throw new GraphQLError("This user does not exist", {
                    extensions: {
                        code: "BAD_USER_INPUT",
                    },
                });
            }

            if (user.password !== password) {
                throw new GraphQLError("Wrong password", {
                    extensions: {
                        code: "BAD_USER_INPUT",
                    },
                });
            }

            const token = jwt.sign(
                { username, id: user.id, roles: user.roles },
                SECRET_KEY,
                {
                    expiresIn: 300,
                }
            );
            return token;
        },
        entities() {
            const result = [...players, ...dogs];
            return result;
        },
        hello() {
            return "hello world";
        },
    },
};
