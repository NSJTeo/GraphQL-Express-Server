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
const AuthorType = new graphql_1.GraphQLObjectType({
    name: "Author",
    description: "This represents the author of a book",
    fields: () => ({
        id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
        name: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        books: {
            type: (0, graphql_1.GraphQLList)(BookType),
            resolve: (author) => {
                const books = JSON.parse(fs_1.default.readFileSync("./data/books.json", "utf-8"));
                return books.filter((book) => book.authorId === author.id);
            },
        },
    }),
});
const BookType = new graphql_1.GraphQLObjectType({
    name: "Book",
    description: "This represents a book written by an author",
    fields: () => ({
        id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
        name: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        authorId: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
        author: {
            type: AuthorType,
            resolve: (book) => {
                const authors = JSON.parse(fs_1.default.readFileSync("./data/authors.json", "utf-8"));
                return authors.find((author) => author.id === book.authorId);
            },
        },
    }),
});
const RootQueryType = new graphql_1.GraphQLObjectType({
    name: "Query",
    description: "Root Query",
    fields: () => ({
        books: {
            type: new graphql_1.GraphQLList(BookType),
            description: "List of all books",
            resolve: () => {
                const books = fs_1.default.readFileSync("./data/books.json", "utf-8");
                return JSON.parse(books);
            },
        },
        authors: {
            type: new graphql_1.GraphQLList(AuthorType),
            description: "List of all authors",
            resolve: () => {
                const authors = fs_1.default.readFileSync("./data/authors.json", "utf-8");
                return JSON.parse(authors);
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
