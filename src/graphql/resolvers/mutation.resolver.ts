import { User } from "../../models/User.model.js";
import { Article } from "../../models/Article.model.js";
import { GraphQLError } from "graphql";

export const mutationResolver = {
    Mutation: {
        async createUser(parent, args) {
            const { username } = args;

            if ((await User.find({ username })).length !== 0) {
                throw new GraphQLError("Username has already existed", {
                    extensions: {
                        code: "BAD_USER_INPUT",
                    },
                });
            }

            const newUser = new User(args);
            await newUser.save();
            return newUser;
        },
        async deleteUser(parent, args) {
            const { id } = args;
            const deletedUser = await User.findById(id);
            if (!deletedUser) {
                throw new GraphQLError("This user does not exist", {
                    extensions: {
                        code: "BAD_USER_INPUT",
                    },
                });
            }
            await User.findByIdAndDelete(id);
            return deletedUser;
        },
    },
};
