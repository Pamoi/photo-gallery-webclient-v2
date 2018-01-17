import { Injectable } from '@angular/core';

@Injectable()
export class AppStateService {
  private state: Map<string, any> = new Map<string, any>();

  constructor() {
  }

  setState(key: string, state: any): void {
    this.state.set(key, state);
  }

  getState(key: string): any {
    return this.state.get(key);
  }

  deleteState(key: string): void {
    this.state.delete(key);
  }
}
