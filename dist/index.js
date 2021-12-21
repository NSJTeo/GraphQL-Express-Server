"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const express_graphql_1 = require("express-graphql");
const graphql_1 = require("graphql");
const app = (0, express_1.default)();
const books = [
    { id: 1, name: "Dune", authorId: 1 },
    { id: 2, name: "Dune Messiah", authorId: 1 },
    { id: 3, name: "Children of Dune", authorId: 1 },
    { id: 4, name: "God Emperor of Dune", authorId: 1 },
    { id: 5, name: "Heretics of Dune", authorId: 1 },
    { id: 6, name: "Chapterhouse: Dune", authorId: 1 },
    { id: 7, name: "The Three-Body Problem", authorId: 2 },
    { id: 8, name: "The Dark Forest", authorId: 2 },
    { id: 8, name: "Death's End", authorId: 2 },
];
const BookType = new graphql_1.GraphQLObjectType({
    name: "Book",
    description: "This represents a book written by an author",
    fields: () => ({
        id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
        name: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        authorId: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
    }),
});
const RootQueryType = new graphql_1.GraphQLObjectType({
    name: "Query",
    description: "Root Query",
    fields: () => ({
        books: {
            type: new graphql_1.GraphQLList(BookType),
            description: "List of All Books",
            resolve: () => {
                const books = fs_1.default.readFileSync("./data/books.json", "utf-8");
                return JSON.parse(books);
            },
        },
    }),
});
const schema = new graphql_1.GraphQLSchema({
    query: RootQueryType,
});
app.use("/graphql", (0, express_graphql_1.graphqlHTTP)({
    schema,
    graphiql: true,
}));
app.listen(8080, () => {
    console.log("Server is running on Port 8080");
});
