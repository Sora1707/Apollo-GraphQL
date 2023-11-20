export const mainSchema = `#graphql
    enum Role {
        USER
        ADMIN
    }

    input UserDto {
        username: String
        password: String
        roles: [Role]
    }

    type User {
        id: ID!
        username: String
        password: String
        roles: [Role]
        articles: [Article]
    }

    type Article {
        id: ID!
        content: String
        author: User
    }

    union SearchItem = User | Article
`;
