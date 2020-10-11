import type { EventsComponent } from "./features/events";
import type { LocationComponent } from "./features/location";
import type { KnownDevicesComponent, PlayerComponent } from "./features/player";
import type {
  PortscanComponent,
  StartPortscanComponent
} from "./features/portscan";
import type {
  StartTracerouteComponent,
  TracerouteComponent
} from "./features/traceroute";

export type {
  LocationComponent,
  PortscanComponent,
  StartPortscanComponent,
  TracerouteComponent,
  StartTracerouteComponent,
  EventsComponent,
  PlayerComponent,
  KnownDevicesComponent,
};

export type Component =
  | LocationComponent
  | PortscanComponent
  | StartPortscanComponent
  | TracerouteComponent
  | StartTracerouteComponent
  | PlayerComponent
  | EventsComponent
  | KnownDevicesComponent;
