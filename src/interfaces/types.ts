export interface APIResponse {
  status: number;
  success: boolean;
  msg?: string;
  [name: string]: any;
}
