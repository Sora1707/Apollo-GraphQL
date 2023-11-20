export const directivesSchema = `#graphql
    directive @uppercase(isSet: Boolean) on FIELD_DEFINITION
    directive @auth(roles: [Role!]) on FIELD_DEFINITION
`;
