import RandExp from 'randexp';
import * as input from './input';
// This gives us an object called 'input'
// that has a field for every exported item from the input module

beforeAll(() => {
  console.log('This will run before every test');
});

describe('Menu tests', () => {
  afterAll(() => {
    input.rl.close();
  });

  describe('initialPrompt', () => {
    test('should resolve with the answer when provided a valid input', async () => {
      const responseOptions = ['0', '1', '2', 'q'];
      const randomIndex = Math.floor(Math.random() * responseOptions.length);
      const validInput = responseOptions[randomIndex];

      input.rl.question = jest.fn().mockImplementationOnce(
        (questionText, answer) => answer(validInput),
      );

      await expect(input.initialPrompt()).resolves.toBe(validInput);
    });

    test('should reject when provided an invalid input', async () => {
      const invalidInput = new RandExp(/^[a-zA-Z0-9]{2,}$/).gen();

      input.rl.question = jest.fn().mockImplementationOnce(
        (questionText, answer) => answer(invalidInput),
      );

      await expect(input.customerPrompt()).rejects.toBeUndefined();
    });
  });
  describe('customerPrompt', () => {
    test('should resolve with the answer when provided a valid input', async () => {
      const responseOptions = ['0', '1', '2', '3', 'q'];
      const randomIndex = Math.floor(Math.random() * responseOptions.length);
      const validInput = responseOptions[randomIndex];

      input.rl.question = jest.fn().mockImplementationOnce(
        (questionText, answer) => answer(validInput),
      );

      await expect(input.customerPrompt()).resolves.toBe(validInput);
    });

    test('should reject when provided an invalid input', async () => {
      // const randomlength = Math.floor(Math.random() * 5 + 2);
      // const invalidInput = Math.random().toString(36).substring(randomlength);
      const invalidInput = new RandExp(/^[a-zA-Z0-9]{2,}$/).gen();

      input.rl.question = jest.fn().mockImplementationOnce(
        (questionText, answer) => answer(invalidInput),
      );

      await expect(input.initialPrompt()).rejects.toBeUndefined();
    });
  });
  describe('employeePrompt', () => {
    test('should resolve with the answer when provided a valid input', async () => {
      const responseOptions = ['0', '1', '2', '3', 'q'];
      const randomIndex = Math.floor(Math.random() * responseOptions.length);
      const validInput = responseOptions[randomIndex];

      input.rl.question = jest.fn().mockImplementationOnce(
        (questionText, answer) => answer(validInput),
      );

      await expect(input.employeePrompt()).resolves.toBe(validInput);
    });

    test('should reject when provided an invalid input', async () => {
      // const randomlength = Math.floor(Math.random() * 5 + 2);
      // const invalidInput = Math.random().toString(36).substring(randomlength);
      const invalidInput = new RandExp(/^[a-zA-Z0-9]{2,}$/).gen();

      input.rl.question = jest.fn().mockImplementationOnce(
        (questionText, answer) => answer(invalidInput),
      );

      await expect(input.employeePrompt()).rejects.toBeUndefined();
    });
  });
  describe('exit', () => {
    // jest.spyOn(input.rl, 'close').mockImplementationOnce(() => {});

    test('should cause the program to exit', async () => {
      jest.spyOn(process, 'exit').mockImplementation();
      await input.exit();

      expect(process.exit).toHaveBeenCalledTimes(1);
    });
  });
});
