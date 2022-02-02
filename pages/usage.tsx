import Dashboard from '../components/dashboard'

export default function Usage({ }) {

  return <Dashboard>
    <h1>Usage</h1>
    <div style={{ display: 'flex', width: '100%'}}>
      {sampleJson.data.map((data:DataMonth) => {

        return <div style={{height: 300, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
          <div style={{height: data.limitNormal*100, flex: 1, padding: 10, display: 'flex', alignItems: 'flex-end'}}>
            <div style={{height: data.usageNormal*100, backgroundColor: 'var(--new-teal-dark)', flex: 1, color: 'white', 
            fontSize: 12, display: 'flex', justifyContent: 'center', paddingTop: 10}}>
              {`${data.usageNormal} / ${data.limitNormal}h`}
            </div>
            <div style={{height: data.usageEnhanced*100, backgroundColor: 'var(--new-blue-light)', flex: 1, color: 'white',
          fontSize: 12, display: 'flex', justifyContent: 'center', paddingTop: 10}}>
            {`${data.usageEnhanced} / ${data.limitEnhanced}h`}
          </div>
          </div>
          <div style={{display: 'flex', color: 'gray', fontSize: 10, justifyContent: 'space-between', padding: '0px 20px 2px 20px'}}>
            <div>normal</div><div>enhanced</div>
            </div>
          <div style={{ alignSelf: 'center', paddingTop: 5}}>{months[data.month]}{' '}{data.year}</div>
        </div>
      })}
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

const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']