import { HttpClient } from '@angular/common/http'
import {Inject, Injectable} from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { map, shareReplay, tap } from 'rxjs/operators'
import { User } from '../model/user'

const AUTH_DATA = "auth_data"

@Injectable({
    providedIn: 'root'
})
export class AuthStore{

    private subject = new BehaviorSubject<User>(null)

    user$:Observable<User> = this.subject.asObservable()
    isLoggedIn$: Observable<boolean>
    isLoggedOut$:Observable<boolean>

    constructor(private http:HttpClient){
        this.isLoggedIn$ = this.user$.pipe(map(user => !!user))  //true if user exists, else false
        this.isLoggedOut$ = this.isLoggedIn$.pipe(map(loggedIn=> !loggedIn))  //inverse of loggedOut
        
        const user = localStorage.getItem(AUTH_DATA)  //check if user info in localStorage
        if(user){
            this.subject.next(JSON.parse(user))    //equals subject = JSON.parse(user)
        }
    }

    login(email:string, password:string): Observable<User>{
        return this.http.post<User>("/api/login",{email, password})
            .pipe(
                tap(user => {
                    this.subject.next(user)  //sets subject to user
                    localStorage.setItem(AUTH_DATA,JSON.stringify(user))  //store in local storage for browser refreshes
                }),  
                shareReplay()
            )
    }

    logout(){
        this.subject.next(null)  //equals subject = null
        localStorage.removeItem(AUTH_DATA) //clear user info in local storage
    }
}