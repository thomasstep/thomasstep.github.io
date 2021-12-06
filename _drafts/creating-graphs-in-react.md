

```jsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

import Layout from '../../components/layout';

const TEST_METRICS = [
  {
    // date: new Date('2021-12-15T03:24:00'),
    date: new Date('2021-12-15T03:24:00.000Z'),
    value: 7
  },
  {
    // date: new Date('2021-12-16T03:24:00'),
    date: new Date('2021-12-16T03:24:00.000Z'),
    value: 10
  },
  {
    // date: new Date('2021-12-16T08:24:00'),
    date: new Date('2021-12-16T08:24:00.000Z'),
    value: 12
  },
  {
    // date: new Date('2021-12-16T10:24:00'),
    date: new Date('2021-12-16T10:24:00.000Z'),
    value: 13
  },
  {
    // date: new Date('2021-12-17T03:24:00'),
    date: new Date('2021-12-17T03:24:00.000Z'),
    value: 2
  },
];

const MONTHS = [
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

function dateToTick(date) {
  console.log(date)
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const month = MONTHS[monthIndex];
  const year = date.getFullYear();

  const tick = `${day} ${month} ${year}`;
  return tick;
}

function Metric() {
  const router = useRouter();
  const { id: metricId } = router.query;

  useEffect(() => {
    if (!metricId) {
      return;
    }
  }, [metricId]);


  return (
    <Layout>
      <LineChart width={600} height={300} data={TEST_METRICS}>
        <Line type="monotone" dataKey="value" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" />
        <XAxis
          dataKey="date"
          type="number"
          scale="time"
          domain={[new Date('2021-12-15T03:24:00.000Z').valueOf(), new Date('2021-12-17T03:24:00.000Z').valueOf()]}
          tickFormatter={dateToTick} />
        <YAxis />
       <Tooltip />
      </LineChart>
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {
            TEST_METRICS.map((metric) => {
              return (
                <tr key={metric.date.toISOString()}>
                  <td>{metric.date.toISOString()}</td>
                  <td>{metric.value}</td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
    </Layout>
  );
}

export default Metric;
```