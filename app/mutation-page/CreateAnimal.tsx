'use client';
import { gql, useMutation } from '@apollo/client';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { useState } from 'react';

const createAnimal = gql`
  mutation CreateAnimal(
    $firstName: String!
    $type: String!
    $accessory: String
  ) {
    createAnimal(firstName: $firstName, type: $type, accessory: $accessory) {
      id
      firstName
      type
      accessory
    }
  }
`;

const getAnimals = gql`
  query GetAnimals {
    animals {
      id
      firstName
      type
      accessory
    }
  }
`;

export default function CreateAnimal() {
  const [info, setInfo] = useState('');
  const [onError, setOnError] = useState('');

  const { data, refetch } = useSuspenseQuery<any>(getAnimals);

  const [createAnimalHandler] = useMutation(createAnimal, {
    variables: {
      id: 1,
      firstName: 'Marcus',
      type: 'Tortoise',
      accessory: 'Shell',
    },

    onError: (error) => {
      setOnError(error.message);
    },

    onCompleted: async () => {
      await refetch();
      setInfo('Animal created successfully');
    },
  });

  return (
    <div>
      Test Create
      <br />
      <br />
      <br />
      <button onClick={async () => await createAnimalHandler()}>
        Create Animal
      </button>
      <br />
      <br />
      <hr />
      <br />
      {data.animals.map((animal: any) => {
        return (
          <div key={`animal-div-${animal.id}`}>
            <div>{animal.firstName}</div>
          </div>
        );
      })}
      <p className="error">{onError}</p>
      <p className="success">{info}</p>
    </div>
  );
}
