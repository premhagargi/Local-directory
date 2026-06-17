export class BadRequestError extends Error {
	status: number;
	constructor(message: string) {
		super(message);
		this.name = 'BadRequestError';
		this.status = 400;
	}
}

export class UnauthorizedError extends Error {
	status: number;
	constructor(message: string) {
		super(message);
		this.name = 'UnauthorizedError';
		this.status = 401;
	}
}

export class InternalServerError extends Error {
	status: number;
	constructor(message: string) {
		super(message);
		this.name = 'InternalServerError';
		this.status = 500;
	}
}

export class HookFormError<T> extends Error {
	status: number;
	errorObject: T;

	constructor(errorObject: T) {
		super('Hook Form Validation Error');
		this.name = 'HookFormError';
		this.status = 400;
		this.errorObject = errorObject;
	}
}

type ServerErrorResponse<T = any> = {
	errors: T;
	error: string;
	success: false;
	data: T;
};

type ServerSuccessResponse<T = any> = {
	errors: {};
	error: string;
	success: true;
	data: T;
};

export type ServerResponse<T = any, E = any> =
	| ServerSuccessResponse<T>
	| ServerErrorResponse<E>;

export function handleServerError<E = any>(
	error: any,
	errorObject: E = {} as E
): ServerErrorResponse<E> {
	if (
		error instanceof BadRequestError ||
		error instanceof UnauthorizedError ||
		error instanceof InternalServerError
	) {
		return {
			errors: errorObject,
			error: error.message,
			success: false,
			data: errorObject,
		};
	} else if (error instanceof HookFormError) {
		return {
			errors: (error as HookFormError<any>).errorObject,
			error: error.message,
			success: false,
			data: errorObject,
		};
	} else {
		console.error(`Unexpected error:`, error);

		return {
			errors: errorObject,
			error: 'Unknown Internal server error',
			success: false,
			data: errorObject,
		};
	}
}

export function handleServerSuccess<T = any>(
	data: T = [] as unknown as T,
	count?: number
) {
	return {
		errors: {},
		error: '',
		success: true,
		data,
		...(count ? { count } : {}),
	};
}
