import { error_to_string } from './response_helpers.ts'

const SUCCESS = Symbol('SUCCESS')
const FAILURE = Symbol('FAILURE')
const INTERRUPT = Symbol('INTERRUPT')

type Types = typeof SUCCESS | typeof FAILURE | typeof INTERRUPT

export type SuccessResult<SuccessValue> = {
	type: typeof SUCCESS
	value: SuccessValue
}

export type FailureResult<FailureValue> = {
	type: typeof FAILURE
	value: FailureValue
}

export type InterruptResult<InterruptValue> = {
	type: typeof INTERRUPT
	value: InterruptValue
}
export type Result<SuccessValue, FailureValue, InterruptValue> = SuccessResult<SuccessValue> | FailureResult<FailureValue> | InterruptResult<InterruptValue>

const is_object_with_property = <K extends string>(object: unknown, property: K): object is { [key in K]: unknown } => !!object && typeof object === 'object' && property in object

const is_result = <SuccessValue, FailureValue, InterruptValue>(result: unknown): result is Result<SuccessValue, FailureValue, InterruptValue> => is_object_with_property(result, 'type') && (result.type === SUCCESS || result.type === FAILURE || result.type === INTERRUPT)

const success = <SuccessValue>(value: SuccessValue): SuccessResult<SuccessValue> => ({ type: SUCCESS, value })
const failure = <FailureValue>(value: FailureValue): FailureResult<FailureValue> => ({ type: FAILURE, value })
const interrupt = <InterruptValue>(value: InterruptValue): InterruptResult<InterruptValue> => ({ type: INTERRUPT, value })

export const Result = {
	success,
	failure,
	interrupt,
}

export const is_success = <SuccessValue, FailureValue, InterruptValue>(result: Result<SuccessValue, FailureValue, InterruptValue>): result is SuccessResult<SuccessValue> => result.type === SUCCESS
export const is_failure = <SuccessValue, FailureValue, InterruptValue>(result: Result<SuccessValue, FailureValue, InterruptValue>): result is FailureResult<FailureValue> => result.type === FAILURE
export const is_interrupt = <SuccessValue, FailureValue, InterruptValue>(result: Result<SuccessValue, FailureValue, InterruptValue>): result is InterruptResult<InterruptValue> => result.type === INTERRUPT

type Middleware<Input, SuccessValue, FailureValue, InterruptValue> = (a: Input) => Result<SuccessValue, FailureValue, InterruptValue> | Promise<Result<SuccessValue, FailureValue, InterruptValue>>

const make_unexpected_error_result = (error_texts: {message: string, stack: string | null}) => Result.failure(error_texts)
type UnexpectedErrorResult = ReturnType<typeof make_unexpected_error_result>

async function pipeline<
	InitialValue,
	FailureValue,
	InterruptValue
>(
	initial: InitialValue,
	...middlewares: []
): Promise<SuccessResult<InitialValue>>

async function pipeline<
	InitialValue,
	S1,
	FailureValue,
	InterruptValue
>(
	initial: InitialValue,
	m1: Middleware<InitialValue, S1, FailureValue, InterruptValue>
): Promise<Result<S1, FailureValue | UnexpectedErrorResult, InterruptValue>>

async function pipeline<
	InitialValue,
	S1,
	S2,
	FailureValue,
	InterruptValue
>(
	initial: InitialValue,
	m1: Middleware<InitialValue, S1, FailureValue, InterruptValue>,
	m2: Middleware<S1, S2, FailureValue, InterruptValue>
): Promise<Result<S2, FailureValue | UnexpectedErrorResult, InterruptValue>>

async function pipeline<
	InitialValue,
	S1,
	S2,
	S3,
	FailureValue,
	InterruptValue
>(
	initial: InitialValue,
	m1: Middleware<InitialValue, S1, FailureValue, InterruptValue>,
	m2: Middleware<S1, S2, FailureValue, InterruptValue>,
	m3: Middleware<S2, S3, FailureValue, InterruptValue>
): Promise<Result<S3, FailureValue | UnexpectedErrorResult, InterruptValue>>

async function pipeline<
	InitialValue,
	S1,
	S2,
	S3,
	S4,
	FailureValue,
	InterruptValue
>(
	initial: InitialValue,
	m1: Middleware<InitialValue, S1, FailureValue, InterruptValue>,
	m2: Middleware<S1, S2, FailureValue, InterruptValue>,
	m3: Middleware<S2, S3, FailureValue, InterruptValue>,
	m4: Middleware<S3, S4, FailureValue, InterruptValue>
): Promise<Result<S4, FailureValue | UnexpectedErrorResult, InterruptValue>>

async function pipeline<
	InitialValue,
	S1,
	S2,
	S3,
	S4,
	S5,
	FailureValue,
	InterruptValue
>(
	initial: InitialValue,
	m1: Middleware<InitialValue, S1, FailureValue, InterruptValue>,
	m2: Middleware<S1, S2, FailureValue, InterruptValue>,
	m3: Middleware<S2, S3, FailureValue, InterruptValue>,
	m4: Middleware<S3, S4, FailureValue, InterruptValue>,
	m5: Middleware<S4, S5, FailureValue, InterruptValue>
): Promise<Result<S5, FailureValue | UnexpectedErrorResult, InterruptValue>>

async function pipeline<
	InitialValue,
	S1,
	S2,
	S3,
	S4,
	S5,
	S6,
	FailureValue,
	InterruptValue
>(
	initial: InitialValue,
	m1: Middleware<InitialValue, S1, FailureValue, InterruptValue>,
	m2: Middleware<S1, S2, FailureValue, InterruptValue>,
	m3: Middleware<S2, S3, FailureValue, InterruptValue>,
	m4: Middleware<S3, S4, FailureValue, InterruptValue>,
	m5: Middleware<S4, S5, FailureValue, InterruptValue>,
	m6: Middleware<S5, S6, FailureValue, InterruptValue>
): Promise<Result<S6, FailureValue | UnexpectedErrorResult, InterruptValue>>

async function pipeline<
	InitialValue,
	S1,
	S2,
	S3,
	S4,
	S5,
	S6,
	S7,
	FailureValue,
	InterruptValue
>(
	initial: InitialValue,
	m1: Middleware<InitialValue, S1, FailureValue, InterruptValue>,
	m2: Middleware<S1, S2, FailureValue, InterruptValue>,
	m3: Middleware<S2, S3, FailureValue, InterruptValue>,
	m4: Middleware<S3, S4, FailureValue, InterruptValue>,
	m5: Middleware<S4, S5, FailureValue, InterruptValue>,
	m6: Middleware<S5, S6, FailureValue, InterruptValue>,
	m7: Middleware<S6, S7, FailureValue, InterruptValue>
): Promise<Result<S7, FailureValue | UnexpectedErrorResult, InterruptValue>>

async function pipeline<
	InitialValue,
	S1,
	S2,
	S3,
	S4,
	S5,
	S6,
	S7,
	S8,
	FailureValue,
	InterruptValue
>(
	initial: InitialValue,
	m1: Middleware<InitialValue, S1, FailureValue, InterruptValue>,
	m2: Middleware<S1, S2, FailureValue, InterruptValue>,
	m3: Middleware<S2, S3, FailureValue, InterruptValue>,
	m4: Middleware<S3, S4, FailureValue, InterruptValue>,
	m5: Middleware<S4, S5, FailureValue, InterruptValue>,
	m6: Middleware<S5, S6, FailureValue, InterruptValue>,
	m7: Middleware<S6, S7, FailureValue, InterruptValue>,
	m8: Middleware<S7, S8, FailureValue, InterruptValue>
): Promise<Result<S8, FailureValue | UnexpectedErrorResult, InterruptValue>>

async function pipeline<
	InitialValue,
	S1,
	S2,
	S3,
	S4,
	S5,
	S6,
	S7,
	S8,
	S9,
	FailureValue,
	InterruptValue
>(
	initial: InitialValue,
	m1: Middleware<InitialValue, S1, FailureValue, InterruptValue>,
	m2: Middleware<S1, S2, FailureValue, InterruptValue>,
	m3: Middleware<S2, S3, FailureValue, InterruptValue>,
	m4: Middleware<S3, S4, FailureValue, InterruptValue>,
	m5: Middleware<S4, S5, FailureValue, InterruptValue>,
	m6: Middleware<S5, S6, FailureValue, InterruptValue>,
	m7: Middleware<S6, S7, FailureValue, InterruptValue>,
	m8: Middleware<S7, S8, FailureValue, InterruptValue>,
	m9: Middleware<S8, S9, FailureValue, InterruptValue>
): Promise<Result<S9, FailureValue | UnexpectedErrorResult, InterruptValue>>

async function pipeline<
	InitialValue,
	S1,
	S2,
	S3,
	S4,
	S5,
	S6,
	S7,
	S8,
	S9,
	S10,
	FailureValue,
	InterruptValue
>(
	initial: InitialValue,
	m1: Middleware<InitialValue, S1, FailureValue, InterruptValue>,
	m2: Middleware<S1, S2, FailureValue, InterruptValue>,
	m3: Middleware<S2, S3, FailureValue, InterruptValue>,
	m4: Middleware<S3, S4, FailureValue, InterruptValue>,
	m5: Middleware<S4, S5, FailureValue, InterruptValue>,
	m6: Middleware<S5, S6, FailureValue, InterruptValue>,
	m7: Middleware<S6, S7, FailureValue, InterruptValue>,
	m8: Middleware<S7, S8, FailureValue, InterruptValue>,
	m9: Middleware<S8, S9, FailureValue, InterruptValue>,
	m10: Middleware<S9, S10, FailureValue, InterruptValue>
): Promise<Result<S10, FailureValue | UnexpectedErrorResult, InterruptValue>>

async function pipeline(
	initial: any,
	...middlewares: Middleware<any, any, any, any>[]
): Promise<Result<any, any, any>> {
	let current: Result<any, any, any> = success(initial)

	for (const middleware of middlewares) {
		try {
			const next = await middleware(current.value)
			if (!is_result(next)) {
				return failure(next)
			}
			current = next
		} catch (error) {
			return make_unexpected_error_result(error_to_string(error))
		}

		if (!is_success(current)) {
			return current
		}
	}

	return current
}
export default pipeline
