import { gql } from '@apollo/client';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLError } from 'graphql';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

type Animal = {
  id: string;
  firstName: string;
  type: string;
  accessory: string;
};

export type GraphQlResponseBody =
  | {
      animal: Animal;
    }
  | Error;

type FakeAdminAnimalContext = {
  isAdmin: boolean;
};

type AnimalInput = {
  firstName: string;
  type: string;
  accessory: string;
};

const typeDefs = gql`
  type Animal {
    id: ID!
    firstName: String!
    type: String!
    accessory: String
  }

  type Query {
    animals: [Animal]
    animal(id: ID!): Animal
    loggedInAnimalByFirstName(firstName: String!): Animal
  }

  type Mutation {
    createAnimal(firstName: String!, type: String!, accessory: String): [Animal]

    deleteAnimalById(id: ID!): Animal

    updateAnimalById(
      id: ID!
      firstName: String!
      type: String!
      accessory: String
    ): Animal

    login(username: String!, password: String!): Animal
  }
`;
const animals = [
  {
    id: '1',
    firstName: 'Lucia',
    type: 'dog',
    accessory: 'glasses',
  },
  {
    id: '2',
    firstName: 'Luna',
    type: 'cat',
    accessory: 'hat',
  },
];

const resolvers = {
  Query: {
    animals: (parent: null, args: null, context: any) => {
      console.log('context from animals', context.fakeSessionToken);
      return animals;
    },

    animal: async (parent: null, args: { id: string }) => {
      return await null;
    },

    loggedInAnimalByFirstName: async (
      parent: null,
      args: { firstName: string },
    ) => {
      return null;
    },
  },

  Mutation: {
    createAnimal: (parent: null, args: AnimalInput, context: any) => {
      console.log('context from createAnimal', context.fakeSessionToken);
      const newAnimal = {
        id: String(animals.length + 1),
        firstName: args.firstName,
        type: args.type,
        accessory: args.accessory,
      };

      animals.push(newAnimal);
      return animals;
    },

    deleteAnimalById: (
      parent: null,
      args: { id: string },
      context: FakeAdminAnimalContext,
    ) => {
      if (!context.isAdmin) {
        throw new GraphQLError('Unauthorized operation');
      }
      return null;
    },

    updateAnimalById: (parent: null, args: AnimalInput & { id: string }) => {
      return {
        id: args.id,
        firstName: args.firstName,
        type: args.type,
        accessory: args.accessory,
      };
    },

    login: (parent: null, args: { username: string; password: string }) => {
      //  FIXME: Implement secure authentication
      if (
        typeof args.username !== 'string' ||
        typeof args.password !== 'string' ||
        !args.username ||
        !args.password
      ) {
        throw new GraphQLError('Required field missing');
      }

      if (args.username !== 'lucia' || args.password !== 'asdf') {
        throw new GraphQLError('Invalid username or password');
      }

      cookies().set('fakeSession', args.username, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });

      return {
        id: '1',
        firstName: 'Lucia',
        type: 'dog',
        accessory: 'glasses',
      };
    },
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const apolloServer = new ApolloServer({
  schema,
});

const handler = startServerAndCreateNextHandler<NextRequest>(apolloServer, {
  context: async (req) => {
    const fakeSessionToken = req.cookies.get('fakeSession');
    console.log('fakeSessionToken', fakeSessionToken);

    return {
      req,
      fakeSessionToken,
    };
  },
});

export async function GET(
  req: NextRequest,
): Promise<NextResponse<GraphQlResponseBody>> {
  return (await handler(req)) as NextResponse<GraphQlResponseBody>;
}

export async function POST(
  req: NextRequest,
): Promise<NextResponse<GraphQlResponseBody>> {
  return (await handler(req)) as NextResponse<GraphQlResponseBody>;
}
