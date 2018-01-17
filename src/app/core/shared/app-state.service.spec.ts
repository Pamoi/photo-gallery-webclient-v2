import { TestBed, inject } from '@angular/core/testing';

import { AppStateService } from './app-state.service';

describe('AppStateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppStateService]
    });
  });

  it('should be created', inject([AppStateService], (service: AppStateService) => {
    expect(service).toBeTruthy();
  }));

  it('should store state', inject([AppStateService], (service: AppStateService) => {
    const state = { someVale: 13, anotherValue: true };
    const key = 'AppStateServiceTest';

    service.setState(key, state);
    expect(service.getState(key)).toEqual(state);
    expect(service.getState('Unknown key')).toBeUndefined();

    service.deleteState(key);
    expect(service.getState(key)).toBeUndefined();
  }));

  it('should delete state', inject([AppStateService], (service: AppStateService) => {
    const state = { someVale: 13, anotherValue: true };
    const key = 'AppStateServiceTest';

    service.setState(key, state);
    expect(service.getState(key)).toEqual(state);

    service.deleteState(key);
    expect(service.getState(key)).toBeUndefined();
  }));
});
