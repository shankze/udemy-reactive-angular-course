import { Component, OnInit } from "@angular/core";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { interval, noop, Observable, of, throwError, timer } from "rxjs";
import { map, filter, finalize, catchError } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { CourseDialogComponent } from "../course-dialog/course-dialog.component";
import { CoursesService } from "../services/courses.service";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";
import { CoursesStore } from "../services/courses.store";
import { ChangeDetectionStrategy } from "@angular/compiler";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  constructor(
    //private coursesService: CoursesService,
    private coursesStore: CoursesStore,
    //private loadingService: LoadingService,
    //private messagesService: MessagesService
  ) {}

  ngOnInit() {
    this.reloadCourses()
  }

  reloadCourses(){

    //WITH NO STATE STORE
    //this.loadingService.loadingOn();  //show loading spinner //another way of showing and hiding loader

    /*const courses$ = this.coursesService.loadAllCourses()
    .pipe(
      map(courses => courses.sort(sortCoursesBySeqNo)),
      catchError(err => {
        const message = "Could not load courses";
        this.messagesService.showErrors(message)
        console.log(message,err);
        return throwError(err)
      })
      //finalize(() => this.loadingService.loadingOff())  //will always run -> success, failure or error  //another way of showing and hiding loader
    );

    //const loadCourses$ = this.loadingService.showLoaderUntilCompleted(courses$);  //acts like a pipe that takes input and gives same output but
    //turns on and off loading screen in between

    this.beginnerCourses$ = loadCourses$
      .pipe(
        map(courses => courses.filter(course => course.category == 'BEGINNER'))
      );

    this.advancedCourses$ = loadCourses$
      .pipe(
        map(courses => courses.filter(course => course.category == 'ADVANCED'))
      );
      */

    //WITH STATE STORE
    this.beginnerCourses$ = this.coursesStore.filterByCategory("BEGINNER")
    this.advancedCourses$ = this.coursesStore.filterByCategory("ADVANCED")
  }

}
