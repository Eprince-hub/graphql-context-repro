'use client';
import { gql, useMutation } from '@apollo/client';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { useState } from 'react';
import { AnimalResponse } from '../page';

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

const deleteAnimalByIdMutation = gql`
  mutation DeleteAnimalById($id: ID!) {
    deleteAnimalById(id: $id) {
      id
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

const updateAnimalByIdMutation = gql`
  mutation UpdateAnimal(
    $id: ID!
    $firstNameOnEditInput: String!
    $typeOnEditInput: String!
    $accessoryOnEditInput: String
  ) {
    updateAnimalById(
      id: $id
      firstName: $firstNameOnEditInput
      type: $typeOnEditInput
      accessory: $accessoryOnEditInput
    ) {
      id
      firstName
      type
      accessory
    }
  }
`;

export default function AdminDashboard() {
  const [firstName, setFirstName] = useState('');
  const [type, setType] = useState('');
  const [accessory, setAccessory] = useState('');
  const [onError, setOnError] = useState('');
  const [firstNameOnEditInput, setFirstNameOnEditInput] = useState('');
  const [typeOnEditInput, setTypeOnEditInput] = useState('');
  const [accessoryOnEditInput, setAccessoryOnEditInput] = useState('');
  const [onEditId, setOnEditId] = useState<number | undefined>();

  const { data, refetch } = useSuspenseQuery<AnimalResponse>(getAnimals);

  const [createAnimalHandler] = useMutation(createAnimal, {
    variables: {
      firstName,
      type,
      accessory,
    },

    onError: (error) => {
      setOnError(error.message);
    },

    onCompleted: () => {
      setOnError('');
      setAccessory('');
      setType('');
      setFirstName('');
    },
  });

  const [deleteAnimalMutationHandler] = useMutation(deleteAnimalByIdMutation, {
    onError: (error) => {
      setOnError(error.message);
    },

    onCompleted: async () => {
      setOnError('');
      await refetch();
    },
  });

  const [handleUpdateAnimal] = useMutation(updateAnimalByIdMutation, {
    variables: {
      id: onEditId,
      firstNameOnEditInput,
      typeOnEditInput,
      accessoryOnEditInput,
    },

    onError: (error) => {
      setOnError(error.message);
      return;
    },

    onCompleted: async () => {
      setOnError('');
      await refetch();
    },
  });

  return (
    <div>
      AdminDashboard
      <br />
      <label>
        First Name
        <input
          value={firstName}
          onChange={(event) => {
            setFirstName(event.currentTarget.value);
          }}
        />
      </label>
      <br />
      <label>
        Type
        <input
          value={type}
          onChange={(event) => {
            setType(event.currentTarget.value);
          }}
        />
      </label>
      <br />
      <label>
        Accessory
        <input
          value={accessory}
          onChange={(event) => {
            setAccessory(event.currentTarget.value);
          }}
        />
      </label>
      <br />
      <br />
      <button onClick={async () => await createAnimalHandler()}>
        Create Animal
      </button>
      <br />
      <br />
      <hr />
      <br />
      {data.animals.map((animal) => {
        const isEditing = onEditId === animal.id;
        return (
          <div key={`animal-div-${animal.id}`} className="animalAdmin">
            {isEditing ? (
              <input
                value={firstNameOnEditInput}
                onChange={(event) => {
                  setFirstNameOnEditInput(event.currentTarget.value);
                }}
              />
            ) : (
              <span>{animal.firstName}</span>
            )}
            {isEditing ? (
              <input
                value={typeOnEditInput}
                onChange={(event) => {
                  setTypeOnEditInput(event.currentTarget.value);
                }}
              />
            ) : (
              <span>{animal.type}</span>
            )}
            {isEditing ? (
              <input
                value={accessoryOnEditInput}
                onChange={(event) => {
                  setAccessoryOnEditInput(event.currentTarget.value);
                }}
              />
            ) : (
              <span>{animal.accessory}</span>
            )}
            <button
              onClick={async () => {
                await deleteAnimalMutationHandler({
                  variables: {
                    id: animal.id,
                  },
                });
              }}
            >
              X
            </button>

            {isEditing ? (
              <button
                onClick={async () => {
                  await handleUpdateAnimal();
                  setOnEditId(undefined);
                }}
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => {
                  setOnEditId(animal.id);
                  setFirstNameOnEditInput(animal.firstName);
                  setAccessoryOnEditInput(animal.accessory || '');
                  setTypeOnEditInput(animal.type);
                }}
              >
                Edit
              </button>
            )}
          </div>
        );
      })}
      <p className="error">{onError}</p>
    </div>
  );
}
