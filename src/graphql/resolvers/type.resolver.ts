import { User } from "../../models/User.model.js";
import { Article } from "../../models/Article.model.js";

export const typeResolver = {
    User: {
        async articles(parent, args) {
            const userId: String = parent.id;
            const articles = Article.find({ authorId: userId });
            return articles;
        },
    },
    Article: {
        async author(parent, args) {
            const userId: string = parent.authorId;
            const user = User.findById(userId);
            return user;
        },
    },
    SearchItem: {
        __resolveType(obj, contextValue, info) {
            if (obj.username) return "User";
            if (obj.content) return "Article";
            return null;
        },
    },
    Entity: {
        __resolveType(obj, contextValue, info) {
            if (obj.name) return "Player";
            if (typeof obj.isPet === "boolean") return "Dog";
            return null;
        },
    },
};
