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
        book: {
            type: BookType,
            description: "A single book",
            args: {
                id: { type: graphql_1.GraphQLInt },
            },
            resolve: (_, args) => {
                const books = JSON.parse(fs_1.default.readFileSync("./data/books.json", "utf-8"));
                return books.find((book) => book.id === args.id);
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
        author: {
            type: AuthorType,
            description: "A single author",
            args: {
                id: { type: graphql_1.GraphQLInt },
            },
            resolve: (_, args) => {
                const authors = JSON.parse(fs_1.default.readFileSync("./data/authors.json", "utf-8"));
                return authors.find((author) => author.id === args.id);
            },
        },
    }),
});
const RootMutationType = new graphql_1.GraphQLObjectType({
    name: "Mutation",
    description: "Root Mutation",
    fields: () => ({
        addBook: {
            type: BookType,
            description: "Add a single book",
            args: {
                name: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                authorId: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
            },
            resolve: (_, args) => {
                const books = JSON.parse(fs_1.default.readFileSync("./data/books.json", "utf-8"));
                const book = {
                    id: books.length + 1,
                    name: args.name,
                    authorId: args.authorId,
                };
                books.push(book);
                fs_1.default.writeFileSync("./data/books.json", JSON.stringify(books));
                return book;
            },
        },
        addAuthor: {
            type: BookType,
            description: "Add a single author",
            args: {
                name: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
            },
            resolve: (_, args) => {
                const authors = JSON.parse(fs_1.default.readFileSync("./data/authors.json", "utf-8"));
                console.log(authors.length);
                console.log(authors.length + 1);
                const author = {
                    id: authors.length + 1,
                    name: args.name,
                };
                authors.push(author);
                fs_1.default.writeFileSync("./data/authors.json", JSON.stringify(authors));
                return author;
            },
        },
    }),
});
const schema = new graphql_1.GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType,
});
app.use("/graphql", (0, express_graphql_1.graphqlHTTP)({
    schema,
    graphiql: true,
}));
app.listen(8080, () => {
    console.log("Server is running on Port 8080");
});
