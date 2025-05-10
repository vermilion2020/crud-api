
export enum Routes {
  users = '/api/users/',
}

export enum Methods {
  GET = 'GET',
  PUT = 'PUT',
  POST = 'POST',
  DELETE = 'DELETE',
}

export enum Statuses {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  INTERNAL_ERROR = 500,
}

export enum UserOperations {
  GET_ALL = 'getAll',
  GET_ONE = 'getOne',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}
