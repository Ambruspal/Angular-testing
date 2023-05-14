import { TestBed } from "@angular/core/testing";
import { CalculatorService } from "./calculator.service";
import { LoggerService } from "./logger.service";

describe("CalculatorService", () => {
  let loggerSpy: any;
  let calculatorService: CalculatorService;

  beforeEach(() => {
    loggerSpy = jasmine.createSpyObj("LoggerService", ["log"]);

    TestBed.configureTestingModule({
      providers: [
        CalculatorService,
        {
          provide: LoggerService,
          useValue: loggerSpy,
        },
      ],
    });

    calculatorService = TestBed.get(CalculatorService);
  });

  it("should add two numbers", () => {
    const result = calculatorService.add(2, 4);

    expect(result).toBe(6);
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });

  it("should subtract two numbers", () => {
    const result = calculatorService.subtract(7, 3);

    expect(result).toBe(4, "unexpected subtraction result");
  });
});
