import React from 'react';
import CandleChart from './CandleChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { OhlcvData } from './GeckoTerminalData';

const OHLCVDisplay: React.FC<{id:string, data: OhlcvData[] }> = ({ id,data }) => {
  const chartData = data.map(item => ({
    Date: new Date(item.date),
    Open: Number(item.o),
    High: Number(item.h),
    Low: Number(item.l),
    Close: Number(item.c)
  })).reverse();
  return (
    <div id={id} className="bg-white shadow-md rounded-lg p-6 mb-6">
      <Tabs className='m-2' defaultValue="candle">
        <TabsList>
          <TabsTrigger value="candle">chart</TabsTrigger>
          <TabsTrigger value="table">table</TabsTrigger>
        </TabsList>
        <TabsContent value="candle">
          <CandleChart data={chartData}/>
        </TabsContent>
        <TabsContent value="table">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Open</TableHead>
                <TableHead>High</TableHead>
                <TableHead>Low</TableHead>
                <TableHead>Close</TableHead>
                <TableHead>Volume</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.o}</TableCell>
                  <TableCell>{item.h}</TableCell>
                  <TableCell>{item.l}</TableCell>
                  <TableCell>{item.c}</TableCell>
                  <TableCell>{item.v}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OHLCVDisplay;