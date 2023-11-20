export const entitySchema = `#graphql
    interface Entity {
        x: Int!
        y: Int!
    }
    
    type Player implements Entity {
        x: Int!
        y: Int!
        name: String!
    }

    type Dog implements Entity {
        x: Int!
        y: Int!
        isPet: Boolean!
    }

    type Query {
        entities: [Entity]
    }
`;
