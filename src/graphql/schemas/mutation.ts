export const mutationSchema = `#graphql
    type Mutation {
        createUser(username: String!, password: String!, roles: [Role]): User
        deleteUser(id: ID!): User
    }
`;
