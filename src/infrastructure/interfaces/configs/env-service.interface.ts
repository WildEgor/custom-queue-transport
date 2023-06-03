export interface IEnvService {
  getString(name: string): string;

  getNumber(name: string): number;

  getBoolean(name: string): boolean;

  getDate(name: string): Date;
}
