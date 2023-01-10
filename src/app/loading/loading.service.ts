import {Injectable} from '@angular/core'
import { BehaviorSubject, Observable, of } from 'rxjs'
import { concatMap, finalize, tap } from 'rxjs/operators';

@Injectable()
export class LoadingService {

    private loadingSubject = new BehaviorSubject<boolean>(false);

    loading$: Observable<boolean> = this.loadingSubject.asObservable();

    showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
        return of(null)  //create new observable to trigger loading indicator
            .pipe(
                tap(() => this.loadingOn()),
                concatMap(() => obs$), //will make the output the same as input
                finalize(() => this.loadingOff())  //when emitting is complete
            );
    }

    loadingOn(){
        this.loadingSubject.next(true);
    }

    loadingOff(){
        this.loadingSubject.next(false);
    }

}