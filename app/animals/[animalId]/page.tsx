import { gql } from '@apollo/client';
import Image from 'next/image';
import { getClient } from '../../../util/apolloClient';

type Props = {
  params: { animalId: string };
};

type Animal = {
  animal: {
    id: number;
    firstName: string;
    type: string;
    accessory: string;
  };
};

export default async function AnimalPage(props: Props) {
  const { data } = await getClient().query<Animal>({
    query: gql`
      query GetAnimalById($id: ID! = ${props.params.animalId}){
        animal(id: $id){
          id
          firstName
          type
          accessory
        }
      }
    `,
  });

  return (
    <div>
      This is a single animal page
      <h1>{data.animal.firstName}</h1>
      <Image
        src={`/images/${data.animal.firstName}.png`}
        width={200}
        height={200}
        alt={data.animal.firstName}
      />
      this is a {data.animal.type} carrying {data.animal.accessory}
    </div>
  );
}
