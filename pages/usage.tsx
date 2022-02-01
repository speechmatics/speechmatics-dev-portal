import Dashboard from '../components/dashboard'

export default function Usage({ }) {

  return <Dashboard>
    <h1>Usage</h1>
    <div>
    </div>
  </Dashboard>
}

const DataElement = (p: DataMonth) => {

}

type DataMonth = {
  month: number;
  year: number;
  usageNormal: number;
  limitNormal: number;
  usageEnhanced: number;
  limitEnhanced: number;
}

const sampleJson = {
  data: [
    {
      month: 7,
      year: 2021,
      usageNormal: 0.5,
      limitNormal: 3,
      usageEnhanced: 1.5,
      limitEnhanced: 3
    },
    {
      month: 8,
      year: 2021,
      usageNormal: 1.5,
      limitNormal: 3,
      usageEnhanced: 0.5,
      limitEnhanced: 3
    },
    {
      month: 9,
      year: 2021,
      usageNormal: 2.5,
      limitNormal: 3,
      usageEnhanced: 1.5,
      limitEnhanced: 3
    },
    {
      month: 10,
      year: 2021,
      usageNormal: 1.5,
      limitNormal: 3,
      usageEnhanced: 2.5,
      limitEnhanced: 3
    },
    {
      month: 11,
      year: 2021,
      usageNormal: 2.9,
      limitNormal: 3,
      usageEnhanced: 1.9,
      limitEnhanced: 3
    },
    {
      month: 12,
      year: 2021,
      usageNormal: 2.5,
      limitNormal: 3,
      usageEnhanced: 0.3,
      limitEnhanced: 3
    },
  ]
}