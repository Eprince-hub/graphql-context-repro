import { gql } from '@apollo/client';
import { getClient } from '../../util/apolloClient';

export type AnimalResponse = {
  animals: {
    id: number;
    firstName: string;
    type: string;
    accessory: string;
  }[];
};

export default async function AnimalsPage() {
  const { data } = await getClient().query<AnimalResponse>({
    query: gql`
      query GetAnimals {
        animals {
          id
          firstName
        }
      }
    `,
  });

  return (
    <div>
      <h1>Testing</h1>

      {data.animals.map((animal) => {
        return (
          <div
            key={`animal-div-${animal.id}`}
            data-test-id={`animal-type-${animal.type}`}
          >
            <div>{animal.firstName}</div>
          </div>
        );
      })}
    </div>
  );
}
