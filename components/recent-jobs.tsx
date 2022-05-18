import { Box, HStack, VStack } from "@chakra-ui/react";
import faker from "@faker-js/faker";
import { observer } from "mobx-react-lite";
import { DescriptionLabel } from "./common";
import { DownloadIcon } from "./icons-library";


export const RecentJobs = observer(({ }) => {

  return <>
    <DescriptionLabel>Check the status of your transcriptions from 01 February 2022 to 08 February 2022.</DescriptionLabel>
    <VStack>
      {testJobs.map(el => (
        <RecentJobElement {...el} />
      ))}
    </VStack>
  </>
});

type RecentJobElementProps = {
  status: 'running' | 'completed';
  fileName: string;
  date: Date;
  accuracy: string;
  duration: string;
  language: string;
  id: string;
}

const RecentJobElement = observer(({ status, fileName, date, accuracy, duration, language, id }: RecentJobElementProps) => {
  return <HStack border='1px solid' borderColor='smBlack.200'
    borderLeft='3px solid' borderLeftColor='smOrange.400' width='100%'>
    <VStack alignItems='flex-start' p={4}>
      <Box fontFamily='RMNeue-bold' color='smNavy.400'>{fileName}</Box>
      <HStack fontSize='0.8em' color='smNavy.350' width='100%' spacing={4} justifyContent='space-between'>
        <Box>{date.getUTCDate()} {date.toLocaleString('default', { month: 'short' })} {date.getFullYear()} {date.getUTCHours()}:{date.getUTCMinutes()}</Box>
        <Box>{accuracy}</Box>
        <Box>{duration}s</Box>
        <Box>{language}</Box>
        <Box>({id})</Box>
      </HStack>
    </VStack>
    <HStack>
      <Box>Running</Box>
      <Box><DownloadIcon color='#000' /></Box>
    </HStack>
  </HStack>
})


const testJobs = [
  ...Array.from({ length: 5 }).map(() => ({
    status: faker.helpers.arrayElement(['running', 'completed']) as 'running' | 'completed',
    fileName: faker.system.commonFileName('mp3'),
    date: faker.datatype.datetime(),
    accuracy: faker.helpers.arrayElement(['standard', 'enhanced']),
    language: faker.helpers.arrayElement(['english', 'french', 'german']),
    duration: faker.random.numeric(3),
    id: faker.git.shortSha(),
  }))
]