import { CalculatorService } from "./calculator.service";

describe("CalculatorService", () => {
  let logger: any;
  let calculatorService: CalculatorService;

  beforeEach(() => {
    logger = jasmine.createSpyObj("LoggerService", ["log"]);
    calculatorService = new CalculatorService(logger);
  });

  it("should add two numbers", () => {
    const result = calculatorService.add(2, 4);

    expect(result).toBe(6);
    expect(logger.log).toHaveBeenCalledTimes(1);
  });

  it("should subtract two numbers", () => {
    const result = calculatorService.subtract(7, 3);

    expect(result).toBe(4, "unexpected subtraction result");
  });
});
