import express from "express";
import fs from "fs";
import { graphqlHTTP } from "express-graphql";
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLString,
} from "graphql";

const app = express();

interface AuthorType {
  id: Number;
  name: String;
}

interface BookType {
  id: Number;
  name: String;
  authorId: Number;
}

const AuthorType: GraphQLObjectType = new GraphQLObjectType({
  name: "Author",
  description: "This represents the author of a book",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    books: {
      type: GraphQLList(BookType),
      resolve: (author: AuthorType) => {
        const books: BookType[] = JSON.parse(
          fs.readFileSync("./data/books.json", "utf-8")
        );
        return books.filter((book) => book.authorId === author.id);
      },
    },
  }),
});

const BookType: GraphQLObjectType = new GraphQLObjectType({
  name: "Book",
  description: "This represents a book written by an author",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    authorId: { type: GraphQLNonNull(GraphQLInt) },
    author: {
      type: AuthorType,
      resolve: (book: BookType) => {
        const authors: AuthorType[] = JSON.parse(
          fs.readFileSync("./data/authors.json", "utf-8")
        );
        return authors.find((author) => author.id === book.authorId);
      },
    },
  }),
});

const RootQueryType: GraphQLObjectType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    books: {
      type: new GraphQLList(BookType),
      description: "List of all books",
      resolve: () => {
        const books: string = fs.readFileSync("./data/books.json", "utf-8");
        return JSON.parse(books);
      },
    },
    book: {
      type: BookType,
      description: "A single book",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (_, args) => {
        const books: BookType[] = JSON.parse(
          fs.readFileSync("./data/books.json", "utf-8")
        );
        return books.find((book) => book.id === args.id);
      },
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: "List of all authors",
      resolve: () => {
        const authors: string = fs.readFileSync("./data/authors.json", "utf-8");
        return JSON.parse(authors);
      },
    },
    author: {
      type: AuthorType,
      description: "A single author",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (_, args) => {
        const authors: AuthorType[] = JSON.parse(
          fs.readFileSync("./data/authors.json", "utf-8")
        );
        return authors.find((author) => author.id === args.id);
      },
    },
  }),
});

const RootMutationType: GraphQLObjectType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutation",
  fields: () => ({
    addBook: {
      type: BookType,
      description: "Add a single book",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (_, args) => {
        console.log("creating book");
        const books: BookType[] = JSON.parse(
          fs.readFileSync("./data/books.json", "utf-8")
        );
        const book: BookType = {
          id: books.length++,
          name: args.name,
          authorId: args.authorId,
        };
        books.push(book);
        fs.writeFileSync("./data/books.json", JSON.stringify(books));
        return book;
      },
    },
  }),
});

const schema: GraphQLSchema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(8080, () => {
  console.log("Server is running on Port 8080");
});
