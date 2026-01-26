import { Type } from "@angular/core";

export interface ButtonInterface {
  label: string,
  route: string
}

export interface TabItem {
  label: string;
  component: Type<any>;
}