import { UserDTO } from "../utils/user.type.ts";

export const validateId = (id: string) => {
  let error = '';
  if (!id) {
    error = 'User id is required';
  } else if (!/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(id)) {
    error = `${id} is invalid, a valid uuid should be passed`;
  }
  return error;
}

export const validateBody = (body?: string) => {
  let errors = [];
  let user: UserDTO | null = null;

  if (!body) {
    errors.push('Invalid request body: body should not be empty');
  } else {
    try {
      user = JSON.parse(body) as UserDTO;
      if (!user.username) {
        errors.push('Username is required.');
      } else if (typeof user.username !== 'string') {
        errors.push('Username should be a string.');
      }
      if (!user.age) {
        errors.push('Age is required.');
      } else if (typeof user.age !== 'number') {
        errors.push('Age should be a number.');
      }
      if (!user.hobbies) {
        errors.push('Hobbies are required.');
      } else if (!Array.isArray(user.hobbies) || user.hobbies.some(hobby => typeof hobby !== 'string')) {
        errors.push('Hobbies should be an array of strings.');
      }

    } catch (error) {
      errors.push('Invalid request body: body should be a valid json');
    }
  }

  return {
    user,
    errors
  }
}