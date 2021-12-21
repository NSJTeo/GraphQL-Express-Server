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

const BookType = new GraphQLObjectType({
  name: "Book",
  description: "This represents a book written by an author",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    authorId: { type: GraphQLNonNull(GraphQLInt) },
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    books: {
      type: new GraphQLList(BookType),
      description: "List of All Books",
      resolve: () => {
        const books = fs.readFileSync("./data/books.json", "utf-8");
        return JSON.parse(books);
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
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
