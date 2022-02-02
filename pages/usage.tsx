import Link from "next/link";
import { CSSProperties } from "react";
import Dashboard from "../components/dashboard";

export default function Usage() {
  return (
    <Dashboard>
      <h1>Usage</h1>

      <h2>Billing Month: {sampleJson.currentUsage.billingMonth}</h2>

      <h3>{sampleJson.currentUsage.standardUsed} hours Standard</h3>
      <h3>
        You have {sampleJson.currentUsage.standardLeft} hours of free usage left
        this month.
      </h3>
      <br />
      <h3>{sampleJson.currentUsage.enhancedUsed} hours Enhanced</h3>
      <h3 style={{ color: "#DA3A4A" }}>
        You have used your allowance of 3 hours this month.{" "}
        <Link href={"/subscribe"}>Setup up the payment.</Link>
      </h3>

      <div style={{ height: 100 }} />

      {/* <div style={{ display: "flex", width: "100%" }}>
        {sampleJson.data.map((data: DataMonth, index: number) => {
          return (
            <div key={index} style={styles.elemContainer}>
              <div
                style={{
                  height: data.limitStandard * 100,
                  ...styles.columnContainer,
                }}
              >
                <div
                  style={{
                    height: data.usageStandard * 100,
                    backgroundColor: "var(--new-teal-dark)",
                    ...styles.column,
                  }}
                >
                  {`${data.usageStandard} / ${data.limitStandard}h`}
                </div>
                <div
                  style={{
                    height: data.usageEnhanced * 100,
                    backgroundColor: "var(--new-blue-light)",
                    ...styles.column,
                  }}
                >
                  {`${data.usageEnhanced} / ${data.limitEnhanced}h`}
                </div>
              </div>
              <div style={{ ...styles.columnLabel }}>
                <div>standard</div>
                <div>enhanced</div>
              </div>
              <div style={{ ...styles.columnYear }}>
                {months[data.month]} {data.year}
              </div>
            </div>
          );
        })}
      </div> */}
    </Dashboard>
  );
}

const DataElement = (p: DataMonth) => {};

type DataMonth = {
  month: number;
  year: number;
  usageStandard: number;
  limitStandard: number;
  usageEnhanced: number;
  limitEnhanced: number;
};

const sampleJson = {
  currentUsage: {
    billingMonth: "01 February 2022 - 28 February 2022",
    totalUsed: 5.5,
    standardUsed: 1.3,
    standardLeft: 1.7,
    enhancedUsed: 3.2,
    enhancedLeft: 0.2,
  },
  data: [
    {
      month: 8,
      year: 2021,
      usageStandard: 1.5,
      limitStandard: 3,
      usageEnhanced: 0.5,
      limitEnhanced: 3,
    },
    {
      month: 9,
      year: 2021,
      usageStandard: 2.5,
      limitStandard: 3,
      usageEnhanced: 1.5,
      limitEnhanced: 3,
    },
    {
      month: 10,
      year: 2021,
      usageStandard: 1.5,
      limitStandard: 3,
      usageEnhanced: 2.5,
      limitEnhanced: 3,
    },
    {
      month: 11,
      year: 2021,
      usageStandard: 2.9,
      limitStandard: 3,
      usageEnhanced: 1.9,
      limitEnhanced: 3,
    },
    {
      month: 12,
      year: 2021,
      usageStandard: 2.5,
      limitStandard: 3,
      usageEnhanced: 0.3,
      limitEnhanced: 3,
    },
    {
      month: 1,
      year: 2022,
      usageStandard: 0.5,
      limitStandard: 3,
      usageEnhanced: 1.5,
      limitEnhanced: 3,
    },
  ],
};

const months = [
  "",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const styles = {
  elemContainer: {
    height: 300,
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
  } as CSSProperties,

  columnContainer: {
    flex: 1,
    padding: 10,
    display: "flex",
    alignItems: "flex-end",
  } as CSSProperties,

  column: {
    flex: 1,
    color: "white",
    fontSize: 12,
    display: "flex",
    justifyContent: "center",
    paddingTop: 10,
  } as CSSProperties,

  columnLabel: {
    display: "flex",
    color: "gray",
    fontSize: 10,
    justifyContent: "space-between",
    padding: "0px 20px 2px 20px",
  } as CSSProperties,

  columnYear: {
    alignSelf: "center",
    paddingTop: 5,
  } as CSSProperties,
};
