import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventServiceService {

  private dataObserved = new BehaviorSubject<any>('');
  currentEvent = this.dataObserved.asObservable();
  constructo(){}
  
  publish(param):void {
    this.dataObserved.next(param);
  }
  
}
