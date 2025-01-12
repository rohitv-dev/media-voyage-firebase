import { Group, Pill, Skeleton, Text } from "@mantine/core";
import { mediaCountQuery } from "../api/queries";
import { useQuery } from "@tanstack/react-query";
import { UserLoader } from "@features/authentication/routes/routes";
import { useRouteLoaderData } from "react-router-dom";

// interface CountCardProps extends CardProps {
//   title: string;
//   count: number;
// }

// const CountCard = ({ title, count, ...rest }: CountCardProps) => {
//   return (
//     <Card {...rest} p="sm" shadow="lg">
//       <Stack gap="xs">
//         <Text fw="bold" c="white">
//           {title}
//         </Text>
//         <Text c="white">{count}</Text>
//       </Stack>
//     </Card>
//   );
// };

export const MediaCountSection = () => {
  const uid = useRouteLoaderData("root") as UserLoader;

  const { data, isPending, isError, error } = useQuery(mediaCountQuery(String(uid)));

  if (isError)
    return (
      <Group grow>
        <Text>{error.message}</Text>
      </Group>
    );
  if (isPending)
    return (
      <Group grow>
        <Skeleton />
      </Group>
    );

  return (
    <>
      <Group wrap="wrap">
        <Pill bg="cyan" c="white" fw="bold" size="md">
          Total - {data.total}
        </Pill>
        <Pill bg="teal" c="white" fw="bold" size="md">
          Completed - {data.completed}
        </Pill>
        <Pill bg="yellow" c="white" fw="bold" size="md">
          In Progress - {data.inProgress}
        </Pill>
        <Pill bg="grape" c="white" fw="bold" size="md">
          Planned - {data.planned}
        </Pill>
        <Pill bg="red" c="white" fw="bold" size="md">
          Dropped - {data.dropped}
        </Pill>
      </Group>
      {/* <Group grow wrap="wrap">
        <CountCard title="Total" count={data.total} bg="cyan" />
        <CountCard title="Completed" count={data.completed} bg="teal" />
        <CountCard title="In Progress" count={data.inProgress} bg="yellow" />
        <CountCard title="Planned" count={data.planned} bg="grape" />
        <CountCard title="Dropped" count={data.dropped} bg="red" />
      </Group> */}
    </>
  );
};
