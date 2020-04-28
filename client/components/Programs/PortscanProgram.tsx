import React from "react";
import { format } from "date-fns";
import { Markdown } from "../library/Markdown";
import { PortscanProcess } from "../../types/PortscanProcess";
import { CommandLink } from "../library/CommandLink";
import { Box } from "..";

type TemplateValues = {
  startDate: Date;
  ip: string;
  latency: number;
  ports: Array<{ name: string; number: number }>;
};
const template = ({ startDate, ip, latency, ports }: TemplateValues) => `
Starting pscan 4.3.3 at ${format(startDate, "yyyy-mm-dd")}  
Scan report for ${ip}  
Host is up (latency ${latency}ms)  

| PORT | STATE | SERVICE |
|----|-----|
${ports
  .map((port) => {
    return `| ${port.number}/tcp | open | ${port.name}`;
  })
  .join("\n")}
`;

const startDate = new Date();

type Props = {
  process: PortscanProcess;
};
export const PortscanProgram = ({ process }: Props) => {
  return (
    <div data-test="portscanProgram">
      <Box marginBottom={1}>
        <CommandLink block href="background">
          Close
        </CommandLink>
      </Box>
      <Markdown>
        {template({
          startDate,
          ip: process.target,
          latency: 27,
          ports: process.ports,
        })}
      </Markdown>
    </div>
  );
};