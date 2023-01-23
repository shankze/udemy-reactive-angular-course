import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../model/course';
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  map,
  concatMap,
  switchMap,
  withLatestFrom,
  concatAll, shareReplay, catchError
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat, throwError} from 'rxjs';
import {Lesson} from '../model/lesson';
import { CoursesService } from '../services/courses.service';
import { combineLatest} from 'rxjs'

interface CourseData{
  course: Course
  lessons: Lesson[]
} //this combines 2 http calls

@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  data$:Observable<CourseData>

  constructor(private route: ActivatedRoute, private coursesService:CoursesService) {


  }

  ngOnInit() {
    const courseId = parseInt(this.route.snapshot.paramMap.get("courseId"))
    const course$ = this.coursesService.loadCourseById(courseId)
      .pipe(
        startWith(null)
      ) //combine latest displays only after each observable being combined emits atleast one value. A way around this is to emit a null value initially
    const lessons$ = this.coursesService.loadAllCourseLessons(courseId)
      .pipe(
        startWith([]) //combine latest displays only after each observable being combined emits atleast one value. A way around this is to emit a null value initially
      )

    this.data$ = combineLatest([course$, lessons$])
    .pipe(
      map(([course, lessons]) => {
        return {
          course,
          lessons
        }
      }),
      tap(console.log)
    )

  }


}











