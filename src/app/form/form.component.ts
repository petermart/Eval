import { Component, OnInit } from '@angular/core';

import {Teacher} from '../../models/Teacher';
import {Course} from '../../models/Course';

import {Review} from '../../models/Review';

import {EvalApi} from '../../api/EvalApi';

import {Router, ActivatedRoute, ParamMap, NavigationExtras} from '@angular/router';

import {ReviewDatabase} from '../../database/ReviewDatabase';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  providers: [EvalApi]
})
export class FormComponent implements OnInit {

  subject_id: number;
  subject: Course | Teacher;

  review_type:string;
  new_review:Review = new Review();

  thumbs:boolean = null;

  constructor(
    private eval_api: EvalApi
    private router: Router,
    private route: ActivatedRoute
  ) { }

  getSubject(type:string, subject_id:number) {

    let that = this;

    var subject_promise = new Promise(function (resolve, reject) {
      if (type == "Course") {

        that.eval_api.getCourseById(subject_id).then (function (course:Course) {

          resolve(course);

        }).catch (function (err) {
          reject(err);
        })

      }else if (type == "Teacher") {

        that.eval_api.getTeacherById(subject_id).then (function (teacher:Teacher) {

          resolve(teacher);

        }).catch (function (err) {
          reject(err);
        })
      }
    });

    return subject_promise;

  }

  ngOnInit() {

    this.subject_id = this.route.snapshot.paramMap.get('id');
    this.review_type = this.route.snapshot.paramMap.get('type');

    let that = this;

    this.getSubjectId().then (function (id:number) {
      that.subject_id = id;
      return that.getType();
    }).then (function (type:string) {
      that.review_type = type;
      return that.getSubject(that.review_type, that.subject_id);
    }).then (function (subject: Course | Teacher) {
      that.subject = subject;
    }).then (function (){
      switch (that.review_type) {
        case "Course":
          that.new_review = Review.createCourseReview(<Course>that.subject, null, "")
          break;
        case "Teacher":
          that.new_review = Review.createTeacherReview(<Teacher>that.subject, null, "")
          break;
      }


    })

  }

  formSubmit() {

    if (String(this.new_review.thumbs) == "null") {
      alert ("Please select a option for the first question!")
    }else {
      alert(JSON.stringify(this.new_review))
    }

  }

  /**
  review(review_rating:number) {

    let review:Review;

    if (this.type == "Teacher") {
      review = Review.createTeacherReview(this.name, review_rating);
    }else if (this.type == "Course") {
      review = Review.createCourseReview(this.name, review_rating);
    }

    let that = this;

    ReviewDatabase.addReview(review).then (function (reviews) {
      console.log(reviews);

      if (that.type == "Teacher") {
        that.goTeacherBack();
      }else if (that.type == "Course") {
        that.goCourseBack();
      }

    })

  }
  **/

  goBack() {

    switch (this.review_type){
      case "Course":
        this.goCourseBack();
        break;
      case "Teacher":
        this.goTeacherBack();
        break;
    }

  }

  goTeacherBack() {

    let navigationExtras: NavigationExtras = {
      queryParams: {'teacher_id': this.subject_id}
    }

    this.router.navigate(['/profile'], navigationExtras)


  }

  goCourseBack() {

    let navigationExtras: NavigationExtras = {
      queryParams: {'course_id': this.subject_id}
    }

    this.router.navigate(['/course'], navigationExtras)


  }

  getSubjectId() {
    let that = this;

    let query_promise = new Promise (function (resolve, reject) {
      that.route
      .queryParams
      .subscribe(params => {
        var id = <number>params['id'] || null;
        resolve(id)
      })
    });

    return query_promise
  }

  getType() {
    let that = this;

    let query_promise = new Promise (function (resolve, reject) {
      that.route
      .queryParams
      .subscribe(params => {
        var type = <string>params['type'] || null;
        resolve(type)
      })
    });

    return query_promise
  }

}
