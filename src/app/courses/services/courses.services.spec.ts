import { TestBed } from "@angular/core/testing";
import { CoursesService } from "./courses.service";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { COURSES } from "../../../../server/db-data";
import { Course } from "../model/course";
import { HttpErrorResponse } from "@angular/common/http";

describe("CoursesService", () => {
  let coursesService: CoursesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CoursesService],
    });

    coursesService = TestBed.get(CoursesService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it("should retrieve all courses", () => {
    coursesService.findAllCourses().subscribe((courses) => {
      expect(courses).toBeTruthy("No courses returned");
      expect(courses.length).toBe(12, "Incorrect number of courses");

      const course12 = courses.find((course) => course.id === 12);
      expect(course12.titles.description).toBe("Angular Testing Course");
    });

    // Elvárom az egyszeri request-et
    const testRequest = httpTestingController.expectOne("/api/courses");
    // Ami egy GET kérés
    expect(testRequest.request.method).toEqual("GET");
    // Ami visszadja az alábbi adatot
    testRequest.flush({
      payload: Object.values(COURSES),
    });
  });

  it("should retrieve a course by id", () => {
    coursesService.findCourseById(12).subscribe((course) => {
      expect(course).toBeTruthy("Course not found");
      expect(course.id).toBe(12);
    });

    const req = httpTestingController.expectOne("/api/courses/12");
    expect(req.request.method).toEqual("GET");
    req.flush(COURSES[12]);
  });

  it("should save the course data", () => {
    const changes: Partial<Course> = {
      titles: {
        description: "NG Course",
      },
    };

    coursesService.saveCourse(12, changes).subscribe((course) => {
      expect(course).toBeTruthy("PUT error");
      expect(course.id).toBe(12);
    });

    const req = httpTestingController.expectOne("/api/courses/12");
    expect(req.request.method).toEqual("PUT");
    expect(req.request.body.titles.description).toEqual(
      changes.titles.description
    );
    req.flush({
      ...COURSES[12],
      ...changes,
    });
  });

  it("should give an error if save course failed", () => {
    const changes: Partial<Course> = {
      titles: {
        description: "NG Course",
      },
    };

    coursesService.saveCourse(12, changes).subscribe(
      () => fail("Request failed"),
      (error: HttpErrorResponse) => expect(error.status).toBe(500)
    );

    const req = httpTestingController.expectOne("/api/courses/12");
    expect(req.request.method).toBe("PUT");
    req.flush("Save course failed!", {
      status: 500,
      statusText: "Internal Server Error",
    });
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});
