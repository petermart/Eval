import {Injectable} from '@angular/core';

import {HttpClient} from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import {Teacher} from '../models/Teacher';
import {Course} from '../models/Course';
import {Department} from '../models/Department';
import {Session} from '../models/Session';
import {Student} from '../models/Student';
import {StudentSchedule} from '../models/StudentSchedule';

/** Review Stuff **/
import {Review} from '../models/Review';
import {ReviewDatabase} from '../database/ReviewDatabase';


import endpoint from './Endpoint';

@Injectable()
export class EvalApi {

  constructor(private http:HttpClient) {

  }

  getSessions() {

    let sessions_promise = new Promise((resolve, reject) => {
      this.http.get(endpoint + '/showSessions')
        .toPromise()
        .then(
          res => {
            let sessions:Session[] = (<any[]>res).map(function (item) {
              return <Session>{id: item["Session_Id"],
                               hour: item["Session_Hour"],
                               course_id: Number(item["Course_Id"]),
                               school_id: Number(item["School_Id"]),
                               staff_id: Number(item["Staff_Id"]),
                               staff_id2: Number(item["Staff_Id2"]),
                               staff_id3: Number(item["Staff_Id3"])
                             };
            })

            resolve(sessions);
          }
        ).catch (function (error) {
          reject(error);
        })
    });

    return sessions_promise;


  }

  getSessionsByTeacher(teacher_id:number) {

    let that = this;

    var sessions_promise = new Promise(function (resolve, reject) {

      that.getSessions().then (function (sessions:Session[]) {
        var teacher_sessions:Session[] = sessions.filter(function (session:Session) {
          return session["staff_id"] == teacher_id;
        });

        resolve(teacher_sessions);
      }).catch (function (err) {
        reject(err);
      })
    })

    return sessions_promise;

  }

  getSessionsByCourse(course_id:number) {
    let that = this;

    var sessions_promise = new Promise(function (resolve, reject) {

      that.getSessions().then (function (sessions:Session[]) {
        var course_sessions:Session[] = sessions.filter(function (session:Session) {
          return session["course_id"] == course_id;
        });

        resolve(course_sessions);
      }).catch (function (err) {
        reject(err);
      })
    })

    return sessions_promise;
  }

  getTeachers() {
    let teacher_promise = new Promise((resolve, reject) => {
      this.http.get(endpoint + '/showTeachers')
        .toPromise()
        .then(
          res => {

            let teachers:Teacher[] = (<any[]>res).filter(function (item) {

              if (item["Staff_Id"] == "1") {
                return false;
              }else {
                return true;
              }

            }).map(function (item){
                return <Teacher>{name: item["First_Name"] + " " + item["Last_Name"],
                                 first_name: item["First_Name"],
                                 last_name: item["Last_Name"],
                                 description: null,
                                 prefix: item["Prefix"],
                                 is_admin: <number>item["Is_Admin"],
                                 image: item["Image"],
                                 department_id: <number>item["Department_Id"],
                                 email: item["Email"],
                                 id: item["Staff_Id"] };
            })

            resolve(teachers);
          }
        ).catch (function (error) {
          reject(error);
        })
    });

    return teacher_promise;

  }

  getTeachersFromSessions (sessions:Session[]) {

    let that = this;

    var teachers_promise = new Promise(function (resolve, reject) {
      that.getTeachers().then (function (teachers: Teacher[]) {

        var session_teachers:Teacher[] = [];

        sessions.forEach(function (session:Session) {
          var teacher:Teacher = teachers.find(function (teacher:Teacher) {
            return teacher.id == session.staff_id;
          })

          session_teachers.push(teacher);
        })

        resolve(session_teachers);

      }).catch (function (err) {
        reject(err);
      })
    });

    return teachers_promise;

  }

  getTeacherById(id:number){

    let that = this;

    var teacher_promise = new Promise(function (resolve, reject) {

      that.getTeachers().then (function (teachers: Teacher[]) {

        var teacher:Teacher = teachers.find(function (teacher:Teacher) {
          return teacher.id == id;
        })

        resolve(teacher);

      }).catch (function (err) {
        reject(err);
      })

    })

    return teacher_promise;

  }

  getCourses() {

    let courses_promise = new Promise((resolve, reject) => {
      this.http.get(endpoint + '/showCourses')
        .toPromise()
        .then(
          res => {
            let courses:Course[] = (<any[]>res).map(function (item) {
              return <Course>{name: item["Course_Name"], description: null, id: <number>item["Course_Id"], image: item["Course_Image"], department_id: <number>item["Department_Id"], entry_grade: <number>item["Entry_Grade"], exit_grade: <number>item["Exit_Grade"], credit: <number>item["Credit"]}
            })

            resolve(courses);
          }
        ).catch (function (error) {
          reject(error);
        })
    });

    return courses_promise;

  }

  getCoursesFromSessions(sessions:Session[]) {

    let that = this;

    var courses_promise = new Promise(function (resolve, reject) {

      that.getCourses().then (function (courses: Course[]) {

        var session_courses:Course[] = [];

        sessions.forEach(function (session:Session) {
          var course:Course = courses.find(function (course:Course) {
            return course.id == session.course_id;
          })

          session_courses.push(course);
        })

        resolve(session_courses);

      }).catch (function (err) {
        reject(err);
      })

    });

    return courses_promise;

  }

  getCourseById(id:number) {

    let that = this;

    var course_promise = new Promise(function (resolve, reject) {

      that.getCourses().then (function (courses:Course[]) {

        var course = courses.find(function (course:Course) {
          return course.id == id;
        });

        resolve(course);

      }).catch (function (err) {
        reject(err);
      })

    })

    return course_promise;

  }

  getDepartments() {

    let departments_promise = new Promise((resolve, reject) => {
      this.http.get(endpoint + '/showDepartments')
        .toPromise()
        .then (
          res => {
            let departments:Department[] = (<any>res).map (function (item) {
              return <Department>{id: item.Department_Id, name: item.Department_Name, description: item.Department_Description}
            })

            resolve(departments);
          }
        ).catch (function (err) {
          reject (err);
        })
    })


    return departments_promise;
  }

  getDepartmentById(id:number) {

    let that = this;

    let department_promise = new Promise(function (resolve, reject) {

      that.getDepartments().then (function (departments:Department[]) {
        var department:Department = departments.find(function (department:Department) {
          return department.id == id;
        });

        resolve(department);
      }).catch (function (error) {
        reject(error);
      })

    })

    return department_promise;

  }

  getReviews() {

    let that = this;

    let reviews_promise = new Promise((resolve, reject) => {
      this.http.get(endpoint + '/showReviews')
        .toPromise()
        .then (
          res => {
            let reviews: Review[] = (<any>res).map(function(item) {
              let approval: boolean = null;

              switch (Number(item["Approval"])) {
                case 1:
                  approval = true;
                  break;
                case 0:
                  approval = false;
                  break;
                default:
                  approval = null;
                  break;
              }

              return <Review>{
                thumbs: approval,
                comment: item["Explanation"],
                session_id: Number(item["Session_Id"]),
                schedule_id: Number(item["Schedule_Id"]),
                student_id: Number(item["Student_Id"])
              };

            });

            resolve(reviews);
          }).catch (function (err) {
          reject (err);
        })
    });

    return reviews_promise;

  }

  getReviewsBySessions(sessions:Session[]) {

    let that = this;

    var review_promise = new Promise (function (resolve, reject) {

      var session_id_list:Number[] = sessions.map(function (session:Session) {
        return Number(session.id);
      })

      that.getReviews().then (function (reviews:Review[]) {
        var filtered_reviews:Review[] = reviews.filter(function (review:Review) {
          return session_id_list.includes(Number(review.session_id));
        })

        resolve(filtered_reviews);
      }).catch (function (err) {
        reject(err);
      })

    })

    return review_promise;

  }

  getReviewsByTeacherId(id:number) {

    let that = this;

    var review_promise = new Promise (function (resolve, reject) {


      that.getSessionsByTeacher(id).then (function (sessions:Session[]) {
        return that.getReviewsBySessions(sessions);
      }).then (function (reviews:Review[]) {
        resolve(reviews);
      }).catch (function (err) {
        reject(err);
      })

    })

    return review_promise;

  }

  getReviewsByCourseId(id:number) {

    let that = this;

    var review_promise = new Promise (function (resolve, reject) {

      that.getSessionsByCourse(id).then (function (sessions:Session[]) {
        return that.getReviewsBySessions(sessions);
      }).then (function (reviews:Review[]) {
        resolve(reviews);
      }).catch (function (err) {
        reject (err);
      })

    })

    return review_promise;

  }

  createReview(review:Review) {

    let that = this;

    var reviews_promise = new Promise(function (resolve, reject) {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }

      var approval:number = null;

      switch (review.thumbs.toString()) {
        case "true":
          approval = 1;
          break;
        case "false":
          approval = 0;
          break;
        default:
          approval = null;
          break;
      }

      var payload:any = {
        "approval": approval,
        "explanation": review.comment,
        "student_id": review.student_id,
        "session_id": review.session_id,
        "schedule_id": review.schedule_id
      };

      console.log("PAYLOAD");

      that.http.post(endpoint + '/newReview', payload, httpOptions)
        .toPromise()
        .then (function (res) {
          console.log("success");
          resolve({"status": "success"})
        }).catch (function (err) {
          reject(err);
        })

    })

    return reviews_promise;

  }

  getStudents() {

    let that = this;

    var students_promise = new Promise(function (resolve, reject ) {

      that.http.get(endpoint + '/showStudents')
        .toPromise()
        .then (function (res) {

          var students:Student[] = [];

          (<any[]>res).forEach(function (item) {
            var student:Student = <Student> {
              id: Number(item["Student_Id"]),
              first_name: item["First_Name"],
              last_name: item["Last_Name"],
              email: item["Email"],
              full_name: item["First_Name"] + " " + item["Last_Name"]
            };

            students.push(student);
          })

          resolve(students);

        }).catch (function (err) {
          reject(err);
        })

    })

    return students_promise;

  }

  getStudentByEmail(email:string) {

    let that = this;

    var student_promise = new Promise (function (resolve, reject) {

      that.getStudents().then (function (students:Student[]) {

        var student:Student = students.find(function (student:Student) {
          return student.email == email;
        })

        resolve(student);

      }).catch (function (err) {
        reject(err);
      })

    })

    return student_promise;

  }

  //TODO
  getSchedules() {

    let that = this;

    var schedules_promise = new Promise (function (resolve, reject) {

      that.http.get(endpoint + '/showSchedules')
        .toPromise()
        .then (function (res) {

          var schedules:StudentSchedule[] = [];

          (<any[]>res).forEach(function (item) {
            var schedule:StudentSchedule = <StudentSchedule> {
              id: Number(item["Schedule_Id"]),
              student_id: Number(item["Student_Id"]),
              session_id1: Number(item["Session_Id1"]),
              session_id2: Number(item["Session_Id2"]),
              session_id3: Number(item["Session_Id3"]),
              session_id4: Number(item["Session_Id4"]),
              session_id5: Number(item["Session_Id5"]),
              session_id6: Number(item["Session_Id6"]),
              session_id7: Number(item["Session_Id7"]),
              session_id8: Number(item["Session_Id8"]),
            };

            schedules.push(schedule);
          })

          resolve(schedules);

        }).catch (function (err) {
          reject(err);
        })
    })

    return schedules_promise;

  }

  //TODO
  getScheduleByStudentId(id:number) {

    let that = this;

    var schedule_promise = new Promise (function (resolve, reject) {

      that.getSchedules().then (function (schedules:StudentSchedule[]) {
        var schedule:StudentSchedule = schedules.find (function (schedule:StudentSchedule) {
          return schedule.student_id == id;
        })

        resolve (schedule);
      }).catch (function (err) {
        reject (err);
      });

    });

    return schedule_promise;

  }

}
