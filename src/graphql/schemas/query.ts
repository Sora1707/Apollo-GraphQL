export const querySchema = `#graphql
    type Query {
        users: [User] @auth(roles: [USER])
        articles: [Article]
        userById(id: ID!): User
        userByName(username: String): User 
        search(query: String): [SearchItem]
        login(username: String!, password: String!): String
        hello: String @uppercase(isSet: true)
    }
`;
